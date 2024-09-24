const mongoose = require('mongoose'); 
const Main = require("../models/main");
const Video = require("../models/video");


const serviceSchema = new mongoose.Schema({
    arabic_name: { 
      type:String,
      required:true
},
    english_name: { 
     type:String,
     required:true
},
    videolink: { 
      type:String,
      
},
    address_arabic_main:{
      type:String,
      required:true
    },
    address_english_main:{
        type:String,
        required:true
      },
    address_arabic_sub:{
      type:String,
      required:true
    }, 
    address_english_sub:{
        type:String,
        required:true
      }, 
    youtube_number:{
      type:Number,
      
    }, 
    instagram_number:{
      type:Number,
     
    },
    twitter_number:{
        type:Number,
       
      },
    snap_number:{
        type:Number,
       
      },
    tiktok_number:{
        type:Number,
        
      },
    linkedin_number:{
        type:Number,
       
      }, 
    note:{
        type:String,
        default:' '
      
      }, 
    image:{
        type:String,
        required:true,
        default:'empty'
      }, 
    price:{
        type:Number,
          
    },
    
    questions_and_answers:[{
      question_english:{
        type:String,
        
},
      question_arabic:{
        type:String,
       
},
      answer_english:{
       type:String,
    
},
      answer_arabic:{
        type:String,
     
} ,
      
    }],
    
    whyMain_and_whySub:[{
    why_main_arabic:{
        type:String,
         
    }, 
    why_main_english:{
        type:String,
          
    }, 
    why_sub_arabic:{
        type:String,
        
    }, 
    why_sub_english:{
        type:String,
         
    }, 
    photo_link:{
        type:String,
         
    }, 
          
        }],

      
    bunch: [{
        name_arabic: String, 
        name_english: String,
        price: Number,
        description_arabic: String,
        description_english: String
        
    }]              
});




module.exports = mongoose.model('Services', serviceSchema);


