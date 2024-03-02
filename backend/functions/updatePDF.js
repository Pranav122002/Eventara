const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const mongoose = require('mongoose')
const fetch = require('node-fetch');
const { uploadPDF } = require('./uploadPDF');
const ADMIN = mongoose.model('ADMIN')
const COMMITTEE = mongoose.model('COMMITTEE');
const path = require('path')

// Function to download PDF from the COMMITTEE model
async function downloadPDF(committeeId) {
    console.log("Downloading PDF")
    const committee = await COMMITTEE.findById(committeeId);
    console.log(committee.pdf)
    const pdfUrl = committee.pdf;
    const pdfBuffer = await fetch(pdfUrl).then(res => res.buffer());
    return pdfBuffer;
}

// Function to add signature and additional information to the PDF
async function addSignatureToPDF(pdfBuffer, adminId) {
    console.log("Adding sign")
    const admin = await ADMIN.findById(adminId);
    const signatureUrl = admin.admin.signature;
    const signatureImageData = await fetch(signatureUrl).then(res => res.buffer());

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const [existingPage] = pdfDoc.getPages(); // Get the existing first page

    // Create a new page for the signature
    const newPage = pdfDoc.addPage();

    // Add signature image to the new page
    const signatureImage = await pdfDoc.embedPng(signatureImageData);
    const { width, height } = newPage.getSize();
    const imageSize = { width: 100, height: 50 };
    newPage.drawImage(signatureImage, {
        x: width / 2 - imageSize.width / 2,
        y: height / 2 - imageSize.height / 2,
        width: imageSize.width,
        height: imageSize.height,
    });

    const name = admin.name;
    newPage.drawText(`Name: ${name}`, {
        x: 50,
        y: height - 100,
        size: 12,
    });

    // Save the updated PDF
    const pdfDirectory = path.join(__dirname, 'updatedpdfs');
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory);
        }
    const pdfFileName = `updated_pdf_${Date.now()}.pdf`;
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);
    const pdfBytes = await pdfDoc.save();
    try {
        fs.writeFileSync(pdfFilePath, pdfBytes);
        console.log(`Updated PDF saved successfully to ${pdfFilePath}`);
    } catch (error) {
        console.error("Error saving updated PDF:", error);
        throw error;
    }

    return pdfFilePath;
}

// Function to upload and update the PDF URL in COMMITTEE model
async function uploadAndSavePDF(committeeId, updatedPdfPath) {
    // Code to upload the updated PDF and obtain its URL
    try{
        const absolutePdfPath = path.resolve(updatedPdfPath);
        const updatedPdfUrl =  await uploadPDF(absolutePdfPath)
        await COMMITTEE.findByIdAndUpdate(committeeId, { pdf: updatedPdfUrl.url });
    }catch (err){
        console.log(err)
    }
}

async function updatePDF(committeeId, adminId) {
    try {
        // Download the PDF from COMMITTEE model
        const pdfBuffer = await downloadPDF(committeeId);

        // Add signature and additional information to the PDF
        const updatedPdfPath = await addSignatureToPDF(pdfBuffer, adminId);

        // Upload and update the PDF URL in COMMITTEE model
        await uploadAndSavePDF(committeeId, updatedPdfPath);

        console.log('PDF updated successfully');
    } catch (error) {
        console.error('Error updating PDF:', error);
    }
}

// Call the updatePDF function with the committeeId and adminId
module.exports = updatePDF

