import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

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
        const email =
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses?.[0]?.emailAddress ||
          `${user.id}@clerk.user`;

        const fullName =
          user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          email.split("@")[0] ||
          "User";

        const profilePic = user.imageUrl || "";

        const response = await fetch(`${BACKEND_URL}/api/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, fullName, profilePic }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to sync user with backend:", errorData);
          return;
        }

        const data = await response.json();
        console.log("User successfully synced with MongoDB:", data);
        syncedRef.current = true;

        // Fetch users & conversations as soon as profile sync is complete
        useAuthStore.getState().checkAuth();
        useChatStore.getState().getUsers();
        useChatStore.getState().getConversations();
      } catch (error) {
        console.error("Error calling /api/auth/sync:", error);
      }
    };

    if (!syncedRef.current) {
      syncUserWithBackend();
    }
  }, [isLoaded, isSignedIn, user, getToken]);
}


