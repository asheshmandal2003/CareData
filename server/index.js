require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
