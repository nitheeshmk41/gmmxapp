const { Client, Databases, Storage } = require("node-appwrite");
require("dotenv").config();

async function run() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);
  
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";
  
  console.log("Updating schema for DB:", dbId);

  // 1. Create fields in GYMS collection
  console.log("Updating GYMS collection...");
  const gymFields = [
    { key: "tagline", type: "string", size: 255, required: false },
    { key: "description", type: "string", size: 2000, required: false },
    { key: "bannerUrl", type: "string", size: 1000, required: false },
    { key: "themeStyle", type: "string", size: 50, required: false },
    { key: "city", type: "string", size: 100, required: false },
    { key: "address", type: "string", size: 1000, required: false },
    { key: "phone", type: "string", size: 20, required: false },
    { key: "whatsapp", type: "string", size: 20, required: false },
    { key: "email", type: "string", size: 255, required: false },
    { key: "workingHours", type: "string", size: 255, required: false },
    { key: "mapsLink", type: "string", size: 1000, required: false },
    { key: "instagramUrl", type: "string", size: 1000, required: false },
    { key: "facebookUrl", type: "string", size: 1000, required: false },
    { key: "youtubeUrl", type: "string", size: 1000, required: false },
  ];

  for (const field of gymFields) {
    try {
      await databases.createStringAttribute(dbId, "gyms", field.key, field.size, field.required);
      console.log(`Created string attribute: ${field.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Attribute ${field.key} already exists.`);
      } else {
        console.error(`Error creating ${field.key}:`, e.message);
      }
    }
  }

  // Arrays
  const arrayFields = [
    { key: "services", type: "string", size: 100, required: false, array: true },
    { key: "gallery", type: "string", size: 1000, required: false, array: true },
    { key: "testimonials", type: "string", size: 5000, required: false, array: false }, // Stored as JSON string
  ];

  for (const field of arrayFields) {
    try {
      await databases.createStringAttribute(dbId, "gyms", field.key, field.size, field.required, undefined, field.array);
      console.log(`Created attribute: ${field.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Attribute ${field.key} already exists.`);
      } else {
        console.error(`Error creating ${field.key}:`, e.message);
      }
    }
  }

  // 2. Create LEADS collection
  console.log("\nCreating LEADS collection...");
  try {
    await databases.createCollection(dbId, "leads", "Leads");
    console.log("Created LEADS collection.");
  } catch (e) {
    if (e.code === 409) {
      console.log("LEADS collection already exists.");
    } else {
      console.error("Error creating LEADS collection:", e.message);
    }
  }

  // Wait a bit for collection creation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const leadFields = [
    { key: "gymId", type: "string", size: 50, required: true },
    { key: "name", type: "string", size: 255, required: true },
    { key: "phone", type: "string", size: 20, required: true },
    { key: "status", type: "string", size: 50, required: true }, // "New", "Contacted", etc
    { key: "source", type: "string", size: 100, required: false },
    { key: "createdAt", type: "string", size: 50, required: true },
  ];

  for (const field of leadFields) {
    try {
      await databases.createStringAttribute(dbId, "leads", field.key, field.size, field.required);
      console.log(`Created lead attribute: ${field.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Attribute ${field.key} already exists in leads.`);
      } else {
        console.error(`Error creating ${field.key} in leads:`, e.message);
      }
    }
  }

  // Create Indexes for Leads
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    await databases.createIndex(dbId, "leads", "idx_gymId", "key", ["gymId"]);
    console.log("Created gymId index for leads.");
  } catch (e) {
    if (e.code === 409) console.log("Index already exists.");
    else console.error("Error creating index:", e.message);
  }

  // 3. Create Storage Bucket for Gym Assets
  console.log("\nCreating gym-assets storage bucket...");
  try {
    await storage.createBucket("gym-assets", "Gym Assets", [
      'read("any")',
      'write("users")',
      'update("users")',
      'delete("users")'
    ]);
    console.log("Created gym-assets bucket.");
  } catch (e) {
    if (e.code === 409) {
      console.log("gym-assets bucket already exists.");
    } else {
      console.error("Error creating gym-assets bucket:", e.message);
    }
  }

  console.log("\nDone!");
}

run();
