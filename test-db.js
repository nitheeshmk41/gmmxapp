const { Client } = require('pg');

async function test(host) {
  const c = new Client(`postgresql://postgres:Mk01yTPNtUre9BnuY1QVTIl3Q9O5zxXP@${host}:5432/postgres`);
  try {
    await c.connect();
    console.log(`Connected successfully to ${host}!`);
    await c.end();
  } catch (e) {
    console.log(`Failed connecting to ${host}: ${e.message}`);
  }
}

async function main() {
  await test('127.0.0.1');
  await test('localhost');
  await test('api.gmmx.app');
  await test('143.244.131.198');
}

main();
