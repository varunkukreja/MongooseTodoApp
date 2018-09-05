const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;
const app = require('../server');
const MongooseTodoApp = require('../models/MongooseTodoApp');


var mongooseTodoAppArray = [{
        _id: new ObjectID(),
        app_name: "TESTING GET APP 1",
        app_description: "TESTING GET APP DESCRIPTION 1"
    }, {
        _id: new ObjectID(),
        app_name: "TESTING GET APP 2",
        app_description: "TESTING GET APP DESCRIPTION 2"
    }]


beforeEach((done) => {
    MongooseTodoApp.deleteMany({}).then(() => {
        return MongooseTodoApp.insertMany(mongooseTodoAppArray);
    }).then(() => {
        done();
    });

});


describe('GET/mongoose-todo-app', () => {
    it('Should get all records from mogoose todo app collection.', (done) => {

        request(app).get('/mongoose-todo-app').expect(200).expect((res) => {

            expect(res.body.length).toBe(2);
        }).end(done);


    });
});


describe('GET/mongoose-todo-app/:id', () => {
    it('Should return mongoose todo app document.', (done) => {
       
        request(app).get('/mongoose-todo-app/'+mongooseTodoAppArray[0]._id.toString()).expect(200).expect((res) => {

            expect(res.body.app_name).toBe(mongooseTodoAppArray[0].app_name);
        }).end(done);


    });
    
     it('Should return 404 if mongoose todo app document not found.', (done) => {
        let objectId=new ObjectID().toString(); 
        request(app).get('/mongoose-todo-app/'+objectId).expect(404).end(done);

    });
    
     it('Should return 404 for non object ids.', (done) => {
        let objectId="123"; 
        request(app).get('/mongoose-todo-app/'+objectId).expect(400).end(done);

    });
    
    
});