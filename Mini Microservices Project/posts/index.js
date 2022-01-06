import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();

// stores the created posts
const posts = {};

// middleware to parse the incoming request
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    // Sends all of the created posts
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    // expects {title: string}
    const { title } = req.body;

    posts[id] = {
        id, 
        title,
    };

    await axios.post('http://localhost:4005/events', {
        type: "PostCreated",
        data: posts[id],
    });

    res.status(201).send(posts[id]);
});


// handles the event
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});


app.listen(4000, () => {
    console.log('Listening on 4000');
});