/**
 * Module Dependencies.
 */

var Model = require('../asteroid').Model
  , asteroid = require('../asteroid')
  , crypto = require('crypto');

/**
 * Default Session properties.
 */

var properties = {
  id: {type: String, required: true},
  uid: {type: String},
  ttl: {type: Number, ttl: true}
};

/**
 * Extends from the built in `asteroid.Model` type.
 */

var Session = module.exports = Model.extend('session', properties);

/**
 * Create a cryptographically random session id.
 * 
 * @param {Function} callback
 */

Session.createSessionId = function (fn) {
  crypto.randomBytes(this.settings.sessionIdLength || 64, function(err, buf) {
    if(err) {
      fn(err);
    } else {
      fn(null, buf.toString('base64'));
    }
  });
}

/*!
 * Hook to create session id.
 */

Session.beforeCreate = function (next, data) {
  data = data || {};
  
  Session.createSessionId(function (err, id) {
    if(err) {
      next(err);
    } else {
      data.id = id;
      next();
    }
  });
}