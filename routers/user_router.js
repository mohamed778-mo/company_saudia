const router = require('express').Router();
;
const { setLanguage } = require('../middleware/setLanguage');     

const {  get_service , get_all_services } = require('../controllers/dashboard_control');

   const { create_form }=require('../controllers/web_control')



router.post('/create_form', setLanguage, create_form);

router.get('/get_service/:sevice_id',setLanguage, get_service);
router.get('/get_all_service/:main_id',setLanguage, get_all_services);


module.exports = router;
