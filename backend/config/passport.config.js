const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');

// TODO: Import your User model when database is set up
// const User = require('../models/User');

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    },
    async (payload, done) => {
      try {
        // TODO: Replace with actual database lookup
        // const user = await User.findById(payload.sub);
        // if (!user) return done(null, false);
        
        // Placeholder user data
        const user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        };
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Local Strategy (Email/Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // TODO: Replace with actual database lookup
        // const user = await User.findOne({ email });
        // if (!user) return done(null, false);
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) return done(null, false);
        
        // Placeholder authentication
        if (email === 'demo@skyber.com' && password === 'password') {
          const user = {
            id: '1',
            email: email,
            role: 'super-admin',
          };
          return done(null, user);
        }
        
        return done(null, false, { message: 'Invalid credentials' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/passport/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // TODO: Replace with actual database lookup/creation
          // let user = await User.findOne({ googleId: profile.id });
          // if (!user) {
          //   user = await User.create({
          //     googleId: profile.id,
          //     email: profile.emails[0].value,
          //     name: profile.displayName,
          //     avatar: profile.photos[0].value,
          //   });
          // }
          
          const user = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            role: 'user',
            provider: 'google',
          };
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/passport/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // TODO: Replace with actual database lookup/creation
          // let user = await User.findOne({ githubId: profile.id });
          // if (!user) {
          //   user = await User.create({
          //     githubId: profile.id,
          //     email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
          //     name: profile.displayName || profile.username,
          //     avatar: profile.photos[0].value,
          //   });
          // }
          
          const user = {
            id: profile.id.toString(),
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            name: profile.displayName || profile.username,
            role: 'user',
            provider: 'github',
          };
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // TODO: Replace with actual database lookup
    // const user = await User.findById(id);
    // done(null, user);
    
    // Placeholder
    done(null, { id, email: 'demo@skyber.com', role: 'super-admin' });
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

