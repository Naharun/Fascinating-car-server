const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkh0edt.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    const toysCollection = client.db('toysDB').collection('toys')

    app.get('/toys', async (req, res)=>{
      const result = await toysCollection.find().limit(20).toArray();
      res.send(result)
    })

    app.get('/toys/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      res.send(result);
    })
    app.get('/myToys', async(req,res)=>{
      let query = {}
      if(req.query?.email){
        query = {seller_email: req.query.email}
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/toys', async(req,res)=>{
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    })
    app.delete('/myToys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })
    app.get('/myToys/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      res.send(result);
    })
    app.put('/myToys/:id', async(req, res)=>{
      const id = req.params.id;
      const toyData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updateToy = {
        $set: {
          price:toyData.price,
          availableQuantity:toyData.availableQuantity,
          details:toyData.details
        }
      }
      const result = await toysCollection.updateOne(filter, updateToy, options)
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('kids toys')
})

app.listen(port, () =>{
    console.log(`fascinating cars server${port}`)
})