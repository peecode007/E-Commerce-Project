import admin from '../config/firebase.js';
import User from '../models/userModel.js';

export async function authenticateFirebaseToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  const idToken = header.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    let user = await User.findOne({ uid: decoded.uid });
    
    if (!user) {
      user = new User({
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email?.split('@')[0] || '',
        role: 'user' 
      });
      await user.save();
      console.log('New user created in MongoDB:', user.email);
    }
    
    req.user = { 
      uid: decoded.uid, 
      email: decoded.email,
      mongoUser: user 
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
