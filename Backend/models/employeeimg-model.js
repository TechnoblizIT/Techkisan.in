const mongoose = require('mongoose');

const empImageSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
       
    },
    Image: {
        type: Buffer,
        
    },
    Imagetype: {
        type: String,
        
    }
});

module.exports = mongoose.model('empimg', empImageSchema);
