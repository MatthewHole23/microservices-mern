import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import axios from "axios";
import cors from "cors";

const app = express();

// stores the the comments for certain posts
/**
 * {
 *   postId: [
 *     {id, content},
 *     {id, content}],
 * }
 */
const commentsByPostId = {};

// middleware to parse the incoming request
app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
    // Sends all the comments of the post
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    // expects {content: string}
    const { content } = req.body;
    const postId = req.params.id;

    const comments = commentsByPostId[postId] || [];

    comments.push({
        id: commentId,
        content: content,
    });

    // adds a new entry for that postId OR overwrites the entry if one already exists
    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
        }
    }).catch((err) => {
        console.log(err.message);
    });

    res.status(201).send(commentsByPostId[postId]);
});


// handles the event
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});


app.listen(4001, () => {
    console.log('Listening on 4001');
});