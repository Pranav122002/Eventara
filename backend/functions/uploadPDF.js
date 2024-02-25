const cloudinary = require('cloudinary').v2;

// CLOUDINARY_URL=cloudinary://286383261469635:IrWJnnz1Az8705HuVTTIv3M6178@dw3rvn7dh
cloudinary.config({
  cloud_name: 'dw3rvn7dh',
  api_key: '286383261469635',
  api_secret: 'IrWJnnz1Az8705HuVTTIv3M6178'
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
