const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
let std = require("./student.json");
const app = express();
//save function
const save = () => {
  fs.writeFile(
    "./student.json",
    JSON.stringify(std, null, 2),
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
};

app.get("/students", (req, res) => {
  res.json(std);
});
app.get("/students/:name", (req, res) => {
  const findstd = std.find((Fname) => Fname.Fname === req.params.name);
  res.json(findstd);
});
app.post("/students", bodyParser.json(), (req, res) => {
    std.push(req.body);
  save();
  res.json({
    Fname: "success",
    stateInfo: req.body,
  });
});

app.put("/students/:name", bodyParser.json(), (req, res) => {
    std = std.map((Fname) => {
    if (Fname.Fname === req.params.name) {
      return req.body;
    } else {
      return Fname;
    }
  });
  save();
res.json({
    Fname: "success",
    stateInfo: req.body,
  });
});

app.delete("/students/:name", (req, res) => {
    std = std.filter((Fname) => Fname.Fname !== req.params.name);
  save();
  res.json({
    Fname: "success",
    removed: req.params.name,
    newLength: std.length,
  });
});

app.listen(8000, () => {
  console.log(`Array of US States at port 8000`);
});
