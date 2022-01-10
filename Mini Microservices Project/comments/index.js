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
    const newComment = {
        id: commentId,
        content: content,
        postId: postId,
        status: 'pending', 
    };

    comments.push(newComment);

    // adds a new entry for that postId OR overwrites the entry if one already exists
    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: newComment,
    }).catch((err) => {
        console.log(err.message);
    });

    res.status(201).send(commentsByPostId[postId]);
});


// handles the event
app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
    const { type, data } = req.body;
    
    if (type == 'CommentModerated') {
        const { id, postId, status, content } = data;
        console.log('Comment has been moderated');

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;


        await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
            id, 
            status,
            postId,
            content
        },
    }).catch((err) => {
        console.log(err.message);
    });
    }
    
    res.send({});
});


app.listen(4001, () => {
    console.log('Listening on 4001');
});