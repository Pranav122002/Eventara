const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');
const sendWhatsAppMessage = require('./sendWhatsAppMessage')
const { uploadPDF } = require('./uploadPDF');
const { registerCustomQueryHandler } = require('puppeteer');
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')

async function generatePDFCommittee(committee, recipient_number) {
  try {

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add content to the PDF
    page.drawText(`Committee Name: ${committee?.committee_name}`, {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Committee Description: ${committee?.committee_desc}`, {
      x: 50,
      y: height - 80,
      size: 20,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Committee Head: ${committee?.committee_head?.name ?? 'Not available'}`, {
      x: 50,
      y: height - 110,
      size: 20,
      color: rgb(0, 0, 0),
    });

    page.drawText('Members:', {
      x: 50,
      y: height - 140,
      size: 20,
      color: rgb(0, 0, 0),
    });

    let yPos = height - 170;
    committee?.members?.forEach((member, index) => {
      page.drawText(`${index + 1}. ${member?.name ?? 'Not available'}`, {
        x: 70,
        y: yPos - (index * 30),
        size: 18,
        color: rgb(0, 0, 0),
      });
    });

    const pdfsDirectory = path.join(__dirname, 'pdfs');
    if (!fs.existsSync(pdfsDirectory)) {
      fs.mkdirSync(pdfsDirectory);
    }
    const pdfPath = path.join(pdfsDirectory, `${committee.committee_name}.pdf`);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);


    const pdfurl = await uploadPDF(pdfPath)
    console.log(pdfurl.url)
    try {
      const updatedCommittee = await COMMITTEE.findByIdAndUpdate(committee._id,
        { $set: { pdf: pdfurl.url } })
      console.log(updatedCommittee)
    } catch (err) {
      throw new Error(err)
    }
    const message = `Dear admin, a new committee,  ${committee.committee_name}, needs your approval. Please read the details about the committee and approve it.`;
    await sendWhatsAppMessage(recipient_number, message, pdfurl.url);

    console.log("PDF sent via WhatsApp successfully.");


    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

module.exports = generatePDFCommittee

