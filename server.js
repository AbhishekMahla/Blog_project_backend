require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/post/posts");

const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalHandler");
const app = express();

require("./config/dbConnect");

// middleware
app.use(express.json()); //Pass Incoming Data
// session config
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
  })
);

// UserRoute middleware
// ---------------------
app.use("/api/v1/users", userRoutes);

// postRoute middleware
// ---------------------
app.use("/api/v1/posts", postRoutes);

// commentRoute middleware
// ---------------------
app.use("/api/v1/comments", commentRoutes);

// Error handler middlewares
app.use(globalErrHandler);
// listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running  ${PORT}`));
