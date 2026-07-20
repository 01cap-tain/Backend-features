function authentication(req, res, next) {
  if (req.session && req.session.user && req.session.user.username) {
    return next();
  }

  console.log(" Authentication failed - no valid session");
  return res.status(401).json({
    authenticated: false,
    message: "Authentication required. Please log in.",
  });
}

export default authentication;
