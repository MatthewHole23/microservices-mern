import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.post('/moderation', (res, req) => {

});

app.listen(4004, () => {
    console.log('Listening on 4004');
});