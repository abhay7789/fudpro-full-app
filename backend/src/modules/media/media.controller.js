const upload = require('../../services/file.service');
const User = require('../user/user.model');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.body.type || 'users'}/${req.user.id}/${req.file.filename}`;

    // Update user image if type is users
    if ((req.body.type || 'users') === 'users') {
      await User.update({ image: filePath }, { where: { id: req.user.id } });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      path: filePath
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage
};
