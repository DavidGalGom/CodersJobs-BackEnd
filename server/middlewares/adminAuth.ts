const adminAuth = async (req, res, next) => {
  const admin = req.isAdmin;
  if (admin) {
    next();
  } else {
    const error: { code: number; message: string } = {
      code: 403,
      message: "You are not allowed",
    };

    next(error);
  }
};

export default adminAuth;
