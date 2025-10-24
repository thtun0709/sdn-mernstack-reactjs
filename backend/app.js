const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");


dotenv.config();

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};
connectDB();

const app = express();

// const path = require("path"); //up imgae lên
// app.use(express.static(path.join(__dirname, "public")));

// Middleware cơ bản
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// EJS setup (giữ cho các trang admin cũ nếu cần)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);



// Route cơ bản
// const expressLayouts = require('express-ejs-layouts');
// app.use(expressLayouts);

const { sessionData } = require("./middlewares/sessionMiddleware");
const { isLoggedIn } = require("./middlewares/authMiddleware");
app.use(sessionData);   
app.use(isLoggedIn);

const authRoutes = require("./router/authRouter");
app.use("/", authRoutes);

const perfumeRouter = require('./router/perfumeRouter');
app.use('/perfumes', perfumeRouter);

const brandRouter = require('./router/brandRouter');
app.use('/brands', brandRouter);


// Bỏ render trang chủ EJS để ưu tiên React build phục vụ FE


//route cho user
const userRouter = require("./router/userRouter");
app.use("/users", userRouter);

// Comment routes 
const commentRouter = require("./router/commentRouter");
app.use("/comments", commentRouter);

// JSON API (JWT)
const apiRouter = require('./router/apiRouter');
app.use('/api', apiRouter);

// Serve React build (frontend)
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Catch-all: return React index.html for non-API routes
// ✅ Express 5 compatible catch-all
app.get(/^(?!\/(api|uploads|comments|users|perfumes|brands)).*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });


