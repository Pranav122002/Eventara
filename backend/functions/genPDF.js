const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const sendWhatsAppMessage = require('./sendWhatsAppMessage')
// Function to generate PDF from Committee document
async function generatePDFFromCommittee(committee, recipient_number) {
    try {
        // Read HTML template file
        const htmlTemplatePath = path.join(__dirname, 'committee_template.html');
        const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

        // Compile HTML template using Handlebars
        const template = handlebars.compile(htmlTemplate);

        // Replace placeholders with actual values from Committee document
        const htmlContent = template(committee);

        // Generate PDF from HTML content using Puppeteer
        const pdfBuffer = await generatePDF(htmlContent);

        // Define the directory to store PDF files
        const pdfDirectory = path.join(__dirname, 'pdfs');
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory);
        }

        // Save PDF to a file in the directory
        const pdfFileName = `committee_details_${Date.now()}.pdf`; // Generate unique file name
        const pdfFilePath = path.join(pdfDirectory, pdfFileName);
        fs.writeFileSync(pdfFilePath, pdfBuffer);

        const message = "Dear admin, a new committee is requested to be formed. Please read the details about the committee and approve it.";
        await sendWhatsAppMessage(recipient_number, message, pdfFilePath);

        console.log("PDF sent via WhatsApp successfully.");

    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
}

// Function to generate PDF from HTML content using Puppeteer
async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();
    return pdfBuffer;
}

module.exports = generatePDFFromCommittee;

// Example usage
// Assume 'committee' is your MongoDB Committee document
const committee = {
    committee_name: "Example Committee",
    committee_image: "https://example.com/committee_image.jpg",
    committee_desc: "This is an example committee description.",
    approval_status: "pending",
    creation_date: new Date(),
    status: "active",
    meeting_schedule: {
        frequency: "Weekly",
        time: "10:00 AM",
        location: "Conference Room"
    },
    budget: 5000,
    contact_information: {
        email: "committee@example.com",
        phone_number: "+1234567890",
        office_location: "Building A, Room 101"
    },
    tags: ["Tag1", "Tag2", "Tag3"]
};

// generatePDFFromCommittee(committee);
