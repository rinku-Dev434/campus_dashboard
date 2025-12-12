const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();


const url = process.env.MONGO_URL;
const client = new MongoClient(url);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("authdb");
  console.log("MongoDB connected");
}
connectDB();

app.get("/", (req, res )=> {
  res.send("Backend is running");
});

app.post("/user", async (req, res) => {
  const userData = req.body;
  console.log ("requrest comes")

  await db.collection("users").insertOne(userData);

  res.json({ message: "User stored successfully" });
});

app.post("/admin", async (req, res) => {
  const quizData = req.body;

  await db.collection("tests").insertOne(quizData);

  res.json({ message: "Quiz stored successfully" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
