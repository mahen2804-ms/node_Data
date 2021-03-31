const express = require("express"); 
const serverRoutes = require("./server-routes");
const { save } = require("./save_json");
const request = require("supertest"); 
const bodyParser = require("body-parser");

jest.mock("./save_json", () => ({
  save: jest.fn(),
}));

jest.mock("./usStates.json", () => [
  {
    state: "MI",
    capital: "Lansing",
    governor: "Gretchen Whitmer",
  },
  {
    state: "GA",
    capital: "Atlanta",
    governor: "Brian Kemp",
  },
]); 

const app = express(); 
app.use(bodyParser.json());
app.use("/states", serverRoutes); 


describe("testing-server-routes", () => {
  it("GET /states - success", async () => {
    const { body } = await request(app).get("/states");
    expect(body).toEqual([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Gretchen Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
    ]);
    firstState = body[0];
  });
  it("GET /states/MI - succes", async () => {
    const { body } = await request(app).get(`/states/${firstState.state}`);
    expect(body).toEqual(firstState);
  });

  it("POST /states - success", async () => {
    let stateObj = {
      state: "AL",
      capital: "Montgomery",
      governor: "Kay Ivey",
    };
    const { body } = await request(app).post("/states").send(stateObj);
    expect(body).toEqual({
      status: "success",
      stateInfo: {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Gretchen Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
    expect(save).toHaveBeenCalledTimes(1);
  });
  it("PUT /states/MI - success", async () => {
    let stateObj = {
      state: "MI",
      capital: "Lansing",
      governor: "Joe Whitmer",
    };
    const response = await request(app).put("/states/MI").send(stateObj);
    expect(response.body).toEqual({
      status: "success",
      stateInfo: {
        state: "MI",
        capital: "Lansing",
        governor: "Joe Whitmer",
      },
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "MI",
        capital: "Lansing",
        governor: "Joe Whitmer",
      },
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
    expect(response.statusCode).toEqual(200);
  });
  it("DELETE /states/MI - success", async () => {
    const { body } = await request(app).delete("/states/MI");
    expect(body).toEqual({
      status: "success",
      removed: "MI",
      newLength: 2,
    });
    expect(save).toHaveBeenCalledWith([
      {
        state: "GA",
        capital: "Atlanta",
        governor: "Brian Kemp",
      },
      {
        state: "AL",
        capital: "Montgomery",
        governor: "Kay Ivey",
      },
    ]);
  });
});