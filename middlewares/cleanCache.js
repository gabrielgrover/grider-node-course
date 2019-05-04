const { clearCache } = require("../services/cache");

module.exports = async (req, _res, next) => {
  await next();

  clearCache(req.user.id);
};