const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    sectionName:{
        type: String,
        required: true
    },
    sectionDescription:{
        type:String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    isMainTask:{
        type: Boolean,
        required: true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required: true
    }
},{timestamps:true})

const Sections = mongoose.model('Section', sectionSchema);
module.exports = Sections