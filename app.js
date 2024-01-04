if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.CLOUDINARY_SECRET);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongo")(session);

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const dbUrl = process.env.DB_URL;
// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp";
// Connecting to 'yelp-camp' database
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connection successfull...");
    })
    .catch((err) => {
        console.log("Some error occurred while connecting....");
    });

////// MONGO DB STORE //////
const store = new MongoDBStore({
    url: dbUrl,
    secret: "thisispretendingtobeasecret",
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    secret: "thisispretendingtobeasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: (7 * 24 * 60 * 60 * 1000)
    }
}

app.use(session(sessionConfig));

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// Setting view engine as "ejs"
app.set('view engine', 'ejs');
// To parse the incoming requests in urlencoded format
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set the static directory
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// Flash middleware
app.use(flash());


// Configurations for setting-up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting locals for flash messages
// This needs to be after setting-up all passport configurations
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

////////// All User Authentication Routes /////
app.use("/", userRoutes);

//////////// All Campground Routes ////////////
app.use("/campgrounds", campgroundRoutes);

//////////// All Reviews Routes ////////////
app.use("/campgrounds/:id/reviews", reviewsRoutes);

///// HOME ////
app.get("/", (req, res) => {
    res.render("home");
})

// For routes which are not defined
app.all("*", (req, res) => {
    throw new ExpressError("ERROR: Page not found!", 404);
})

app.use((err, req, res, next) => {
    const { status = 500, message = "ERROR: Something went wrong!" } = err;
    // res.status(status).send(message);
    res.status(status).render("error", { err });
})

app.listen(3000, () => {
    console.log(`YelpCamp v9.0 server listening on port 3000...`);
});