const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const MongoStore = require('connect-mongo')(session);
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config();

/*##################################################################################
BCRYPT CONFIG
##################################################################################*/
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// var salt = bcrypt.genSaltSync(12);
// var enc = bcrypt.hashSync("password", salt);

/*################################################################################*/

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

var app = express();
app.use(cors(corsOptions));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended : true, limit: '100mb'}));
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        dbName: "sessions_db"
    }),
    cookie: { 
        //secure: true,
        SameSite: "Lax"
    }
}));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.set('x-powered-by', 'Rebel-IST');