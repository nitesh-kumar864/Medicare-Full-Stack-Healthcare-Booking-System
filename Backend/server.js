import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from './config/mongodb.js';

import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import bedRoutes from "./routes/bedRoutes.js";
import paymentRoute from "./routes/paymentRoute.js";
import supportRoute from "./routes/supportRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// DB
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://medicare-pr8s.onrender.com",    
  "https://medicare-admin-a2zd.onrender.com"    
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
      const isAllowed = allowedOrigins.some(o => origin.startsWith(o));

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
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
