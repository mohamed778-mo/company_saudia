const User=require("../models/user_form")

const Form=require("../models/form_contact")

const Services = require("../models/service");
const nodemailer = require("nodemailer")

const create_form =async (req,res)=>{
try{
    const {firstname ,lastname , email, mobile, country ,city , job , number_of_identity, area, district, street, trade_name, how_did_you_hear_about_us, is_the_project_existing,date } = req.body
    const service_id = req.params.service_id
    
   const service_data =await Services.findById(service_id)
   
    if(service_data){

        let service_name;

    if(req.language === 'ar'){
     service_name =service_data.arabic_name
}else{
     service_name =service_data.english_name
}
    const new_data = new User({firstname, lastname , email, mobile, country , city , job , number_of_identity , service_name:service_name, area, district, street, trade_name, how_did_you_hear_about_us, is_the_project_existing ,date})
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
              to: 'mohamedelmala70@gmail.com' , 
              subject: "ثروة الاعمال", 
              html: `<b>استمارة طلب الخدمه او تواصل معنا</b>
                     <p>السلام عليكم استاذه روبا،</p>
                     <p>قد تم ملء استمارة طلب الخدمة أو تواصل معنا للاقتراح أو الشكوى من المستخدم ${new_data.email}. برجاء التواصل معه.</p>`
           
            });
          console.log("Message sent");
          
          }
          
      main().catch((error) => {
    res.status(400).send("Failed to send email:", error);
});


        
    res.status(200).send('تم تسجيل طلبك')
    }
    
}catch(e){
    res.status(500).send(e.message)
}
}

const createformother = async (req,res)=>{
    try{
    const data = req.body
    const new_data = new User(data)
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
              to: 'tharwahbusines.ksa@gmail.com' , 
              subject: "ثروة الاعمال", 
              html: `<b>استمارة طلب الخدمه او تواصل معنا</b>
                     <p>السلام عليكم استاذه روبا،</p>
                     <p>قد تم ملء استمارة طلب الخدمة أو تواصل معنا للاقتراح أو الشكوى من المستخدم ${new_data.email}. برجاء التواصل معه.</p>`
           
            });
          console.log("Message sent");
          
          }
          
          main().catch((error) => {
    res.status(400).send("Failed to send email:", error);
});


        
    res.status(200).send('تم تسجيل طلبك')

    
      
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




const create_contact_form = async (req,res)=>{
    try{
    const data = req.body
    const new_data = new Form(data)
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
              to: 'tharwahbusines.ksa@gmail.com' , 
              subject: "ثروة الاعمال", 
              html: `<b>استمارة طلب الخدمه او تواصل معنا</b>
                     <p>السلام عليكم استاذه روبا،</p>
                     <p>قد تم ملء استمارة دعوة للنقاش والباحث الزائر من المستخدم ${new_data.email}. برجاء التواصل معه.</p>`
           
            });
          console.log("Message sent");
          
          }
          
          main().catch((error) => {
    res.status(400).send("Failed to send email:", error);
});


        
    res.status(200).send('تم تسجيل طلبك')

    
      
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

const get_contact_form=async (req,res)=>{
        try{
        const form_id = req.params.form_id
        const data = await Form.findById(form_id)
        if(!data){
            return res.status(400).send(" no forms !!")
        }

            res.status(200).send(data)
        
        }catch(e){
            res.status(500).send(e.message)
        }
            
            
        }


const create_form_special=async (req,res)=>{
try{
    const {firstname ,lastname , email, mobile, country ,city , job , number_of_identity} = req.body
   
    const new_data = new User({firstname, lastname , email, mobile, country , city , job , number_of_identity , service_name:'مجتمع الاعمال'})
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
              to: 'tharwahbusines.ksa@gmail.com' , 
              subject: "ثروة الاعمال", 
              html: `<b>استمارة طلب الخدمه او تواصل معنا</b><P> السلام عليكم استاذه روبا قد تم ملئ استماره طلب الخدمه او تواصل معنا للاقترح او الشكوى من المستخدم ${new_data.email} برجاء التواصل معه</P>`, 
           
            });
          console.log("Message sent");
          
          }
          
      main().catch((error) => {
    res.status(400).send("Failed to send email:", error);
});


        
    res.status(200).send('تم تسجيل طلبك')
    
    
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
                delete_all_contact_form,
                get_contact_form,
                createformother,
                create_form_special

            }
