const express = require("express")
const router=express.Router()
const { getVideoinService, deletevideo, postvideofromviemotoDB}=require('../controllers/video_control')
const { adminAuth } = require('../middleware/auth');


router.get('/get_video_in_service/:service_id', adminAuth , getVideoinService)
router.delete('/delete_video/:service_id/:video_id', adminAuth ,deletevideo)
router.post('/download_video/:service_id', adminAuth , postvideofromviemotoDB)





module.exports = router;
