async function test(host) {
  const { Client } = await import("pg");
  const baseUrl = process.env.DATABASE_URL;

  if (!baseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(baseUrl);
  url.hostname = host;

  const client = new Client(url.toString());
  try {
    await client.connect();
    console.log(`Connected successfully to ${host}!`);
  } catch (error) {
    console.log(`Failed connecting to ${host}: ${error.message}`);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function main() {
  await test("127.0.0.1");
  await test("localhost");
  await test("api.gmmx.app");
  await test("143.244.131.198");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
