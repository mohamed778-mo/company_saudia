const Admin = require("../models/admin");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Services = require("../models/service");
const Main = require("../models/main");
const admin = require('firebase-admin');
const fs = require('fs');
require("dotenv").config();

const serviceAccount =JSON.parse(process.env.SERVER)

const admin_Register = async (req, res) => {
    try {
        const { firstname, lastname, email, mobile, password, address } = req.body;
        const dublicatedEmail = await Admin.findOne({ email });

        if (dublicatedEmail) {
            const message = req.language === 'ar' ? 'البريد الإلكتروني موجود بالفعل!!' : 'Email already exists!!';
            return res.status(400).send(message);
        }

     
        const newUser = new Admin({ firstname, lastname, email, mobile, password, address });
        await newUser.save();

        const successMessage = req.language === 'ar' ? 'التسجيل ناجح !!' : 'Registration is successful!!';
        res.status(200).send(successMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const admin_Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });

        if (!user) {
            const message = req.language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Email or Password is incorrect';
            return res.status(404).send(message);
        }

        const isPassword = await bcryptjs.compare(password, user.password);
        if (!isPassword) {
            const message = req.language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Email or Password is incorrect';
            return res.status(404).send(message);
        }

        const SECRETKEY = process.env.SECRETKEY;
        const token = jwt.sign({ id: user._id }, SECRETKEY);
        res.cookie("access_token", `Bearer ${token}`, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1024 * 300),
            httpOnly: true,
        });

        user.tokens.push(token);
        await user.save();

        const successMessage = req.language === 'ar' ? 'تسجيل الدخول ناجح!' : 'Login is successful!';
        res.status(200).send({ access_token: `Bearer ${token}`, success: successMessage });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const add_main = async (req, res) => {
    try {
        const data = req.body;
        const newMain = new Main(data);
        await newMain.save();
        res.status(201).json(newMain);
    } catch (error) {
        res.status(500).json({ message: 'Error adding Main Address', error });
    }
};


