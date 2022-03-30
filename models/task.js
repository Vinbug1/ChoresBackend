const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required:true
    },
    // startDate:{
    //     type: Date,
    //     defualt: ''
    // },
    // endDate:{
    //     type: Date,
    //     defualt: ''
    // },
     budget: {
         type: String,
         required: true
     },
     cost:{
         type: String,
         required: true
     },
   
     client: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },    
    status :{
        type: String,
        required: true,
         default: 'available'
         
     },
     createdOn: {
         type:Date,
         defualt:Date.now
     }

});

taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
taskSchema.set('toJSON', {
    virtual: true,
});
exports.Task = mongoose.model('Task', taskSchema);