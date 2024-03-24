import mongoose from "mongoose";

const connect = mongoose.connect('mongodb://127.0.0.1:27017/Todolist');

connect.then(() => {
    console.log('Database connected successfully');
})
.catch((error) => {
    console.log('Database cannot be connected', error);
});

const Loginschema  = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    taskDictioanry: mongoose.Schema.Types.Mixed,
    HTMLContent: mongoose.Schema.Types.Mixed,
    taskanmes: mongoose.Schema.Types.Mixed,
});


export const collection = new mongoose.model("users", Loginschema);