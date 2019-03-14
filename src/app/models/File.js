const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
});

FileSchema.virtual('url')
  .get(function () {
    return `${process.env.APP_URL}/files/${this.id}`;
  });

module.exports = mongoose.model('File', FileSchema);
