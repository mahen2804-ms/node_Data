const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
let usStates = require("./usStates.json");
const app = express();
app.get("/states", (req, res) => {
  res.json(usStates);
});
app.listen(8000, () => {
  console.log(`Array of US States at this port 8000`);
});