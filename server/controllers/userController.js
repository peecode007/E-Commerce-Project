import User from '../models/userModel.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User profile not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile', 
      error 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { name, phone, address },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile', 
      error 
    });
  }
};
