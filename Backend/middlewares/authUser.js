import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||                 
      req.headers.token ||                 
      req.headers.authorization?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error) {
    console.log("Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default authUser;
