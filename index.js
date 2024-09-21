const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParsar = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId, ReturnDocument } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;

// RoomJet
// FGXiE4BkXYXow1A6

//middlewere
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://roomjet01.web.app',
        'https://roomjet01.firebaseapp.com'
    ],
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParsar());



  const logger = async(req,res,next ) =>{
    console.log("called", req.host , req.originalUrl);
    next();
  }
  
  const verifyToken = async(req,res, next)=> {
  
    const token = req.cookies?.token;
    console.log('value of token', token);
    if(!token){
      return res.status(401).send({ message: 'Not Authorizes'})
  
    }
      jwt.verify(token, process.env.Token, (err,decode) =>{
      //error
      if(err){
        console.log(err);
        return res.status(401).send({ message: 'Not Authorizes'})
      }
      //decode
      console.log('value of token:', decode);
      req.user= decode;
      console.log(decode);

      next();
    })
    
  
  }
  
  



  

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
    // await client.connect();


    const roomCollection = client.db('RoomJet').collection("roomDetails");
    const bookingCollection = client.db('RoomJet').collection("Bookings");
    const reviewCollection = client.db('RoomJet').collection("Reviews");

//logut token
    app.post('/logout', async (req, res) => {
      const user = req.body;
      console.log('logging out', user);
      res
          .clearCookie('token', { maxAge: 0, sameSite: 'none', secure: true })
          .send({ success: true })
   })


    //auth api
    console.log(process.env.Token)
app.post('/jwt', async(req,res) =>{
    const user = req.body;
    console.log(user);
   
 
  
    const token = jwt.sign(user, process.env.Token, {expiresIn: '1h'})
    res
    .cookie('token', token, { httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', })
    .send({success: true})
  })


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

//post booking
app.post('/bookings', async (req,res) =>{
    const Bookings = req.body;
    console.log(Bookings);
    const result = await bookingCollection.insertOne(Bookings)
    res.send(result);
})

//get all bookings
app.get('/bookings',  async(req,res)=>{
    const cursor = bookingCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})
app.get('/bookings/:id', async(req,res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await bookingCollection.findOne(query);
    res.send(result)
})

app.delete('/bookings/:id', async (req,res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}

    const result = await bookingCollection.deleteOne(query)
    res.send(result);
})

//update

app.put('/bookings/:id', async(req,res)=>{
    const id = req.params.id;
    const filter ={_id : new ObjectId(id)}
    const options = {upsert: true};
    const updatedBookings= req.body;
    const info ={
        $set: {
             room_name: updatedBookings. room_name, 
             price: updatedBookings.price, 
            image: updatedBookings.image, 
            size: updatedBookings.size, 
            room_id: updatedBookings.room_id, 
            Name: updatedBookings.Name, 
            email: updatedBookings.email,
            phone: updatedBookings.phone,
            date: updatedBookings.date
        }
    }

    const result = await bookingCollection.updateOne(filter, info)
    
    res.send(result);
})




app.get('/booked', async (req,res) =>{
    console.log(req.query.room_id);



    let query= {};
  
    if(req.query?.room_id){
        query = {room_id: req.query.room_id}
    }
      const result = await bookingCollection.find(query).toArray();
    res.send(result);
})

//user
app.get('/booked/email',   async (req,res) =>{
    console.log(req.query.email);
    console.log('token', req.cookies.token);

    let query= {};
  
    if(req.query?.email){
        query = {email: req?.query?.email}
    }
    console.log("token", req?.cookies?.token);
    console.log('user in token', req?.user);
   





      const result = await bookingCollection.find(query).toArray();
    res.send(result);
})

//post review
app.post('/reviews', async (req,res) =>{
    const Reviews = req.body;
    console.log(Reviews);
    const result = await reviewCollection.insertOne(Reviews)
    res.send(result);
})

//get all review
app.get('/reviews',  async(req,res)=>{
    const cursor = reviewCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/review/rooms', async (req,res) =>{
    console.log(req.query.room_id);

    let query= {};
  
    if(req.query?.room_id){
        query = {room_id: req.query.room_id}
    }
      const result = await reviewCollection.find(query).toArray();
    res.send(result);
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

//bookings


  