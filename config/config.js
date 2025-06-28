const env = require("./env");

module.exports = {
  app: {
    port: env.port,
    nodeEnv: env.nodeEnv,
  },

  database: {
    uri: env.dbUri,
  },

  jwtConf: {
    secret: env.jwtSecret,
    refreshSecret: env.jwtRefreshSecret,
    expiresIn: env.jwtExpiresIn,
  },

  security: {
    passwordSaltRounds: env.passwordSaltRounds,
    resetPasswordExpiration: env.resetPasswordExpiration,
  },

  corsConf: {
    origin: env.corsOrigin,
  },

  logging: {
    level: env.logLevel,
  },

  cloudinaryConf: {
    cloudName: env.cloudName,
    apiKey: env.cloudinaryApikey,
    apiSecret: env.cloudinaryApiSecret,
  },

  partnerApi: {
    url: env.partnerApi.url,
    login: env.partnerApi.login,
    password: env.partnerApi.password,
  },
};
