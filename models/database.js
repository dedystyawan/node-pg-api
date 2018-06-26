const pg = require("pg");

// conString = "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:5l4ckm4N*@localhost:5968/test";

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  "CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)"
);
query.on("end", () => {
  client.end();
});
