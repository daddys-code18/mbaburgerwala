import ErrorHandler from "../utlis/ErrorHandler.js";
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies["connect.sid"];
  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }
  next();
};
// For excess route only for admin
export const authorizedAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler(" Only Admin Allowed", 405));
  }
  next();
};
