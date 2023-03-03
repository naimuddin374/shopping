const multer = require('multer');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // specify the destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // specify the filename
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/ // Choose Types you want...
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(new Error('Images only!')) // custom this message to fit your needs
    }
}

// Initialize upload
const fileUpload = multer({
    limits: {
        fileSize: 10000000 // maximum file size in bytes (10 MB)
    },
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
});

// const fileUpload = (req, res) => {
//     return new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//             if (err) {
//                 reject(err)
//             }
//             resolve(req.file)
//         });
//     })
// }

module.exports = fileUpload
