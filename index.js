const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const cookieParsar = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId, ReturnDocument } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;

// RoomJet
// FGXiE4BkXYXow1A6

//middlewere

app.use(cors());
app.use(express.json());



  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ennn1mj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const roomCollection = client.db('RoomJet').collection("roomDetails");


    //client api
app.get('/rooms',  async(req,res)=>{
    const cursor = roomCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/rooms/:id',  async(req,res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await roomCollection.findOne(query);
    res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





  app.get('/', (req,res) =>{
    res.send('RoomJet is running')
})
app.listen(port , () => {
    console.log(`RoomJet is running on port ${port}`);
})

  