module.exports = function requireAuth(usertypes) {
  // default to all user types to require any auth level if not specified
  usertypes = usertypes || ['User', 'Account Admin', 'Site Admin'];

  return function(req, res, next) {    
    if( req.user && usertypes.indexOf(req.user.usertype) > -1 ) {
      next();
    } else {
      res.send('not authorized');
    }
  }
}
