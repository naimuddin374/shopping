const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const config = require('config');
const { getCloudinaryPublicId } = require('./helper');


const maxSize = 1 * 1024 * 1024;

const uploadImage = multer({
    dest: 'uploads/',
    limits: {
        fileSize: maxSize
    }
});


// Configure Cloudinary
cloudinary.config({
    cloud_name: config.get('YOUR_CLOUD_NAME'),
    api_key: config.get('YOUR_API_KEY'),
    api_secret: config.get('YOUR_API_SECRET'),
});



const fileUploadHandler = async (req, _res, next) => {
    if (!req.file) return null;
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        return result.secure_url;
    } catch (error) {
        console.log('file upload error: ' + error.toString())
        next(error);
    }
}
const fileDeleteHandler = async (sourceUrl) => {
    if (!sourceUrl) return true;
    try {
        const publicId = getCloudinaryPublicId(sourceUrl);
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log('Delete file error:', error.toString())
    }
}


module.exports = {
    uploadImage,
    fileUploadHandler,
    fileDeleteHandler
}