const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoURL: {
        type: String,
        
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
       
    },
    Service_arabic_name: {
        type: String,
       
    },
    Service_english_name: {
        type: String,
      
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Video', videoSchema);
