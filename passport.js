const { ObjectId } = require("mongodb");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GithubStrategy = require("passport-github2");
const { connectDB, closeConnection } = require("./config");
// -----------------
passport.serializeUser(function (user, done) {
  done(null, user);
});
// -----------------
passport.deserializeUser(function (user, done) {
  done(null, user);
});
// -----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("callback fired");
      // console.log(profile);

      const db = await connectDB();

      db.collection("USER_REGISTRATION")
        .findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            // console.log("Current User :", currentUser);
            done(null, currentUser); //? call done with no error and the user object
          } else {
            db.collection("USER_REGISTRATION")
              .insertOne({
                name: profile.displayName,
                googleId: profile.id,
                thumbnail: profile.photos[0].value,
              })
              .then((newUser) => {
                // console.log("New user created : ", newUser);
                const user = {
                  name: profile.displayName,
                  thumbnail: profile.photos[0].value,
                };
                done(null, user); //? call done with no error and the user object
              })
              .catch((error) => {
                done(error, false); //? call done with an error and false as the user object
              });
          }
        })
        .catch((error) => {
          done(error, false); //? call done with an error and false as the user object
        });
    }
  )
);
// -----------------
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (profile, done) => {
      // console.log("callback fired");
      // console.log(profile);

      const db = await connectDB();

      db.collection("USER_REGISTRATION")
        .findOne({ githubId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            // console.log("Current User :", currentUser);
            done(null, currentUser);
          } else {
            db.collection("USER_REGISTRATION")
              .insertOne({
                name: profile.username,
                githubId: profile.id,
                thumbnail: profile.photos[0].value,
              })
              .then((newUser) => {
                // console.log("New user created : ", newUser);

                const user = {
                  name: profile.username,
                  thumbnail: profile.photos[0].value,
                };
                done(null, user);
              })
              .catch((error) => {
                done(error, false);
              });
          }
        })
        .catch((error) => {
          done(error, false);
        });
    }
  )
);
// -----------------
