const jwt = require("jsonwebtoken");
const { User } = require("../models");

const checkToken = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Token is not supplied",
    });
  }

  const bearer = authorizationHeader.split(" ");
  const bearerToken = bearer[1];

  try {
    const decodedToken = jwt.verify(bearerToken, "shhhhh");
    const findUser = await User.findOne({ email: decodedToken.email });

    if (!findUser) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Unauthorized",
      });
    }

    if (decodedToken.logout !== findUser.logout) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Token has been expired, please login again",
      });
    }

    req.user = findUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid token",
    });
  }
};

const checkRole =
  (...roles) =>
  (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return res
        .status(400)
        .json({ message: `you are not authorized to access this api` });
    }
    return next();
  };

module.exports = {
  checkToken,
  checkRole,
};
