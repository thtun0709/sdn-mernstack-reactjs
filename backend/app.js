const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("📄 .env loaded ->", process.env);

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


dotenv.config();
console.log("📄 Loaded .env from:", path.resolve(".env"));
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
console.log("🔐 SESSION_SECRET:", process.env.SESSION_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

/* ------------------ KHỞI TẠO APP TRƯỚC TIÊN ------------------ */
const app = express();

/* ------------------ KẾT NỐI MONGODB ------------------ */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "perfume-app", // bắt buộc cho localhost
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected:", process.env.MONGO_URI);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB();

/* ------------------ CORS ------------------ */
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


/* ------------------ MIDDLEWARE CƠ BẢN ------------------ */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* ------------------ VIEW ENGINE (EJS) ------------------ */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
console.log("🔐 SESSION_SECRET:", process.env.SESSION_SECRET ? "Loaded ✅" : "❌ Missing");

/* ------------------ SESSION ------------------ */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "perfume-app",
      collectionName: "sessions",
      ttl: 1000 * 60 * 60 * 24 * 7, // 7 ngày
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày
      sameSite: 'lax', // Thêm sameSite để tránh vấn đề CORS
    },
  })
);

/* ------------------ IMPORT MIDDLEWARES ------------------ */
const { sessionData } = require("./middlewares/sessionMiddleware");
const { isLoggedIn } = require("./middlewares/authMiddleware");
app.use(sessionData);
app.use(isLoggedIn);

/* ------------------ ROUTES ------------------ */
app.use("/api/auth", require("./router/authRouter"));
app.use("/api/users", require("./router/userRouter"));
app.use("/api/perfumes", require("./router/perfumeRouter"));
app.use("/api/brands", require("./router/brandRouter"));
app.use("/api/comments", require("./router/commentRouter"));
app.use("/api", require("./router/apiRouter"));

/* ------------------ REACT FRONTEND ------------------ */
// Tạm thời comment để tránh lỗi build folder không tồn tại
// const frontendBuildPath = path.join(__dirname, "../frontend/build");
// app.use(express.static(frontendBuildPath));

// React Router catch-all (Express 5 syntax)
// app.get(/^(?!\/(api|uploads|comments|users|perfumes|brands)).*/, (req, res) => {
//   res.sendFile(path.join(frontendBuildPath, "index.html"));
// });

/* ------------------ CACHE CONTROL ------------------ */
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
