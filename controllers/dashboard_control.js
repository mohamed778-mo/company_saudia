const Admin = require("../models/admin");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Services = require("../models/service");
const Main = require("../models/main");
require("dotenv").config();

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
        const data = req.body;
        const main_id = req.params.main_id;

        
        const exsit_service = await Services.findOne({
            arabic_name: data.arabic_name,
            address_arabic_main: data.address_arabic_main
        });

        if (exsit_service) {
            return res.status(400).json({ message: 'Service already exists!' });
        }

       
        const newService = new Services(data);
        await newService.save();

      
        const maindata = await Main.findById(main_id);

        if (!maindata) {
            return res.status(404).json({ message: 'Main not found!' });
        }

       
        const isexsitinmain = maindata.services_list.some(service => 
            service.service_id.equals(newService._id) &&
            service.Service_arabic_name === newService.arabic_name &&
            service.Service_english_name === newService.english_name
        );

        if (isexsitinmain) {
            return res.status(400).json({ message: 'Service already exists in main!' });
        }

        
        const updatedMain = await Main.findByIdAndUpdate(
            main_id,
            { $push: { services_list: { service_id: newService._id, Service_arabic_name: newService.arabic_name, Service_english_name: newService.english_name } } },
            { new: true }
        );

        res.status(200).json(updatedMain);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new service', error });
    }
};



const edit_service = async (req, res) => {
  try {
      const data = req.body;
      const service_id = req.params.service_id;

     
      const updatedService = await Services.findByIdAndUpdate(service_id, data, { new: true });

      if (!updatedService) {
          return res.status(404).json({ message: 'Service not found' });
      }

      
      await Main.updateMany(
          { 'services_list.service_id': service_id },
          {
              $set: {
                  'services_list.$.Service_arabic_name': data.arabic_name,
                  'services_list.$.Service_english_name': data.english_name
              }
          }
      );

      res.status(200).json(updatedService);
  } catch (error) {
      res.status(500).json({ message: 'Error updating service', error });
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
            questions_and_answers: questions_and_answers,
            whyMain_and_whySub: whyMain_and_whySub,
            bunch: service.bunch
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service', error });
    }
};


const get_all_services = async (req, res) => {
    try {
        const services = await Services.find();

        if (!services || services.length === 0) {
            return res.status(200).send([]);
        }

        const response = services.map(service => {
            const questions_and_answers = service.questions_and_answers.map(qa => ({
                question: req.language === 'ar' ? qa.question_arabic : qa.question_english,
                answer: req.language === 'ar' ? qa.answer_arabic : qa.answer_english
            }));

            const whyMain_and_whySub = service.whyMain_and_whySub.map(why => ({
                why_main: req.language === 'ar' ? why.why_main_arabic : why.why_main_english,
                why_sub: req.language === 'ar' ? why.why_sub_arabic : why.why_sub_english
            }));

            return {
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
                questions_and_answers: questions_and_answers,
                whyMain_and_whySub: whyMain_and_whySub,
                bunch: service.bunch
            };
        });

        res.status(200).json(response);
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
        const services = await Services.find();

        if (!services || services.length === 0) {
            return res.status(200).send([]);
        }

        res.status(200).send(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error });
    }
};

const delete_service = async (req, res) => {
    try {
        const service_id = req.params.service_id;

        const deletedService = await Services.findByIdAndDelete(service_id);

        if (!deletedService) return res.status(404).json({ message: 'Service not found' });


 
    const deleteinmain = await Main.updateMany(
      { "services_list.service_id": service_id },
      { $pull: { services_list: { service_id: service_id } } }
    );

    if (!deleteinmain) return res.status(404).json({ message: 'Service in main not found' });


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
