// twilioWhatsApp.js

const accountSid = process.env.accountSid;
const whatsapp = process.env.whatsapp;
const authToken = process.env.authToken; 
const client = require('twilio')(accountSid, authToken);

function sendWhatsAppMessage(to, messageBody, pdfUrl) {
    console.log(to, '\n', messageBody, '\n' , pdfUrl)

    if(!pdfUrl){
        client.messages
        .create({
            body: messageBody,
            from: `whatsapp:${whatsapp}`,
            to: `whatsapp:${to}`
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error sending message:', error.message));
    } else {
        client.messages
            .create({
                body: messageBody,
                from: `whatsapp:${whatsapp}`,
                to: `whatsapp:${to}`,
                // mediaUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                mediaUrl: pdfUrl
            })
            .then(message => console.log(message.sid))
            .catch(error => console.error('Error sending message:', error.message));
    }
}

module.exports = sendWhatsAppMessage;
