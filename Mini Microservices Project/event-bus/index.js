/**
 * Simplification of an event-bus to help understand how microservices solve the 'data' problem.
 */

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

app.use(bodyParser.json());

// Local storage of events (in space of a database call)
const events = [];

// Sends all the events for a given period
app.get('/events', async (req, res) => {
    res.send(events);
});

app.post("/events", (req, res) => {
    const event = req.body;

    events.push(event);

    console.log('Event-Bus: ', event);

    axios.post('http://localhost:4000/events', event).catch((err) => {console.log(err.message)});
    axios.post('http://localhost:4001/events', event).catch((err) => {console.log(err.message)});
    axios.post('http://localhost:4002/events', event).catch((err) => {console.log(err.message)});
    axios.post('http://localhost:4003/events', event).catch((err) => {console.log(err.message)});

    res.send({ status: 'OK' });
});

app.listen(4005, () => {
    console.log('Listening on Port 4005');
});