const mongoose = require('mongoose');

const announcementSchema=mongoose.Schema({
    Announcement:{
        type:String,
        required:true
    
    },
    Date:{
        type:Date,
        required:true,
        default: Date.now
    }

})

module.exports = mongoose.model('Announcement', announcementSchema)