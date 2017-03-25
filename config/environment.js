/* jshint node: true */
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'doodlewithmates',
    podModulePrefix: 'doodlewithmates/features',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.APP.SERVER = 'http://localhost:8080';
    ENV.APP.FACEBOOK_REDIRECT = 'http://localhost:4300/';
    ENV.APP.FACEBOOK_APP_ID = '742896385870748';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.FACEBOOK_REDIRECT = 'https://doodlewithmates.xyz';
  }

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:custom',
    routeAfterAuthentication: '/'
  };

  ENV['ember-cli-mirage'] = {
    enabled: false
  };


  ENV.torii = {
    providers: {
      'facebook-oauth2': {
        apiKey: ENV.APP.FACEBOOK_APP_ID,
        redirectUri: ENV.APP.FACEBOOK_REDIRECT
      }
    }
  };


  return ENV;
};