const get_main = async (req, res) => {
    try {
        const main_id = req.params.main_id;
        const main = await Main.findById(main_id).populate('services_list.service_id'); 

        if (!main) return res.status(404).json({ message: 'Main not found' });

        const response = {
            main_id:  main._id,
            main_name: req.language === 'ar' ? main.main_arabic_name : main.main_english_name,
            services_list: main.services_list.map(service => ({
                service_name: req.language === 'ar' ? service.Service_arabic_name : service.Service_english_name,
                service_id: service.service_id
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main', error });
    }
};

const get_all_main = async (req, res) => {
  try {
      const mains = await Main.find();

      if (!mains || mains.length === 0) {
          return res.status(200).send([]);
      }

 
      const response = mains.map(main => ({
          main_id:  main._id,
          main_name: req.language === 'ar' ? main.main_arabic_name : main.main_english_name,
          services_list: main.services_list.map(service => ({
              service_name: req.language === 'ar' ? service.Service_arabic_name : service.Service_english_name,
              service_id: service.service_id
          }))
      }));

      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching mains', error });
  }
};

const get_main_in_dash = async (req, res) => {
    try {
        const main_id = req.params.main_id;
        const main = await Main.findById(main_id)

        res.status(200).json(main);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main', error });
    }
};


const get_all_main_in_dash = async (req, res) => {
  try {
      const mains = await Main.find();

      if (!mains || mains.length === 0) {
          return res.status(200).send([]);
      }

      res.status(200).send(mains);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching mains', error });
  }
};

const edit_main = async (req, res) => {
    try {
        const data = req.body;
        const main_id = req.params.main_id;

        const updatedMain = await Main.findByIdAndUpdate(main_id, data, { new: true });

        if (!updatedMain) {
            return res.status(404).json({ message: 'Main not found' });
        }

        res.status(200).json(updatedMain);
    } catch (error) {
        res.status(500).json({ message: 'Error updating main', error });
    }
};


const delete_main = async (req, res) => {
    try {
        const main_id = req.params.main_id;

        const deletedMain = await Main.findByIdAndDelete(main_id);
        if (!deletedMain) return res.status(404).json({ message: 'Main not found' });

        res.status(200).json({ message: 'Main deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting main', error });
    }
};

const delete_all_mains = async (req, res) => {
    try {
        const allMains = await Main.find();

        for (const main of allMains) {
            await Services.deleteMany({ _id: { $in: main.services_list.map(service => service.service_id) } });
        }

        await Main.deleteMany();

        res.status(200).json({ message: 'All mains and their associated services deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all mains and their associated services', error });
    }
};


const add_service_to_main = async (req, res) => {
    try {
        const { 
    arabic_name,
    english_name,
    address_arabic_main,
    address_english_main,
    address_arabic_sub, 
    address_english_sub, 
    youtube_number, 
    instagram_number ,
    twitter_number,
    snap_number,
    tiktok_number,
    linkedin_number, 
    note,  
    price
} = req.body;
        const main_id = req.params.main_id;

        const Q_A = JSON.parse(req.body.questions_and_answers);
        const M_S = JSON.parse(req.body.whyMain_and_whySub );
        const bunch = JSON.parse(req.body.bunch );
        

    
        const existing_service = await Services.findOne({
            arabic_name: arabic_name,
            address_arabic_main: address_arabic_main
        });

        if (existing_service) {
            return res.status(400).json({ message: 'Service already exists!' });
        }

       
        if (req.files && req.files.length > 0) {
            const file = req.files.find(f => f.fieldname === 'file');
            if (file) {
                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        storageBucket: process.env.STORAGE_BUCKET
                    });
                }

                const bucket = admin.storage().bucket();
                const blob = bucket.file(file.filename);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

               await new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

                    blobStream.on('finish', async () => {
                        try {
                            await blob.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                            fs.unlinkSync(file.path); 

                           
                            const newService = new Services({
                                   arabic_name,
                                   english_name,
                                   address_arabic_main,
                                   address_english_main,
                                   address_arabic_sub, 
                                   address_english_sub, 
                                   youtube_number, 
                                   instagram_number ,
                                   twitter_number,
                                   snap_number,
                                   tiktok_number,
                                   linkedin_number, 
                                   note,  
                                   price,
                                   image: publicUrl
                            });

                        
                            Q_A.forEach(Question => {
                                newService.questions_and_answers.push({
                                    question_english: Question.question_english,
                                    question_arabic: Question.question_arabic,
                                    answer_english: Question.answer_english,
                                    answer_arabic: Question.answer_arabic
                                });
                            });

                          
                            M_S.forEach(Why => {
                                newService.whyMain_and_whySub.push({
                                    why_main_arabic: Why.why_main_arabic,
                                    why_main_english: Why.why_main_english,
                                    why_sub_arabic: Why.why_sub_arabic,
                                    why_sub_english: Why.why_sub_english
                                });
                            });

                              bunch.forEach(bunch => {
                                newService.bunch.push({
                                    name: bunch.name,
                                    description: bunch.description,
                                    price: bunch.price,
                                   
                                });
                            });
                         
                            await newService.save();

                            
                            await addServiceToMain(newService, main_id, res);
                        } catch (err) {
                            reject(err);
                        }
                    });

                    fs.createReadStream(file.path).pipe(blobStream);
                });
            }
        } else {
            
                             const newService = new Services({
                                   arabic_name,
                                   english_name,
                                   address_arabic_main,
                                   address_english_main,
                                   address_arabic_sub, 
                                   address_english_sub, 
                                   youtube_number, 
                                   instagram_number ,
                                   twitter_number,
                                   snap_number,
                                   tiktok_number,
                                   linkedin_number, 
                                   note,  
                                   price
                            });

           
            Q_A.forEach(Question => {
                newService.questions_and_answers.push({
                    question_english: Question.question_english,
                    question_arabic: Question.question_arabic,
                    answer_english: Question.answer_english,
                    answer_arabic: Question.answer_arabic
                });
            });

         
            M_S.forEach(Why => {
                newService.whyMain_and_whySub.push({
                    why_main_arabic: Why.why_main_arabic,
                    why_main_english: Why.why_main_english,
                    why_sub_arabic: Why.why_sub_arabic,
                    why_sub_english: Why.why_sub_english
                });
            });

                              bunch.forEach(bunch => {
                                newService.bunch.push({
                                    name: bunch.name,
                                    description: bunch.description,
                                    price: bunch.price,
                                   
                                });
                            });
            
            await newService.save();

           
            await addServiceToMain(newService, main_id, res);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addServiceToMain = async (newService, main_id, res) => {
    try {
        const mainData = await Main.findById(main_id);

        if (!mainData) {
            return res.status(404).json({ message: 'Main not found!' });
        }

        
        const existingServiceInMain = mainData.services_list.some(service =>
            service.service_id.equals(newService._id) &&
            service.Service_arabic_name === newService.arabic_name &&
            service.Service_english_name === newService.english_name
        );

        if (existingServiceInMain) {
            return res.status(400).json({ message: 'Service already exists in main!' });
        }

        
        const updatedMain = await Main.findByIdAndUpdate(
            main_id,
            { $push: { services_list: { service_id: newService._id, Service_arabic_name: newService.arabic_name, Service_english_name: newService.english_name } } },
            { new: true }
        );

        return res.status(200).json(updatedMain);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




const edit_service = async (req, res) => {
    try {
        const { 
            arabic_name,
            english_name,
            address_arabic_main,
            address_english_main,
            address_arabic_sub, 
            address_english_sub, 
            youtube_number, 
            instagram_number,
            twitter_number,
            snap_number,
            tiktok_number,
            linkedin_number, 
            note,  
            price,
            questions_and_answers,
            whyMain_and_whySub,
            bunch
        } = req.body;
        
        const service_id = req.params.service_id;

      
        const Q_A = typeof questions_and_answers === 'string' ? JSON.parse(questions_and_answers) : questions_and_answers;
        const M_S = typeof whyMain_and_whySub === 'string' ? JSON.parse(whyMain_and_whySub) : whyMain_and_whySub;
        const bunch_data = typeof bunch === 'string' ? JSON.parse(bunch) : bunch;

        const existing_service = await Services.findById(service_id);

        if (!existing_service) {
            return res.status(404).json({ message: 'Service not found!' });
        }
       
        
        
if (req.files && req.files.length > 0) {
            const file = req.files.find(f => f.fieldname === 'file');
           
            if (file) {
                
                 if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                       storageBucket: process.env.STORAGE_BUCKET
                    });
                }
                console.log('sss')
                    const bucket = admin.storage().bucket();

                
                if (existing_service.image && existing_service.image !== 'empty') {
                    

                    
                    const file_b = bucket.file(existing_service.image.split('/').pop()); 
                    
                console.log('sss')
                    
                    try {
                          await file_b.delete();
                    } catch (error) {
                        console.log("Error deleting old image:", error.message);
                    }
                }
                
                console.log('sss')

          
                const blob = bucket.file(file.filename);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
   await new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

                console.log('sss')

                    blobStream.on('finish', async () => {
                        try {
                            await blob.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                            fs.unlinkSync(file.path); 

                        
                            existing_service.image = publicUrl;
                console.log('sss')
                            
                        } catch (err) {
                            reject(err);
                        }
                    });

                    fs.createReadStream(file.path).pipe(blobStream);
    
   })
            }
            }

                console.log('sss')
      
        existing_service.arabic_name = arabic_name || existing_service.arabic_name;
        existing_service.english_name = english_name || existing_service.english_name;
        existing_service.address_arabic_main = address_arabic_main || existing_service.address_arabic_main;
        existing_service.address_english_main = address_english_main || existing_service.address_english_main;
        existing_service.address_arabic_sub = address_arabic_sub || existing_service.address_arabic_sub;
        existing_service.address_english_sub = address_english_sub || existing_service.address_english_sub;
        existing_service.youtube_number = youtube_number || existing_service.youtube_number;
        existing_service.instagram_number = instagram_number || existing_service.instagram_number;
        existing_service.twitter_number = twitter_number || existing_service.twitter_number;
        existing_service.snap_number = snap_number || existing_service.snap_number;
        existing_service.tiktok_number = tiktok_number || existing_service.tiktok_number;
        existing_service.linkedin_number = linkedin_number || existing_service.linkedin_number;
        existing_service.note = note || existing_service.note;
        existing_service.price = price || existing_service.price;

     
        if (Q_A && Q_A.length > 0) {
            existing_service.questions_and_answers = [];
            Q_A.forEach(Question => {
                existing_service.questions_and_answers.push({
                    question_english: Question.question_english,
                    question_arabic: Question.question_arabic,
                    answer_english: Question.answer_english,
                    answer_arabic: Question.answer_arabic
                });
            });
        }

 
        if (M_S && M_S.length > 0) {
            existing_service.whyMain_and_whySub = [];
            M_S.forEach(Why => {
                existing_service.whyMain_and_whySub.push({
                    why_main_arabic: Why.why_main_arabic,
                    why_main_english: Why.why_main_english,
                    why_sub_arabic: Why.why_sub_arabic,
                    why_sub_english: Why.why_sub_english
                });
            });
        }

       
        if (bunch_data && bunch_data.length > 0) {
            existing_service.bunch = [];
            bunch_data.forEach(b => {
                existing_service.bunch.push({
                    name: b.name,
                    description: b.description,
                    price: b.price
                });
            });
        }

        await existing_service.save();

      console.log('ss')
const mainData = await Main.findOne({ 'services_list.service_id': existing_service._id });

        if (!mainData) {
            return res.status(404).json({ message: 'Main not found!' });
        }

        await Main.updateOne(
            { 'services_list.service_id': existing_service._id },
            { 
                $set: { 
                    'services_list.$.Service_arabic_name': existing_service.arabic_name,
                    'services_list.$.Service_english_name': existing_service.english_name
                }
            }
        );

     res.status(200).json({ message: 'Service updated successfully!' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






const get_service = async (req, res) => {
    try {
        const service_id = req.params.service_id;
        const service = await Services.findById(service_id);

        if (!service) return res.status(404).json({ message: 'Service not found' });

        const questions_and_answers = service.questions_and_answers.map(qa => ({
            question: req.language === 'ar' ? qa.question_arabic : qa.question_english,
            answer: req.language === 'ar' ? qa.answer_arabic : qa.answer_english
        }));

        const whyMain_and_whySub = service.whyMain_and_whySub.map(why => ({
            why_main: req.language === 'ar' ? why.why_main_arabic : why.why_main_english,
            why_sub: req.language === 'ar' ? why.why_sub_arabic : why.why_sub_english
        }));

        const response = {
            service_id: service._id,
            video_link: service.videolink,
            name: req.language === 'ar' ? service.arabic_name : service.english_name,
            address_main: req.language === 'ar' ? service.address_arabic_main : service.address_english_main,
            address_sub: req.language === 'ar' ? service.address_arabic_sub : service.address_english_sub,
            youtube_number: service.youtube_number,
            instagram_number: service.instagram_number,
            twitter_number: service.twitter_number,
            snap_number: service.snap_number,
            tiktok_number: service.tiktok_number,
            linkedin_number:service.linkedin_number,
            questions_and_answers: questions_and_answers,
            whyMain_and_whySub: whyMain_and_whySub,
            bunch: service.bunch,
            price: service.price,
            note: service.note,
            image:service.image
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service', error });
    }
};


const get_all_services = async (req, res) => {
    try {
    const main_id = req.params.main_id;

    const mainServices = await Main.findById(main_id).populate({
      path: 'services_list.service_id',
      model: 'Services', 
    });

    if (!mainServices) {
      return res.status(404).json({ message: 'Main not found' });
    }

 
    const services = mainServices.services_list.map(service => {
      if (!service.service_id) {
        return null; 
      }
      const questions_and_answers = service.service_id.questions_and_answers.map(qa => ({
        question: req.language === 'ar' ? qa.question_arabic : qa.question_english,
        answer: req.language === 'ar' ? qa.answer_arabic : qa.answer_english
      }));

      const whyMain_and_whySub = service.service_id.whyMain_and_whySub.map(why => ({
        why_main: req.language === 'ar' ? why.why_main_arabic : why.why_main_english,
        why_sub: req.language === 'ar' ? why.why_sub_arabic : why.why_sub_english
      }));

      return {
        service_id: service.service_id._id,
        video_link: service.service_id.videolink,
        name: req.language === 'ar' ? service.service_id.arabic_name : service.service_id.english_name,
        address_main: req.language === 'ar' ? service.service_id.address_arabic_main : service.service_id.address_english_main,
        address_sub: req.language === 'ar' ? service.service_id.address_arabic_sub : service.service_id.address_english_sub,
        youtube_number: service.service_id.youtube_number,
        instagram_number: service.service_id.instagram_number,
        twitter_number: service.service_id.twitter_number,
        snap_number: service.service_id.snap_number,
        tiktok_number: service.service_id.tiktok_number,
        linkedin_number:service.linkedin_number,
        questions_and_answers: questions_and_answers,
        whyMain_and_whySub: whyMain_and_whySub,
        bunch: service.service_id.bunch,
        price: service.service_id.price,
        note: service.service_id.note,
        image:service.service_id.image
      };
    }).filter(service => service !== null); 


    res.status(200).json({
      main_name_arabic: mainServices.main_arabic_name,
      main_name_english: mainServices.main_english_name,
      services
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};


const get_service_in_dash = async (req, res) => {
    try {
        const service_id = req.params.service_id;
        const service = await Services.findById(service_id);

      if(!service){return res.status(404).send('not exist')}
        
        res.status(200).json(service);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service', error });
    }
};

const get_all_services_in_dash = async (req, res) => {
    try {
        const  main_id  = req.params.main_id

        const main = await Main.findById(main_id).populate('services_list.service_id');

        if (!main) {
            return res.status(404).json({ message: 'Main not found' });
        }

     
        const response = main.services_list.map(service => ({
            service_id: service.service_id._id,
            service_name_arabic: service.service_id.arabic_name,
            service_name_english: service.service_id.english_name,
            video_link: service.service_id.videolink,
            address_main_arabic: service.service_id.address_arabic_main,
            address_main_english: service.service_id.address_english_main,
            address_sub_arabic: service.service_id.address_arabic_sub,
            address_sub_english: service.service_id.address_english_sub,
            youtube_number: service.service_id.youtube_number,
            instagram_number: service.service_id.instagram_number,
            twitter_number: service.service_id.twitter_number,
            snap_number: service.service_id.snap_number,
            tiktok_number: service.service_id.tiktok_number,
            bunch: service.service_id.bunch,
            price: service.service_id.price,
            note: service.service_id.note,
            questions_and_answers: service.service_id.questions_and_answers,
            whyMain_and_whySub: service.service_id.whyMain_and_whySub,
            image:service.service_id.image
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error });
    }
};

const delete_service = async (req, res) => {
    try {
        const service_id = req.params.service_id;
        
        const ser = await Services.findById(service_id);

        const deletedService = await Services.findByIdAndDelete(service_id);

        if (!deletedService) return res.status(404).json({ message: 'Service not found' });


 
    const deleteinmain = await Main.updateMany(
      { "services_list.service_id": service_id },
      { $pull: { services_list: { service_id: service_id } } }
    );

    if (!deleteinmain) return res.status(404).json({ message: 'Service in main not found' });

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.STORAGE_BUCKET
            });
        }

        const bucket = admin.storage().bucket();
        const file = bucket.file(ser.image.split('/').pop()); 

        await file.delete();

        
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
};


const delete_all_services = async (req, res) => {
    try {
      const deletedServices =  await Services.deleteMany();
      if (!deletedServices) return res.status(404).json({ message: 'error in removing !!' });


        res.status(200).json({ message: 'All services deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all services', error });
    }
};



module.exports = {
    admin_Register,
    admin_Login,
    add_main,
    get_main,
    get_all_main,
    edit_main,
    delete_main,
    delete_all_mains,
    get_main_in_dash,
    get_all_main_in_dash,
    

    add_service_to_main,
    edit_service,
    get_service,
    get_all_services,
    delete_service,
    delete_all_services,
    get_service_in_dash,
    get_all_services_in_dash
};
