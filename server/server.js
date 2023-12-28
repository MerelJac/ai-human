import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 36000,
  postUrl: 'https://jsonplaceholder.typicode.com/posts'
};

const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',  
    state: 'standard_oauth',
    prompt: 'consent',
  });

  const getTokenParams = (code) => queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
  });  

  const app = express();

  app.use(cors({
    origin: [
      config.clientUrl,
    ],
    credentials: true,
  }));
  
  // Parse Cookie
  app.use(cookieParser());
  
  // Verify auth
  const auth = (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      jwt.verify(token, config.tokenSecret);
      return next();
    } catch (err) {
      console.error('Error: ', err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };  

  app.get('/auth/url', (_, res) => {
    res.json({
      url: `${config.authUrl}?${authParams}`,
    });
  });  

  app.get('/auth/token', async (req, res) => {
    const { code } = req.query;
    if (!code) return res. status(400).json({ message: 'Authorization code must be provided' });
    try {
      // Get all parameters needed to hit authorization server
      const tokenParam = getTokenParams(code);
      // Exchange authorization code for access token (id token is returned here too)
      const { data: { id_token} } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
      if (!id_token) return res.status(400).json({ message: 'Auth error' });
      // Get user info from id token
      const { email, name, picture } = jwt.decode(id_token);
      const user = { name, email, picture };
      // Sign a new token
      const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration });
      // Set cookies for user
      res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true,  })
      // You can choose to store user in a DB instead
      res.json({
        user,
      })
    } catch (err) {
      console.error('Error: ', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  });