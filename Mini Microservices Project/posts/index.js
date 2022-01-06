import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();

// stores the created posts
const posts = {};

// middleware to parse the incoming request
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    // Sends all of the created posts
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    // expects {title: string}
    const { title } = req.body;

    posts[id] = {
        id, 
        title,
    };

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});