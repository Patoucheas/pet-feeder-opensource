const express = require('express');
const path = require('path');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
process.env.TZ = 'America/New_York'; // Set time zone

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('./')); // Serve static files

let lastCommand = "none";
let lastFeedingTime = null; // Variable to store the last feeding time
let scheduledFeeds = []; // Array to store scheduled feeding times
process.stdout.write('Hello World! using stdout');
console.log('Hello world using console.log');
// Function to update last feeding time
function updateLastFeedingTime() {
    lastFeedingTime = new Date().toISOString();
}

// Function to schedule a feeding
function scheduleFeeding(time) {
    const [hour, minute] = time.split(':');
    const cronTime = `${minute} ${hour} * * *`;
    const job = schedule.scheduleJob(cronTime, function(){
        lastCommand = "feed";
        updateLastFeedingTime(); // Update last feeding time
        console.log(`Scheduled feeding at ${time}`);
    });
    return job;
}

// Configure nodemailer for email notifications
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'EnterYourEmailHere@gmail.com',
        pass: 'EnterYourPasswordHere'
    }
});

// Function to send email notification
function sendEmailNotification() {
    const mailOptions = {
        from: 'EnterYourEmailHere@gmail.com',
        to: 'EnterYourEmailHere@gmail.com',
        subject: 'Pet Near Food Bowl Notification',
        text: 'Your pet is standing in front of the food bowl and might be hungry!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Endpoint to handle pet near bowl notification
app.post('/pet-near-bowl', (req, res) => {
    sendEmailNotification();
    res.json({ message: 'Notification sent' });
});

// Endpoint to get all scheduled feeding times
app.get('/get-schedules', (req, res) => {
    res.json(scheduledFeeds.map(schedule => schedule.time));
});

// Endpoint to add a new feeding schedule
app.post('/schedule-feeding', (req, res) => {
    const { time } = req.body;
    const job = scheduleFeeding(time);
    scheduledFeeds.push({ time, job });
    res.json({ message: `Feeding scheduled at ${time}` });
});

// Endpoint to delete a feeding schedule
app.delete('/delete-schedule', (req, res) => {
    const { time } = req.body;
    const index = scheduledFeeds.findIndex(schedule => schedule.time === time);
    if (index !== -1) {
        scheduledFeeds[index].job.cancel();
        scheduledFeeds.splice(index, 1);
        res.json({ message: `Feeding schedule at ${time} deleted` });
    } else {
        res.status(404).json({ message: `Schedule not found for ${time}` });
    }
});

// Handle feed command from the Web UI
app.post('/feed', (req, res) => {
    lastCommand = "feed";
    updateLastFeedingTime(); // Update last feeding time
    res.json({ message: 'Feeding started' });
});

// Endpoint to check the last feeding time
app.get('/last-feeding', (req, res) => {
    res.json({ lastFeeding: lastFeedingTime });
});

// Handle periodic check from TTGO device
app.get('/check-command', (req, res) => {
    res.json({ command: lastCommand });
    lastCommand = "none";
});

// Serve the HTML file at root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
