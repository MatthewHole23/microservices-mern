import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

app.post('/events', (req, res) => {

});

app.listen(4003, () => {
    console.log('Listening on Port 4003');
})