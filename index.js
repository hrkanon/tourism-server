const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjpcl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelicious");
    const destinationsCollection = database.collection("destinations");

    // GET API
    app.get("/destinations", async (req, res) => {
      const cursor = destinationsCollection.find({});
      const destinations = await cursor.toArray();
      res.send(destinations);
    });

    // GET SINGLE DESTINATION
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specefic destination", id);
      const query = { _id: ObjectId(id) };
      const destination = await destinationsCollection.findOne(query);
      res.send(destination);
    });

    // POST API
    app.post("/destinations", async (req, res) => {
      const destination = req.body;
      // console.log("hit the post api", destination);

      const result = await destinationsCollection.insertOne(destination);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("torusm server is Running!!");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
