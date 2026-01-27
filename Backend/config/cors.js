import cors from "cors";

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://medicare-app-ye9i.onrender.com",
    "https://medicare-app-admin.onrender.com"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(o => origin.startsWith(o));

        if (isAllowed) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "token", "dtoken", "atoken", "Authorization"],
    credentials: true,
};

export default corsOptions;
