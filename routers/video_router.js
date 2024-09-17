const express = require("express")
const router=express.Router()
const { getVideoinService, deletevideo, postvideofromviemotoDB}=require('../controllers/video_control')
const { adminAuth } = require('../middleware/auth');


router.get('/get_video_in_service/:service_id',  getVideoinService)
router.delete('/delete_video/:service_id/:video_id', deletevideo)
router.post('/download_video/:service_id', postvideofromviemotoDB)





module.exports = router;
