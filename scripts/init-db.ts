import { Client, Databases } from "node-appwrite";
import { config } from "dotenv";

config();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";

async function setup() {
  console.log("Setting up Appwrite Database and Collections...");
  try {
    await databases.create(DB_ID, "GMMX Database");
    console.log(`✅ Database ${DB_ID} created or already exists.`);
  } catch (e: any) {
    if (e.code !== 409) throw e;
  }

  const collections = [
    { id: "gyms", name: "Gyms" },
    { id: "gym_users", name: "Gym Users" },
    { id: "members", name: "Members" },
    { id: "trainers", name: "Trainers" },
    { id: "attendance", name: "Attendance" },
    { id: "membership_plans", name: "Membership Plans" },
    { id: "payments", name: "Payments" },
    { id: "subscriptions", name: "Subscriptions" },
    { id: "settings", name: "Settings" }
  ];

  for (const col of collections) {
    try {
      await databases.createCollection(DB_ID, col.id, col.name);
      console.log(`✅ Collection ${col.name} created.`);
    } catch (e: any) {
      if (e.code !== 409) {
        console.error(`❌ Failed to create collection ${col.name}:`, e.message);
      } else {
        console.log(`✅ Collection ${col.name} already exists.`);
      }
    }
  }
  
  console.log("Setup complete. You can now define attributes in the Appwrite Console.");
}

setup();
