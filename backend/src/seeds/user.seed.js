import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

const seedUsers = [
  ["seed_rahul_tej", "Rahul Tej", "rahul.tej@example.com", "https://i.pravatar.cc/150?img=1"],
  ["seed_sam_samyuktha", "Sam Samyuktha", "sam.samyuktha@example.com", "https://i.pravatar.cc/150?img=2"],
  ["seed_jordan_lee", "Jordan Lee", "jordan.lee@example.com", "https://i.pravatar.cc/150?img=3"],
  ["seed_maya_raj", "Maya Raj", "maya.raj@example.com", "https://i.pravatar.cc/150?img=4"],
  [
    "seed_leela_morgan",
    "leela Morgan",
    "leela.morgan@example.com",
    "https://i.pravatar.cc/150?img=5",
  ],
  ["seed_V_kim", "V Kim", "v.kim@example.com", "https://i.pravatar.cc/150?img=6"],
  [
    "seed_taylor_swift",
    "Taylor Swift",
    "taylor.swift@example.com",
    "https://i.pravatar.cc/150?img=7",
  ],
  [
    "seed_jamie_prakash",
    "Jamie Prakash",
    "jamie.prakash@example.com",
    "https://i.pravatar.cc/150?img=8",
  ],
  ["seed_Akshaya_reed", "Akshaya Reed", "akshaya.reed@example.com", "https://i.pravatar.cc/150?img=9"],
  [
    "seed_travis_scott",
    "Travis Scott",
    "travis.scott@example.com",
    "https://i.pravatar.cc/150?img=10",
  ],
  [
    "seed_sanvi_satish",
    "Sanvi Satish",
    "sanvi.satish@example.com",
    "https://i.pravatar.cc/150?img=11",
  ],
  ["seed_david_paul", "David Paul", "david.paul@example.com", "https://i.pravatar.cc/150?img=12"],
  [
    "seed_ethan_evans",
    "Ethan Evans",
    "ethan.evans@example.com",
    "https://i.pravatar.cc/150?img=13",
  ],
  [
    "seed_Joy_Kim",
    "Joy Kim",
    "joy.kim@example.com",
    "https://i.pravatar.cc/150?img=14",
  ],
  [
    "seed_charlie_bennett",
    "Charlie Bennett",
    "charlie.bennett@example.com",
    "https://i.pravatar.cc/150?img=15",
  ],
  [
    "seed_emerson_escalus",
    "Emerson Escalus",
    "emerson.escalus@example.com",
    "https://i.pravatar.cc/150?img=16",
  ],
  [
    "seed_finley_finn",
    "Finley Finn",
    "finley.finn@example.com",
    "https://i.pravatar.cc/150?img=17",
  ],
  [
    "seed_lively_blake",
    "Lively Blake",
    "lively.blake@example.com",
    "https://i.pravatar.cc/150?img=18",
  ],
  [
    "seed_sage_cooper",
    "Sage Cooper",
    "sage.cooper@example.com",
    "https://i.pravatar.cc/150?img=19",
  ],
  [
    "seed_reese_candy",
    "Reese Candy",
    "reese.candy@example.com",
    "https://i.pravatar.cc/150?img=20",
  ],
];

async function seedDatabase() {
  await connectDB();

  const result = await User.bulkWrite(
    seedUsers.map(([clerkId, fullName, email, profilePic]) => ({
      updateOne: {
        filter: { clerkId },
        update: {
          $set: { clerkId, fullName, email, profilePic },
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded users. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`,
  );
}

seedDatabase()
  .catch((error) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });