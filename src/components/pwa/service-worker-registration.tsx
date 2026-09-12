"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UpdateModal } from "./update-modal";
import { track } from "@/lib/analytics";

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
      if (!worker) return;
      track("pwa_update_offered");
      setWaitingWorker(worker);
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

    const onBeforeInstallPrompt = () => track("pwa_install_prompted");
    const onInstalled = () => track("pwa_installed");
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

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
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      cleanupPromise.then((cleanup) => cleanup?.());
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  const handleUpdate = useCallback(() => {
    if (!waitingWorker) return;
    track("pwa_update_accepted");
    setUpdating(true);
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }, [waitingWorker]);

  if (!waitingWorker) return null;

  return <UpdateModal onUpdate={handleUpdate} updating={updating} />;
}
