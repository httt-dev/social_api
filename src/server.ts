import express, { Request, Response } from 'express';
const port = process.env.PORT || 5000;
const app = express();

app.get('/', (req : Request ,  res : Response)=> {
    res.send('API  OK');
})

app.listen(port , () => {
    console.log(`Server is listening on port ${port}`);
})