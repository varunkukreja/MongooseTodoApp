const expect = require('expect');
const request = require('supertest');

const app = require('../server');
const MongooseTodoApp = require('../models/MongooseTodoApp');

beforeEach((done)=>{
    MongooseTodoApp.remove({}).then(()=>done());
    
});


describe('POST/mongoose-todo-app', () => {
    it('Should create a new record in mogoose todo app collection.', (done) => {
        let app_name = "TESTING APP";
        let app_description = "TESTING APP DESCRIPTION";

        request(app).post('/mongoose-todo-app').send({app_name, app_description})
                .expect(200).expect((res) => {

            expect(res.body.app_name).toBe(app_name);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
         
            MongooseTodoApp.find().then((mongooseTodoApp)=>{
                expect(mongooseTodoApp.length).toBe(1);
                expect(mongooseTodoApp[0].app_name).toBe(app_name);
                done();
            }).catch((e)=>{
                done(e);
            })

        });

    });
    
    
     it('Should not create invalid data reocrd in mogoose todo app collection.', (done) => {
        //let app_name = "TESTING APP";
        let app_description = "TESTING APP DESCRIPTION";

        request(app).post('/mongoose-todo-app').send({app_description})
                .expect(400)
        .end((err, res) => {
            if (err) {
               return done(err);
            }
          
             MongooseTodoApp.find().then((mongooseTodoApp)=>{
                expect(mongooseTodoApp.length).toBe(0);
                done();
            }).catch((e)=>{
                done(e);
            })
        });

    });
    
    
    
});