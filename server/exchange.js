const express = require('express')
const app = express();
const port = 3002;

const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let sendData;
let patientID;

app.post('/sendID', (req, res) => {
    console.log("sendID", req.body);
    patientID = req.body.userID;
})

app.post('/receiveID', (req, res) => {
    res.send(patientID);
    console.log("Done");
})

app.post('/', (req, res) => {
    console.log('-----------------');

    // data 받는 곳
    const text = req.body;
    console.log(text);
    
    sendData = text;
    // data 보내는 곳
    console.log("send prepare :",sendData);
})

app.post('/send', (req, res) => {
    console.log('=============');

    // data 보내는 곳
    res.send(sendData);
    console.log("sending : ",sendData);
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Example app listening');
})