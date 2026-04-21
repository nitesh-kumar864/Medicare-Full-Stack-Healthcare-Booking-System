import cors from "cors";

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://medicare-booking-platform.vercel.app",
    "https://medicare-admin-beta.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin);

        if (isAllowed) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "token", "dtoken", "atoken", "Authorization"],
    credentials: true,
};

export default corsOptions;
