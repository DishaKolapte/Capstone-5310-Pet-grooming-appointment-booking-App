const adminMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).send({
        success: false,
        message: "Admin access denied",
      });
    }
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    res.status(401).send({
      success: false,
      message: "Auth failed in admin middleware",
      error,
    });
  }
};

module.exports = adminMiddleware; 