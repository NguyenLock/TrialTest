const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const memberSchema = new Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
},{timestamps: true});
const Member = mongoose.model('Member', memberSchema);
module.exports = Member;