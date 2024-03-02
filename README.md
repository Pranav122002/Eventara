# Teamname: kimchiCoders

## Eventara

## Introduction
The Eventara is an Event Management tool where users can subscribe to committee, join a committee and even chat with a committee to clarify their doubts.

## Key Features
1. **Event Setup and Approval Process**
   - Different committees can set up events and submit them for approval from the Principal, Dean of Student Affairs, Head of Department (H.O.D), and Faculty Mentor.
   
2. **Notification System**
   - Automatic notifications are sent to relevant authorities upon event submission, keeping them informed and expediting the approval process.

3. **Chat Functionality**
   - Users can communicate with committee members via built-in chat functionality, facilitating collaboration and coordination.

4. **Student Engagement**
   - Students can join events and stay updated on campus activities through the platform, fostering greater participation and community engagement.

5. **Venue Availability**
   - Committees can check the availability of rooms and venues to avoid scheduling conflicts and ensure smooth event execution.

## [Video Demo](https://youtu.be/Dv1Qu3aqctQ)

## Getting Started
To get started with the Agnethon Event Management System:

1. Clone the repository:
```
git clone https://github.com/Pauloper1/kimchiCoders.git
```

2. Navigate to the project directory:
```
cd KimchiCoders
```

3. Start the React frontend:
``` 
npm install
npm start
```
4. Start the Express.js backend:
```
cd backend
npm install
npm start
```

5. Access the application at `http://localhost:3000` in your web browser.

### Dependencies
This project uses Cloudinary to store PDFs and Twilio for whatsapp services.

- create .env file in backend folder and add the following.
```
MONGOURI=MongoLink
JWT_SECRET=helloworld
accountSid=TwilioSID
whatsapp=TwilioWhatsapp
authToken=TwilioToken
cloud_name=CloudinaryName
api_key=CloudinaryAPIKey
api_secret=CloudinaryAPISecret
```
- Also, create `config.js` in `frontend/src` and add the following
``` javascript
export const API_BASE_URL='http://localhost:5000'
export const  CLOUD_NAME= 'CloudinaryName'
export const  UPLOAD_PRESET = 'CloudinaryPreset'
```

## Technologies Used
- React
- Express.js
- MongoDB
- SocketIO
- Python
- Twilio
