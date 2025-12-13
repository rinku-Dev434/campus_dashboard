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
app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.json(users);
});
app.post("/questionform", async (req, res) => {
  const {
    id,
    title,
    company,
    description,
    questionset
  } = req.body;

  if (!id || !title || !questionset || questionset.length === 0) {
    return res.status(400).json({ message: "Invalid exam data" });
  }

  const exam = {
    id: Number(id),
    title,
    company,
    description,
    numberofquestions: questionset.length,
    type: "mcq",
    questionset,
    admincode: ""
  };

  await db.collection("tests").insertOne(exam);

  res.json({ message: "Exam stored successfully" });
});


app.post("/update-points", async (req, res) => {
  const { username, points } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username missing" });
  }

  await db.collection("users").updateOne(
    { username },
    { $inc: { points: points } }  // add points to existing score
  );

  res.json({ message: "Points updated" });
});



app.post("/admin", async (req, res) => {
  const quizData = req.body;

  await db.collection("tests").insertOne(quizData);

  res.json({ message: "Quiz stored successfully" });
});

app.get("/tests", async (req, res) => {
  const tests = await db.collection("tests").find().toArray();
  res.json(tests);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.collection("users").findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.json({ message: "Login successful", user });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
