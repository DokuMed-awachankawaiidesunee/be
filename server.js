require('dotenv').config();
require('./routes/oauth');

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');

const app = express();

app.use(express.json());

app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/otp', otpRoutes); 

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

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

app.get('/auth/google', (req, res) => {
  res.send('Login with Google');
});

app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
