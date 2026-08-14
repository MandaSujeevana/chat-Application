import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      let email = `${userId}@clerk.user`;
      let fullName = "User";
      let profilePic = "";

      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (clerkUser) {
          const primaryEmailObj = clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId);
          const firstEmailObj = clerkUser.emailAddresses?.[0];
          email = primaryEmailObj?.emailAddress || firstEmailObj?.emailAddress || email;
          fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || fullName;
          profilePic = clerkUser.imageUrl || "";
        }
      } catch (err) {
        console.warn("Could not fetch Clerk user in protectRoute:", err.message);
      }

      const existingEmailUser = await User.findOne({ email });
      const safeEmail = existingEmailUser ? `${userId}_${email}` : email;

      user = await User.create({
        clerkId: userId,
        email: safeEmail,
        fullName,
        profilePic,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}