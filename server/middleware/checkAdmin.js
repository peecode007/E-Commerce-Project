import User from "../models/userModel.js";

export const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        
    }
}