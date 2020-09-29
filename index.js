const express = require('express')
const bodyParser = require('body-parser')//for post data to database
const objectId = require('mongodb').ObjectID;
const password = 'oYcrmxvIfpNImPlT';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser:oYcrmxvIfpNImPlT@cluster0.yf6o8.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());//for submit without form
app.use(bodyParser.urlencoded({ extended: false })) //for submit from form


// root/main page created and sent
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// mongodb
client.connect(err => {
    const todoCollection = client.db("tasks").collection("todos");

    // post to database
    app.post('/addTodo', (req, res) => {
        const todo = req.body;
        todoCollection.insertOne(todo)
            .then(result => {
                res.redirect('/')
            })
    })

    // read data or get from database
    app.get('/todo', (req, res) => {
        todoCollection.find({})
            //NB: only toArray has two parameter(err, documents)
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // delete todo from database
    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        todoCollection.deleteOne({ _id: objectId(id) })
            .then(result => {
                res.send(result.deletedCount > 0) 
            })
    })


    // update task section
    // update 1st section loadTask
    app.get('/loadTask/:id', (req, res) => {
        const id = req.params.id;
        todoCollection.find({ _id: objectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })

    })
    // update 2nd updating database
    app.patch('/update/:id', (req, res) => {
        const { id, title, description } = req.body;
    
        todoCollection.updateOne({ _id: objectId(id)},
        {$set: { title: title, description: description}})
        .then(result => {
            res.send(result.modifiedCount>0)
        })
    })
    console.log('database connected');
});

app.listen(3000, console.log("listening on port 3000"))