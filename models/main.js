const mongoose = require('mongoose'); 
const Services = require("../models/service");

const mainservicesSchema = new mongoose.Schema({
    main_arabic_name: {
        type: String,
        required: true,
        unique:true
    },
    main_english_name: {
        type: String,
        required: true,
        unique:true
    },
    services_list:[{
    
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

}]

}, {
    timestamps: true
});



mainservicesSchema.pre('remove', async function (next) {
    try {
      
        const serviceIds = this.services_list.map(service => service.service_id);
        await Services.deleteMany({ _id: { $in: serviceIds } });

        
        await Video.deleteMany({ service_id: { $in: serviceIds } });

        next();
    } catch (err) {
        next(err);
    }
});


module.exports = mongoose.model('Main', mainservicesSchema);
