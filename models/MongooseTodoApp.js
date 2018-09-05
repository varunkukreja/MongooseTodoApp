var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var MongooseTodoAppSchema = new mongoose.Schema({

    app_name: {
        type: String,
        required: [true, 'App name must be provided.'],
        minlength: 5,
        trim: true
    },
    app_description: {
        type: String,
        required: [true, 'App description must be provided.'],
        minlength: 5,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    }


});

MongooseTodoAppSchema.plugin(timestamps);

var MongooseTodoApp = mongoose.model('MongooseTodoApp', MongooseTodoAppSchema, "mongoose_todo_app");

module.exports = MongooseTodoApp;