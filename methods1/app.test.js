const request = require('supertest');
const mongoose = require('mongoose');
var createError = require('http-errors');
const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');

// New app using express module
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const students = ["amit", "sumit", "hari", "shayam"];

// app.get("/", (req, res) => {
//   return res.json(students);
// });

describe("GET /students", () => {
  test("It responds with an array of students", async () => {
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.statusCode).toBe(200);
  });
  
  test('the fetch fails with an error', async () => {
    expect.assertions(0);
    try {
      await get();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});


//DATABASE connectivit
mongoose.connect(process.env.DATABASE ,{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() =>{
  console.log("DB Connected")
});

//server 
const port = process.env.PORT || 8989;

//starting a server
app.listen(port , () =>{
  console.log(`App is runnning at ${port}`)
});
