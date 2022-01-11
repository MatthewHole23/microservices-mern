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
const STATUSES = {
    'pending': 'This comment is pending moderation',
    'rejected': 'This comment contains suspected illegal word(s)',
}

app.post('/events', (req, res) => {
    // Gets the body of the request
    const body = req.body;

    console.log('Posts: ', posts);

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
        const { id, postId, content, status} = body.data;
        if (posts[postId]) {
            if (status == 'pending') {
                posts[postId]['comments'].push({
                    id,
                    content: STATUSES[status],
                    status,
                });
            } else {
                posts[postId]['comments'].push({
                    id,
                    content,
                });
            }
        }
    } else if (body.type == 'CommentUpdated') {
        const { id, postId, content, status} = body.data;

        console.log('Updated Data: ', body.data);


        if (posts[postId]) {
            if (status == 'approved') {
                // Finds index of element within array
                const index = posts[postId]['comments'].findIndex((comment => comment.id == id));
                posts[postId]['comments'][index] = body.data;
            
            } else {
                // Finds index of element within array
                const index = posts[postId]['comments'].findIndex((comment => comment.id == id));
                posts[postId]['comments'][index] = {
                    id,
                    postId,
                    status,
                    content: STATUSES[status],
                };
            }
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