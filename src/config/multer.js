const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, raw) => {
        if (err) return cb(err);

        cb(null, raw.toString('hex') + path.extname(file.originalname));
      });
    },
  }),
  fileFilter: function (req, file, callback) {
    if (file.mimetype.indexOf('image/') < 0) {
      return callback(new Error('Only images are allowed'));
    }

    callback(null, true);
  },
};
