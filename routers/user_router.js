const router = require('express').Router();
;
const { setLanguage } = require('../middleware/setLanguage');     

const {  get_service , get_all_services ,get_main, get_all_main  } = require('../controllers/dashboard_control');

   const { create_form , create_contact_form , createformother , create_form_special }=require('../controllers/web_control')



router.post('/create_form/:service_id', setLanguage, create_form);
router.post('/CreateFormOther', setLanguage, createformother);
router.post('/create_form_special', setLanguage, create_form_special);

router.post('/create_contact_form', setLanguage, create_contact_form);


router.get('/get_main/:main_id',setLanguage, get_main);
router.get('/get_all_main',setLanguage, get_all_main);

router.get('/get_service/:service_id',setLanguage, get_service);
router.get('/get_all_service/:main_id',setLanguage, get_all_services);


module.exports = router;
