const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');
const cors = require('cors')


const app = express();

mongoose.connect("mongodb+srv://khandveatharva:iaFF0hn0155xThPs@cluster0.9e3op.mongodb.net/ExpenseMaster")
            .then(() => console.log("DB connected successfully"))
            .catch((e) => console.log(e));

app.use(express.json()) //this will pass the incoming json data from the user

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use("/", router);

app.listen(3000, console.log("server is up and running on port 6000"))