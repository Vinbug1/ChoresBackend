const mongoose = require('mongoose');

const doneTaskSchema = mongoose.Schema({
    task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required:true
    }],
    review:{
        type:String,
        require:''
    },
    rating:{
        type:Number,
        default:0
    },
  
    vendor: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    createdOn: {
        type: Date,
        default:Date.now
    }
});

doneTaskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
doneTaskSchema.set('toJSON',{ 
    virtual: true,
});
exports.DoneTask = mongoose.model('DoneTask',doneTaskSchema);