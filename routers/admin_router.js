const router = require('express').Router();
const { adminAuth } = require('../middleware/auth');
const { setLanguage } = require('../middleware/setLanguage');     


const { 
  admin_Register,
    admin_Login,
    add_main,
    edit_main,
    delete_main,
    delete_all_mains,
    get_main_in_dash,
    get_all_main_in_dash,
    

    add_service_to_main,
    edit_service,
    delete_service,
    delete_all_services,
    get_service_in_dash,
    get_all_services_in_dash
 } = require('../controllers/dashboard_control');

 const {  
  get_all_forms,
  delete_form,
  delete_all_form,
   
  get_all_contact_forms,
  delete_contact_form,
  delete_all_contact_form,
   get_contact_form
}=require('../controllers/web_control')


const {Iupload,Vupload} = require("../middleware/uploads")

router.post('/admin_register', setLanguage, admin_Register);
router.post('/admin_login', setLanguage, admin_Login);



router.post('/add_main',adminAuth, add_main);
router.patch('/edit_main/:main_id',adminAuth, edit_main);

router.get('/get_main_in_dash',adminAuth, get_main_in_dash);
router.get('/get_all_main_in_dash',adminAuth, get_all_main_in_dash);

router.delete('/delete_main/:main_id',adminAuth, delete_main);
router.delete('/delete_all_main',adminAuth, delete_all_mains);



router.post('/add_service_to_main/:main_id',adminAuth, Iupload.any() , add_service_to_main);

router.patch('/edit_service/:service_id',  Iupload.any() ,edit_service);


router.get('/get_service_in_dash/:service_id',adminAuth,  get_service_in_dash);
router.get('/get_all_services_in_dash/:main_id',adminAuth, get_all_services_in_dash);



router.delete('/delete_service/:service_id',adminAuth, delete_service);
router.delete('/delete_all_services/',adminAuth, delete_all_services);


router.get('/get_all_forms',adminAuth, setLanguage, get_all_forms);
router.delete('/delete_form:/form_id', adminAuth, delete_form);
router.delete('/delete_all_form',adminAuth,  delete_all_form);

router.get('/get_all_contact_forms',adminAuth, setLanguage, get_all_contact_forms);

router.get('/get_contact_form:/form_id',adminAuth, setLanguage, get_contact_form);

router.delete('/delete_contact_form:/form_id', adminAuth, delete_contact_form);
router.delete('/delete_all_contact_form',adminAuth,  delete_all_contact_form);

module.exports = router;
