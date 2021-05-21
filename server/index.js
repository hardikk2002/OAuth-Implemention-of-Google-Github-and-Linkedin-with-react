const express = require("express");
const cors = require('cors');
const session = require('express-session');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const keys = require("./config/keys");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));


app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
        }
    }))


app.use(passport.initialize());
app.use(passport.session());


// To make cookies ----------------------------------
passport.serializeUser((user, done) => {
    //for each user put in session we have to serialize it
    return done(null, user);
})
passport.deserializeUser((user, done) => {
    return done(null, user);
})



// Google ----------------------------------------------
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });

        console.log(profile);
        cb(null, profile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirected to home.
        res.redirect('http://localhost:3000/home');
    });




// Github ----------------------------------------------
passport.use(new GitHubStrategy({
    clientID: keys.githubClientID,
    clientSecret: keys.githubClientSecret,
    callbackURL: "http://localhost:5000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        console.log(profile);
        done(null, profile);
    }
));
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirected to home.
        res.redirect('http://localhost:3000/home');
    });



// Linkedin -----------------------------------
passport.use(new LinkedInStrategy({
    clientID: keys.linkedinClientID,
    clientSecret: keys.linkedinClientSecret,
    callbackURL: "http://localhost:5000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],

}, function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        console.log(profile);
        return done(null, profile);
    });
}));

app.get('/auth/linkedin',
    passport.authenticate('linkedin'));


app.get('/auth/linkedin/callback', (req, res, next) => {
    passport.authenticate('linkedin', (err, user, info) => {
        if (err) {
            // failureRedirect

            return res.redirect('http://localhost:3000/');
        }

        if (!user) {
            // failureRedirect
            return res.redirect('http://localhost:3000/');
        }

        // Note: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js#L52
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            // successRedirect
            res.redirect('http://localhost:3000/home');
        });
    })(req, res, next);
}
);



app.get("/", (req, res) => {
    res.send("I am from server");
})

app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
})

