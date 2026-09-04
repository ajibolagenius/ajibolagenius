"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

// Holds the resolver for the in-flight startViewTransition promise
let pendingResolver: (() => void) | null = null;

/**
 * Route-level view transition hook.
 *
 * Wraps Next.js App Router navigation in the native document.startViewTransition API.
 * When an element on the originating page shares a `view-transition-name`
 * (e.g. `project-${slug}`) with a matching element on the destination page,
 * the browser smoothly morphs the card into the hero header (and vice versa).
 */
export function useRouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();

  // When pathname changes after router.push, the new page's DOM has mounted.
  // Resolving the promise lets the browser take the new snapshot and animate.
  useEffect(() => {
    if (pendingResolver) {
      pendingResolver();
      pendingResolver = null;
    }
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (
        reduceMotion ||
        typeof document === "undefined" ||
        !document.startViewTransition
      ) {
        router.push(href);
        return;
      }

      if (pathname === href) {
        router.push(href);
        return;
      }

      const root = document.documentElement;
      root.dataset.vt = "project-route";

      const transition = document.startViewTransition(() => {
        return new Promise<void>((resolve) => {
          pendingResolver = resolve;
          router.push(href);

          // Safety timeout in case navigation is interrupted or delayed
          setTimeout(() => {
            if (pendingResolver === resolve) {
              pendingResolver();
              pendingResolver = null;
            }
          }, 2500);
        });
      });

      transition.finished.finally(() => {
        if (root.dataset.vt === "project-route") {
          delete root.dataset.vt;
        }
      });
    },
    [pathname, reduceMotion, router],
  );

  return navigate;
}
