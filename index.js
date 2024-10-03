const express = require("express");
require("dotenv").config();
const db = require("./configs/mongoose.config.js");

const indexRouter = require("./routes/index.routes.js");

const app = express();
const PORT = process.env.PORT;    

app.use(express.json());

app.use('/', indexRouter)

app.listen(PORT, (err) => {
    if (err) {
        console.log(`error in express server ${PORT}`);
    }

    console.log(`express server is running on PORT ${PORT}`);
})