var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv").config();
// ----------
const passport = require("passport");
require("./passport.js");
// ----------
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
// ----------
const PORT = process.env.PORT || 8000;
// ----------

var app = express();
//? REQUEST BODY AS json...
app.use(express.json());
// ----------

const session = require("express-session");
app.use(
  session({
    secret: `${process.env.cookieKey}`,
    resave: true,
    saveUninitialized: true,
  })
);
// ----------
//? PASSPORT INITIALIZATION...
app.use(passport.initialize());
app.use(passport.session());
// ----------
//? MIDDLEWARE...
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// ----------
app.get("/", async (req, res) => {
  res.status(200).send("Welcome to MERN Authentication🤷‍♂️");
});
//? ROUTES ...
app.use("/users", usersRouter);
app.use("/auth", authRouter);
// ----------
//? SERVER LISTENING PORT ...
app.listen(PORT, () => console.log(`listening on port-${PORT}`));
// ----------
