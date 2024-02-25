const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const sendWhatsAppMessage = require('./sendWhatsAppMessage')
const {uploadPDF} = require('./uploadPDF')
// Function to generate PDF from Committee document
async function generatePDFFromCommittee(committee, recipient_number, isEvent) {
    console.log(committee)
    try {
        // Read HTML template file
        let isEvent_Com
        let htmlTemplatePath 
        let eventName
        if(!isEvent){
            isEvent_Com = "Committee"
            eventName = committee.committee_name
            htmlTemplatePath = path.join(__dirname, 'committee_template2.html');
        } else {
            eventName = committee.name
            isEvent_Com = "Event"
            htmlTemplatePath = path.join(__dirname, 'event_template2.html');
        }

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
        const pdfFileName = `${committee.committee_name}_${Date.now()}.pdf`
        const pdfFilePath = path.join(pdfDirectory, pdfFileName);
        fs.writeFileSync(pdfFilePath, pdfBuffer);
        //upload pdf to cloudinary
        const pdfurl = await uploadPDF(pdfFilePath)
        console.log(pdfurl.url)
        
        const message = `Dear admin, a new ${isEvent_Com}, ${eventName}, needs your approval. Please read the details about the ${isEvent_Com} and approve it.`;
        await sendWhatsAppMessage(recipient_number, message, pdfurl.url);

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
