const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
