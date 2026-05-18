"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NavigationGuardContextType {
  /** Register this page as having unsaved changes */
  setDirty: (dirty: boolean) => void;
  /** Whether the current page has unsaved changes */
  isDirty: boolean;
}

const NavigationGuardContext = createContext<NavigationGuardContextType>({
  setDirty: () => {},
  isDirty: false,
});

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}

export function NavigationGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const dirtyRef = useRef(false);

  // Keep ref in sync for event handlers
  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  // Reset dirty state when pathname changes (navigation completed)
  useEffect(() => {
    setIsDirty(false);
    dirtyRef.current = false;
  }, [pathname]);

  const setDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
    dirtyRef.current = dirty;
  }, []);

  const confirmNavigation = useCallback(() => {
    setShowDialog(false);
    setIsDirty(false);
    dirtyRef.current = false;
    if (pendingUrl) {
      router.push(pendingUrl);
      setPendingUrl(null);
    }
  }, [pendingUrl, router]);

  const cancelNavigation = useCallback(() => {
    setShowDialog(false);
    setPendingUrl(null);
  }, []);

  // Intercept all <a> tag clicks for client-side navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!dirtyRef.current) return;

      // Walk up from target to find closest <a>
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, mailto, tel, etc.
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // Skip if target is _blank
      if (anchor.target === "_blank") return;

      // Skip if it's the same page
      if (href === pathname) return;

      // This is an internal navigation — intercept it
      e.preventDefault();
      e.stopPropagation();
      setPendingUrl(href);
      setShowDialog(true);
    };

    // Use capture phase to intercept before Next.js Link handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (!isDirty) return;

    // Push a dummy state so we can intercept back button
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (dirtyRef.current) {
        // Re-push to prevent navigation
        window.history.pushState(null, "", window.location.href);
        setPendingUrl("__back__");
        setShowDialog(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  const handleConfirmWithBack = useCallback(() => {
    setShowDialog(false);
    setIsDirty(false);
    dirtyRef.current = false;
    if (pendingUrl === "__back__") {
      // Go back
      window.history.go(-1);
    } else if (pendingUrl) {
      router.push(pendingUrl);
    }
    setPendingUrl(null);
  }, [pendingUrl, router]);

  return (
    <NavigationGuardContext.Provider value={{ setDirty, isDirty }}>
      {children}

      <AlertDialog open={showDialog} onOpenChange={cancelNavigation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmWithBack}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NavigationGuardContext.Provider>
  );
}
