/**
 * Query Service used for returning post information
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.post('/events', (req, res) => {
    // Gets the body of the request
    const body = req.body;

    if (body.type == 'PostCreated') {
        const { id, title} = body.data;
        if (!posts[id]) {
            posts[id] = {
                id,
                title,
                comments: [],
            };
        }
    } else if (body.type == 'CommentCreated') {
        const { id, postId, content} = body.data;
        if (posts[postId]) {
            posts[postId]['comments'].push({
                id,
                content,
            });
        }
    }

    console.log(posts);

    res.status({});
});

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.listen(4002, () => {
    console.log('Listening on Port 4002');
});

// function addPost(post, currentPosts) {
//     // Error Handling
//     if (!currentPosts[data.postId]) {
//         currentPosts[data.postId] = data;
//     } else {
//         console.log('Error: An attempt was made to create a post record with an existing postId');
//     }

//     return currentPosts;
// }

// function addComment(comment, currentPosts) {
//     // Error Handling
//     // Checks if the post exists
//     if (currentPosts[data.postId]) {
//         if (!currentPosts[data.postId][data.id]) {
//             currentPosts[data.postId] = post;
//         }
        
//     } else {
//         console.log('Error: An attempt was made to add a comment to a post record that does not exist');
//     }

//     return currentPosts;
// }