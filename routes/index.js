var express = require("express");
var router = express.Router();

// var app = express();
// var bodyParser = require("body-parser");
// app.use(bodyParser.json());

const pg = require("pg");
const path = require("path");
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:5l4ckm4N*@localhost:5968/test";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Assalamualaikum" });
});

router.get("/api", (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM mahasiswa ORDER BY nim ASC;");
    // Stream results back one row at a time
    query.on("row", row => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on("end", () => {
      done();
      return res.json(results);
    });
  });
});

router.post("/api", (req, res, next) => {
  const results = [];
  // Grab data from http request
  // const data = { text: req.body.text, complete: false };
  const data = {
    nim: req.body.nim,
    nama: req.body.nama,
    alamat: req.body.alamat
  };
  console.log(req.body);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Insert Data
    client.query(
      "INSERT INTO mahasiswa(nim, nama, alamat) values($1, $2, $3)",
      [data.nim, data.nama, data.alamat]
    );
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM mahasiswa ORDER BY nim ASC");
    // Stream results back one row at a time
    query.on("row", row => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on("end", () => {
      done();
      return res.json(results);
    });
  });
});

router.put("/api/:nim", (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const nim = req.params.nim;
  // Grab data from http request
  // const data = { text: req.body.text, complete: req.body.complete };
  const data = {
    nama: req.body.nama,
    alamat: req.body.alamat
  };
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Update Data
    client.query("UPDATE mahasiswa SET nama=($1), alamat=($2) WHERE nim=($3)", [
      data.nama,
      data.alamat,
      nim
    ]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM mahasiswa ORDER BY nim ASC");
    // Stream results back one row at a time
    query.on("row", row => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on("end", function() {
      done();
      return res.json(results);
    });
  });
});

router.delete("/api/:nim", (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const nim = req.params.nim;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Delete Data
    client.query("DELETE FROM mahasiswa WHERE nim=($1)", [nim]);
    // SQL Query > Select Data
    var query = client.query("SELECT * FROM mahasiswa ORDER BY nim ASC");
    // Stream results back one row at a time
    query.on("row", row => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on("end", () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
