const { Router } = require("express");
const { save } = require("./save_json");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

let usStates = require("./usStates.json");
const app = express();


const router = new Router();

router.get("/", (req, res) => {
  res.json(usStates);
});

router.get("/:name", (req, res) => {
  const findState = usStates.find((state) => state.state === req.params.name);
  if (!findState) {
    res.status(404).send("state with name was not found");
  } else {
    res.json(findState);
  }
});

router.post("/", (req, res) => {
  usStates.push(req.body);
  save(usStates);
  res.json({
    status: "success",
    stateInfo: req.body,
  });
});

router.put("/:name", (req, res) => {
 
  usStates = usStates.map((state) => {
    if (state.state === req.params.name) {
      return req.body;
    } else {
      return state;
    }
  });
  save(usStates);

  res.json({
    status: "success",
    stateInfo: req.body,
  });
});

router.delete("/:name", (req, res) => {
  usStates = usStates.filter((state) => state.state !== req.params.name);
  save(usStates);
  res.json({
    status: "success",
    removed: req.params.name,
    newLength: usStates.length,
  });
});

app.listen(4000, () => {
  console.log(`Array of US States at http://localhost:4000`);
});

module.exports = router;