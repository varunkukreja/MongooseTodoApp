const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser')
require('./dbhandler/MongoDbHandler');
var MongooseTodoApp = require('./models/MongooseTodoApp');
var common = require('./common');
var config = common.config();
const ObjectID = require('mongodb').ObjectID;

var app = express();
app.use(bodyParser.json());

app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});


app.get('/', function (request, response) {
    response.send('WELCOME TO MONGOOSE TODO APP');
});

app.post('/mongoose-todo-app', function (request, response) {
    let requestBody = request.body;
    console.log("Mongoose todo app request body ");
    console.log(JSON.stringify(requestBody));

    var mongooseTodoApp = new MongooseTodoApp(requestBody);

    mongooseTodoApp.save().then(result => {
        console.log("create-mongoose-todo-app result " + JSON.stringify(result));
        response.send(result)
    }).catch(function (error) {

        console.log("create-mongoose-todo-app error " + error);
        response.status(400).send(error);
    });

});

app.get('/mongoose-todo-app', (request, response) => {

    MongooseTodoApp.find().then((result) => {
        response.send(result);
    }).catch((error) => {
        response.status(400).send(error);
    })

});


app.get('/mongoose-todo-app/:id', (request, response) => {

    let id = request.params.id;

    if (typeof id !== 'undefined' && id !== null && id !== '') {
        /*
         MongooseTodoApp.findOne({_id: id}).then((result) => {
         
         response.send(result);
         }).catch((error) => {
         console.log("ERROR " + error)
         response.status(400).send(error);
         })
         */

        /*We can use mongoose method findById to get document by id
         *In this method we have to just pass id value not object like {_id: id}
         *Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). 
         *If you want to query by a document's _id, use findById() instead of findOne().
         *
         */
        if (ObjectID.isValid(id)) {
            MongooseTodoApp.findById(id).then((result) => {
                if (result !== null) {
                    response.send(result);
                } else {
                    response.status(404).send({message: 'Record does not exsit.'});
                }

            }).catch((error) => {
                console.log("ERROR " + error)
                response.status(400).send(error);
            })
        } else {
            response.status(400).send({message: 'Invalid Id'});
        }

    }



});


app.delete('/mongoose-todo-app/:id', (request, response) => {

    let id = request.params.id;

    if (typeof id !== 'undefined' && id !== null && id !== '') {

        if (ObjectID.isValid(id)) {
            MongooseTodoApp.findOneAndDelete({_id: id}).then((result) => {

                if (result !== null) {
                    response.status(200).send(result);
                } else {
                    response.status(404).send({message: 'Record does not exsit.'});
                }

            }).catch((error) => {
                console.log("ERROR " + error)
                response.status(400).send(error);
            })
        } else {
            response.status(400).send({message: 'Invalid Id'});
        }

    }



});

app.patch('/mongoose-todo-app/:id', (request, response) => {
    let id = request.params.id;
    if (ObjectID.isValid(id)) {
        
        MongooseTodoApp.findOneAndUpdate({_id:id}, {$set: request.body}, {new : true}).then((mongooseTodoApp) => {
            if (!mongooseTodoApp) {
                response.status(404).send({message: 'Record does not exsit.'});
            } else {
                response.status(200).send(mongooseTodoApp);
            }
        }).catch((e) => {
            response.status(400).send(e);
        })

    } else {
        response.status(400).send({message: 'Invalid Id'});
    }

})

app.listen(config.SERVER_PORT, function () {
    console.log("Application successfully started on port " + config.SERVER_PORT);
});

module.exports = app;