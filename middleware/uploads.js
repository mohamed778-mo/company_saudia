const multer = require('multer')
const path = require('path')

const Istorage = multer.diskStorage({

    filename:(req,file,cb)=>{
        var extention = path.extname(file.originalname)
        cb(null, Date.now() + extention)
    }
})

const Iupload=multer({
    storage:Istorage,
    limits:{fileSize: 1024 * 1024 * 1024},
    fileFilter:(req,file,cb)=>{
        fileType = file.mimetype == "image/png" || file.mimetype ==  "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4"||file.mimetype == 'video/gif'||file.mimetype === 'video/webm'||file.mimetype === 'video/ogg'||file.mimetype === "application/pdf"
            
        if(fileType){
            cb(null,true)
        }
        else{
            cb(null,false)
        }
        }



})


const Vstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos'); 
    },
    filename: (req, file, cb) => {
        const extention = path.extname(file.originalname);
        cb(null, Date.now() + extention);
    }
});

const Vupload = multer({
    storage: Vstorage,
    limits: { fileSize: 1024 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileType = file.mimetype === 'video/mp3' || file.mimetype === 'video/mp4' || file.mimetype === 'video/webm' || file.mimetype === 'video/ogg';
        if (fileType) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file format'), false);
        }
    }
});



module.exports = {Iupload,Vupload} 



