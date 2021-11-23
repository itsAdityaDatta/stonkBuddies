const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    body:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'public',
        enum: ['public','private']
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    stocks:[{
        type: String
    }]

});

module.exports = mongoose.model('Group',GroupSchema);