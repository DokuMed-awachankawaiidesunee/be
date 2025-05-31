require('dotenv').config();
require('./routes/oauth.routes');

const otpRoutes = require("./otp.routes");

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',     
    'http://localhost:8081',     
    'exp://192.168.2.88:8081'  
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'cats', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Route middleware
app.use('/otp', otpRoutes);
app.use('/auth', authRoutes);

// Authentication middleware
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('Authentication failed');
});

app.get('/protected', isLoggedIn, (req, res) => {
  res.send('This is a protected route');
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.use('/api', routes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
