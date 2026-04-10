// middleware/githubAuth.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

const githubOAuth = {
  // Redirect user to GitHub for authorization
  login: (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URI)}&scope=user:email`;
    
    res.redirect(githubAuthUrl);
  },

  // Handle callback from GitHub
  callback: async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code not provided' 
      });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.CALLBACK_URI
        },
        {
          headers: {
            Accept: 'application/json'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to obtain access token from GitHub' 
        });
      }

      // Get user information from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });

      const githubUser = userResponse.data;

      // Generate JWT token (you can later link this to your User model)
      const token = jwt.sign(
        { 
          id: githubUser.id,
          name: githubUser.name || githubUser.login,
          email: githubUser.email,
          githubLogin: githubUser.login
        },
        process.env.JWT_SECRET || process.env.SESSION_SECRET,
        { expiresIn: '7d' }
      );

      // For video/demo: you can redirect to frontend or just return JSON
      res.json({
        success: true,
        message: 'GitHub OAuth successful',
        token,
        user: {
          id: githubUser.id,
          name: githubUser.name || githubUser.login,
          email: githubUser.email,
          avatar: githubUser.avatar_url
        }
      });

    } catch (error) {
      console.error('GitHub OAuth Error:', error.response?.data || error.message);
      res.status(500).json({ 
        success: false, 
        message: 'GitHub authentication failed', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  }
};

module.exports = githubOAuth;