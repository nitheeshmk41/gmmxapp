const { Client, Databases } = require("node-appwrite");
require("dotenv").config();

async function run() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";
  
  console.log("Creating TESTIMONIALS collection...");
  try {
    await databases.createCollection(dbId, "testimonials", "Testimonials");
    console.log("Created TESTIMONIALS collection.");
  } catch (e) {
    if (e.code === 409) {
      console.log("TESTIMONIALS collection already exists.");
    } else {
      console.error("Error creating TESTIMONIALS collection:", e.message);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const fields = [
    { key: "gymId", type: "string", size: 50, required: true },
    { key: "name", type: "string", size: 255, required: true },
    { key: "review", type: "string", size: 5000, required: true },
    { key: "rating", type: "integer", required: true },
  ];

  for (const field of fields) {
    try {
      if (field.type === "integer") {
        await databases.createIntegerAttribute(dbId, "testimonials", field.key, field.required, 1, 5);
      } else {
        await databases.createStringAttribute(dbId, "testimonials", field.key, field.size, field.required);
      }
      console.log(`Created attribute: ${field.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Attribute ${field.key} already exists.`);
      } else {
        console.error(`Error creating ${field.key}:`, e.message);
      }
    }
  }

  // Create Indexes
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    await databases.createIndex(dbId, "testimonials", "idx_gymId", "key", ["gymId"]);
    console.log("Created gymId index for testimonials.");
  } catch (e) {
    if (e.code === 409) console.log("Index already exists.");
    else console.error("Error creating index:", e.message);
  }

  console.log("Done!");
}

run();
