const User=require("../models/user_form")

const Form=require("../models/form_contact")

const Services = require("../models/service");
const nodemailer = require("nodemailer")

const create_form =async (req,res)=>{
try{
    const {firstname ,lastname , email, mobile, country ,city , job , number_of_identity} = req.body
    const service_id = req.params.service_id
    if(service_id){
    const service_data =await Services.findById(service_id)
    let service_name;
if(req.language === 'ar'){
     service_name =service_data.arabic_name
}else{
     service_name =service_data.english_name
}
    const new_data = new User({firstname, lastname , email, mobile, country , city , job , number_of_identity , service_name:service_name})
    await new_data.save()

    const transporter = nodemailer.createTransport({
          service:process.env.SERVICE,
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS,
            },
          });
          
          async function main() {
          const info = await transporter.sendMail({
              from: process.env.USER_EMAIL, 
              to: new_data.email , 
              subject: "ثروة الاعمال", 
              html: `<b> تم تسجيل طلب الخدمه </b><P> شكرا جزيلا سيتم التواصل معك </P>`, 
           
            });
          
          
          }
          
          main().catch(console.error);

        
    res.status(200).send('تم تسجيل طلبك')
    }else{
    const new_data = new User({firstname, lastname , email, mobile, country , city , job , number_of_identity , service_name:'تواصل معنا'})
    await new_data.save()
const transporter = nodemailer.createTransport({
          service:process.env.SERVICE,
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS,
            },
          });
          
          async function main() {
          const info = await transporter.sendMail({
              from: process.env.USER_EMAIL, 
              to: new_data.email , 
              subject: "ثروة الاعمال", 
              html: `<b> تم تسجيل طلب الخدمه </b><P> شكرا جزيلا سيتم التواصل معك </P>`, 
           
            });
          
          
          }
          
          main().catch(console.error);

        
    res.status(200).send('تم تسجيل طلبك')

    }
    
}catch(e){
    res.status(500).send(e.message)
}
    
    
}


const get_all_forms =async (req,res)=>{
    try{
     
        const data = await User.find()
    if(!data){
        return res.status(200).send([])
    }
        res.status(200).send(data)
    
    }catch(e){
        res.status(500).send(e.message)
    }
        
        
    }

const delete_form=async (req,res)=>{
        try{
        const form_id = req.params.form_id
        const data = await User.findByIdAndDelete(form_id)
        if(!data){
            return res.status(400).send(" no forms !!")
        }

            res.status(200).send('form deleted successfully')
        
        }catch(e){
            res.status(500).send(e.message)
        }
            
            
        }
const delete_all_form=async (req,res)=>{
            try{
            
            const data = await User.deleteMany()
            if(!data){
                return res.status(400).send(" no forms !!")
            }
    
                res.status(200).send('forms deleted successfully')
            
            }catch(e){
                res.status(500).send(e.message)
            }
                
                
            }




const create_contact_form =async (req,res)=>{
try{
    const {firstName,lastName,email,phone,linkedin,twitter,country,city,agree,meetingPurpose,meetingType,otherPurpose} = req.body

    const new_data = new Form({firstName,lastName,email,phone,linkedin,twitter,country,city,agree,meetingPurpose,meetingType,otherPurpose})
    await new_data.save()

   

const transporter = nodemailer.createTransport({
          service:process.env.SERVICE,
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS,
            },
          });
          
          async function main() {
          const info = await transporter.sendMail({
              from: process.env.USER_EMAIL, 
              to: new_data.email , 
              subject: "ثروة الاعمال", 
              html: `<b> حجز موعد مع المدير </b><P> شكرا جزيلا سيتم التواصل معك </P>`, 
           
            });
          
          
          }
          
          main().catch(console.error);

        
    res.status(200).send('تم تسجيل الاستماره بنجاح')
    
}catch(e){
    res.status(500).send(e.message)
}
    
    
}


const get_all_contact_forms =async (req,res)=>{
    try{
     
        const data = await Form.find()
    if(!data){
        return res.status(200).send([])
    }
        res.status(200).send(data)
    
    }catch(e){
        res.status(500).send(e.message)
    }
        
        
    }

const delete_contact_form=async (req,res)=>{
        try{
        const form_id = req.params.form_id
        const data = await Form.findByIdAndDelete(form_id)
        if(!data){
            return res.status(400).send(" no forms !!")
        }

            res.status(200).send('form deleted successfully')
        
        }catch(e){
            res.status(500).send(e.message)
        }
            
            
        }
const delete_all_contact_form=async (req,res)=>{
            try{
            
            const data = await Form.deleteMany()
            if(!data){
                return res.status(400).send(" no forms !!")
            }
    
                res.status(200).send('forms deleted successfully')
            
            }catch(e){
                res.status(500).send(e.message)
            }
                
                
            }



            module.exports={
                create_form,
                get_all_forms,
                delete_form,
                delete_all_form,

                create_contact_form,
                get_all_contact_forms,
                delete_contact_form,
                delete_all_contact_form

            }
