const multer = require('multer');
const path = require('path');
const fs = require('fs');


const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || req.body.type || 'others';

    const baseUploadDir = path.join(__dirname, '../../public/uploads');
    const finalUploadDir = path.join(baseUploadDir, type);

    ensureDirExists(finalUploadDir); // Make sure the directory exists
    cb(null, finalUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: limit file size to 5MB
  fileFilter: (req, file, cb) => {
    //
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

module.exports = upload;
