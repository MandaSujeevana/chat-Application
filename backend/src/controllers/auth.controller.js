import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/user.model.js";

export async function checkAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json(req.user);
}

export async function syncUser(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { email, fullName, profilePic } = req.body || {};

    if (!email || !fullName) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (clerkUser) {
          const primaryEmailObj = clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId);
          const firstEmailObj = clerkUser.emailAddresses?.[0];
          const fetchedEmail = primaryEmailObj?.emailAddress || firstEmailObj?.emailAddress || "";

          email = email || fetchedEmail;

          fullName =
            fullName ||
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            clerkUser.username ||
            (email ? email.split("@")[0] : "User");

          profilePic = profilePic || clerkUser.imageUrl || "";
        }
      } catch (clerkErr) {
        console.warn("Could not fetch user details from Clerk SDK:", clerkErr.message);
      }
    }

    const finalEmail = email || `${userId}@clerk.user`;
    const finalFullName = fullName || "User";
    const finalProfilePic = profilePic || "";

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const existingEmailUser = await User.findOne({ email: finalEmail });
      const safeEmail = existingEmailUser ? `${userId}_${finalEmail}` : finalEmail;

      user = await User.create({
        clerkId: userId,
        email: safeEmail,
        fullName: finalFullName,
        profilePic: finalProfilePic,
      });
    } else {
      let updated = false;
      if (finalEmail && user.email !== finalEmail) {
        user.email = finalEmail;
        updated = true;
      }
      if (finalFullName && user.fullName !== finalFullName) {
        user.fullName = finalFullName;
        updated = true;
      }
      if (finalProfilePic && user.profilePic !== finalProfilePic) {
        user.profilePic = finalProfilePic;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in syncUser controller:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}