import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import https from "http";
import connectCloudinary from './config/cloudinary.js'

import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import bedRoutes from "./routes/bedRoutes.js";
import paymentRoute from "./routes/paymentRoute.js";
import supportRoute from "./routes/supportRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

import { initSocket } from "./socket/index.js";


const app = express();
const port = process.env.PORT || 4000;

// DB
connectDB();
connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://medicare-booking-platform.vercel.app",
  "https://medicare-admin-beta.vercel.app"
];


app.use((req, res, next) => {
  next();
});

//  CORS middleware: 
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests
      if (!origin) return callback(null, true);

      // Accept if origin startsWith any allowed origin
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "dtoken", "atoken"],
  })
);

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use("/api/payment", paymentRoute);
app.use("/api/support", supportRoute);
app.use("/api/bed", bedRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", prescriptionRoutes);
app.use("/api/public", publicRoutes);


// test route
app.get('/', (req, res) => {
  res.send('API Working');
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});


// start
// app.listen(port, () => {
//   console.log(`Server Started on port ${port}`);
// });

const server = https.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`server and socket running on port ${port}`);
});