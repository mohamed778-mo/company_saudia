const mongoose = require('mongoose'); 
const validator = require('validator')



var userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true, 
        },
    lastname: { 
        type: String,
        required: true 
        },
    email: { 
        type: String, 
        required: true,
        trim: true,
        validate(value) { 
         if (!validator.isEmail(value)) {
             throw new Error("Invalid email") } } 
            },
    mobile:{ 
        type:String, 
        required: true,
        trim: true 
        },
    country:{ 
        type: String, 
        default:'لا يوجد'
       
        
    },
    city:{ 
        type: String, 
       default:'لا يوجد'
    },
    job:{ 
        type: String, 
       default:'لا يوجد'
    }, 
    number_of_identity:{ 
        type: String, 
        default:'لا يوجد'
    }, 
    message:{ 
        type: String, 
        default:'لا يوجد'
    }, 
    service_name:{
        type: String, 
        default:'اقتراح او شكوى'
    }
 

}, 
{ timestamps: true }

);

// userSchema.pre("save",async function(){

//     try {
//      const user = this 
//         if(!user.isModified("password")){
        
//           return
//         }
//             user.password = await bcryptjs.hash( user.password , 8)
      
//       }
//    catch (error) {
//         console.log(error)
//   } 
//      })     
    
//      userSchema.methods.toJSON = function(){
//         const user = this 
//         const dataToObject = user.toObject()
//         delete dataToObject.password
//         delete dataToObject.tokens
       
//         return dataToObject
//       }

module.exports = mongoose.model('User', userSchema);
