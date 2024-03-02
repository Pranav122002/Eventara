const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

async function uploadPDF(pdfFilePath) {
    try {
            const url = await cloudinary.uploader.upload(pdfFilePath, (error, result) => {
                if (error) {
                throw error;
            }
            // console.log(result.url)
            
            return result
        });
        return url
    } catch (error) {
        console.error("Error uploading PDF to Cloudinary:", error);
        throw error;
    }
}

module.exports = { uploadPDF };
