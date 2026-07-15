"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UpdateModal } from "./update-modal";

const UPDATE_CHECK_INTERVAL_MS = 60_000;

export function ServiceWorkerRegistration() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );
  const [updating, setUpdating] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    let cancelled = false;

    const handleWaitingWorker = (worker: ServiceWorker | null) => {
      if (worker) setWaitingWorker(worker);
    };

    async function register() {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      if (cancelled) return;
      registrationRef.current = registration;

      handleWaitingWorker(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            handleWaitingWorker(registration.waiting ?? installingWorker);
          }
        });
      });

      const checkForUpdates = () => registration.update().catch(() => {});
      const interval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL_MS);
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") checkForUpdates();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    const cleanupPromise = register();

    const onControllerChange = () => {
      if (reloadingRef.current) return;
      reloadingRef.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    return () => {
      cancelled = true;
      cleanupPromise.then((cleanup) => cleanup?.());
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  const handleUpdate = useCallback(() => {
    if (!waitingWorker) return;
    setUpdating(true);
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }, [waitingWorker]);

  if (!waitingWorker) return null;

  return <UpdateModal onUpdate={handleUpdate} updating={updating} />;
}
