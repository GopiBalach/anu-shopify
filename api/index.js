// Initializing the variables
const express = require('express');
const app = express();
const cors = require('cors');
const https =require('https');
const fs = require('fs');
const db = require('./models');
const { User, Category, Item } = require('./models');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// then express and cors
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// this for the cookies
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true }));
app.use(session({
    key: "userId",
    // this for development
    secret: "tempsecret",
    resave: false,
    saveUninitialized:false,
    cookie: {
        // cookie expires in 8 hours
        expires: 60 * 60 * 8,
    },
}));

// Routers
const itemRouter = require('./routes/Items');
app.use("/items", itemRouter);
const bidRouter = require('./routes/Bids');
app.use("/bids", bidRouter);
const userRouter = require('./routes/Users');
app.use("/auth", userRouter);
const mailRouter = require('./routes/Mail');
app.use("/mail", mailRouter);
const categoryRouter = require('./routes/Categories');
app.use("/categories", categoryRouter);
const historyRouter = require('./routes/History');
app.use("/history", historyRouter);
const photographyRouter = require('./routes/Photos');
app.use("/photos", photographyRouter);
app.use('/images/', express.static('images'));

// listen on port 33123 creating the tables in models in the process
db.sequelize.sync({ force: false, alter:true}).then(()=>{
    console.log("Encrypted server up and running\nConnected to database");

    // create the admin, if they do not already exist
    const password="1234";
    bcrypt.hash(password, 10).then((hash)=>{
        User.create({
            username: "admin",
            password: hash,
            name: "admin",
            admin: true,
            approved: true,
        }).catch(err => {
            console.log("Already exists");
        });
    });

    // Creating the basic "parent" category of the app
    Category.findOrCreate({ where: { name: "All Categories" } }).then(([parentCat]) => {
        
        // Seed some sample categories
        Category.findOrCreate({ where: { name: "Electronics", CategoryId: parentCat.id } }).then(([elecCat]) => {
            Category.findOrCreate({ where: { name: "Fashion", CategoryId: parentCat.id } }).then(([fashCat]) => {

                // Create a sample seller
                bcrypt.hash("1234", 10).then((sellerHash) => {
                    User.findOrCreate({
                        where: { username: "seller" },
                        defaults: {
                            password: sellerHash,
                            name: "Sample",
                            surname: "Seller",
                            email: "seller@test.com",
                            telephone: "1234567890",
                            location: "Athens",
                            country: "Greece",
                            taxnumber: 123456789,
                            approved: true,
                            admin: false
                        }
                    }).then(([sellerUser, created]) => {
                        Item.count().then(count => {
                            if (count === 0) {
                                // Seed some items
                                const now = new Date();
                                const ends = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week later
                                
                                Item.create({
                                    name: "iPhone 13 Pro",
                                    description: "Excellent condition, 256GB.",
                                    buy_price: 600,
                                    first_bid: 300,
                                    currently: 300,
                                    location: "Athens",
                                    country: "Greece",
                                    started: now,
                                    ends: ends,
                                    state: "AVAILABLE",
                                    UserId: sellerUser.id,
                                    furthermostCategoryId: elecCat.id,
                                    number_of_bids: 0
                                }).catch(err => console.error("Error creating iPhone seed:", err));

                                Item.create({
                                    name: "Vintage Leather Jacket",
                                    description: "Real leather, medium size. Very lightly worn.",
                                    buy_price: 150,
                                    first_bid: 50,
                                    currently: 50,
                                    location: "Athens",
                                    country: "Greece",
                                    started: now,
                                    ends: ends,
                                    state: "AVAILABLE",
                                    UserId: sellerUser.id,
                                    furthermostCategoryId: fashCat.id,
                                    number_of_bids: 0
                                }).catch(err => console.error("Error creating Leather Jacket seed:", err));
                            }
                        });
                    });
                });
            });
        });

    }).catch(err => {
        console.log("Already set up");
    });

    app.listen(33123, ()=>{
        console.log("Listening on port: 33123");
    });
});
