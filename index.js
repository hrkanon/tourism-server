const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

// heroku livesite
// https://floating-plains-91880.herokuapp.com/

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

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
    const ordersCollection = client.db("travelicious").collection("orders");

    // GET ALL DESTINATIONS API
    app.get("/destinations", async (req, res) => {
      const cursor = destinationsCollection.find({});
      const destinations = await cursor.toArray();
      res.send(destinations);
    });

    // GET ALL ORDERS API
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // GET SINGLE DESTINATION
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specefic destination", id);
      const query = { _id: ObjectId(id) };
      const destination = await destinationsCollection.findOne(query);
      res.send(destination);
    });

    // ADD ORDER
    app.post("/addOrder", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log("from add order", result);
      res.send(result);
    });

    // GET MY ORDER
    app.get("/myOrders/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.json(result);
      // console.log(result);
    });

    // DELETE ORDER
    app.delete("/deleteProduct/:productId", async (req, res) => {
      // console.log(req.params.productId);
      const id = req.params.productId;
      const result = await ordersCollection.deleteOne({ _id: id });
      res.send(result);
      // console.log(result);
    });

    // UPDATE ORDER
    app.put("/placeOrder/:orderId", async (req, res) => {
      const id = req.params.orderId;
      const filter = { _id: id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved",
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      res.json(result);
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
