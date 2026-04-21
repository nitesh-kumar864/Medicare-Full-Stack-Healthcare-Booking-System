import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (res, id, role) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    const token = jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return token;
};

export default generateTokenAndSetCookies;
