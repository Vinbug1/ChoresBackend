const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    image: {
        type: String,
        default: ''
    },
       
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    nin: {
        type: Number,
        required: true
    },
    skill: {
        type: String,
        default: ''
    },
    cost: {
        type : String,
        default: ''
    }
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);