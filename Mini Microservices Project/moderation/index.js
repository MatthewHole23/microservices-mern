import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Unsure whether we want to be able to update this from an API call (obviously this would be stored in a DB in practice)
const illegalWords = ['orange'];

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    console.log('Data within moderation');

    if (type == 'CommentCreated') {
        await sleep(2000);
        // modifies the data object
        const comment = moderateComment(data);
        console.log(comment);

        await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: comment
        }).catch((err) => {
            console.log(err.message);
        });

        res.status(201).send(comment);
    } else {
        res.send({});
    }
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});

function moderateComment(comment) {
    console.log('Comment for moderation: ', comment);
    // iterates through illegalWords
    illegalWords.forEach(word => {
        // if content includes illegal word, status updated before short-circuit
        if (comment?.content.includes(word)) {
            comment['status'] = 'rejected';
            console.log(`Rejected comment for use of '${word}' illegal word`);
            return;
        }
    });

    // updates status with approved
    comment['status'] = (comment['status'] === 'pending') ? 'approved' : comment['status'];
    return comment;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }