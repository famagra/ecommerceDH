var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const logsMiddleware = require("./middleware/logsMiddleware");
const session = require("express-session");
const recordameMiddleware = require("./middleware/recordameMiddleware");

var indexRouter = require("./routes/index");
var productsRouter = require("./routes/product");
var usersRouter = require("./routes/users");
var apiProductRouter = require("./routes/api/product");
var apiCategoriaRouter = require("./routes/api/categoria");
var apiMaraRouter = require("./routes/api/marca");
var apiUserRouter = require("./routes/api/users");
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session({ secret: "LFG", resave: true, saveUninitialized: true }));
//app.use(logsMiddleware);
app.use(recordameMiddleware);

app.use("/", indexRouter);
app.use("/product", productsRouter);
app.use("/user/", usersRouter);
app.use("/api/product", apiProductRouter);
app.use("/api/categoria", apiCategoriaRouter);
app.use("/api/marca", apiMaraRouter);
app.use("/api/user", apiUserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
