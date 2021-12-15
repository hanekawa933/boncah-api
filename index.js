const express = require("express");
const app = express();
const { connection } = require("./db/connection");

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
