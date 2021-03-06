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


describe('DELETE/mongoose-todo-app/:id', () => {
    it('Should delete mongoose todo app document.', (done) => {

        request(app).delete('/mongoose-todo-app/' + mongooseTodoAppArray[0]._id.toString()).expect(200).expect((res) => {

            expect(res.body._id).toBe(mongooseTodoAppArray[0]._id.toString());
        }).end((err, res) => {
            if (err) {
                return  done(err);
            }
            MongooseTodoApp.findById(mongooseTodoAppArray[0]._id.toString()).then((mongooseTodoApp) => {

                expect(mongooseTodoApp).toBe(null);
                done();
            }).catch((e) => {
                done(e);
            })

        });




    });

    it('Should return 404 if mongoose todo app document not found.', (done) => {
        let objectId = new ObjectID().toString();
        request(app).get('/mongoose-todo-app/' + objectId).expect(404).end(done);

    });

    it('Should return 404 for non object ids.', (done) => {
        let objectId = "123";
        request(app).get('/mongoose-todo-app/' + objectId).expect(400).end(done);

    });


});