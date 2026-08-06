import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function useSyncUser() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      syncedRef.current = false;
      return;
    }

    const syncUserWithBackend = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${BACKEND_URL}/api/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to sync user with backend:", errorData);
          return;
        }

        const data = await response.json();
        console.log("User successfully synced with MongoDB:", data);
        syncedRef.current = true;
      } catch (error) {
        console.error("Error calling /api/auth/sync:", error);
      }
    };

    if (!syncedRef.current) {
      syncUserWithBackend();
    }
  }, [isLoaded, isSignedIn, user, getToken]);
}
