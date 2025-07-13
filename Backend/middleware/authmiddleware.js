const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(400).json("Invalid Token");
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    // console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({msg:"Unathorized access"})
  }
};

module.exports=authMiddleware