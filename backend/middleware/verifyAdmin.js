import dotenv from "dotenv";
dotenv.config();

const verifyAdmin = (req, res, next) => {
  if (process.env.DEV_MODE === "true") {
    return next();
  }

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "Unauthorized: missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized: bad Authorization format" });
  }

  const token = parts[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }

  next();
};

export default verifyAdmin;
