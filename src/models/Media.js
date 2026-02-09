const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true },
    url: { type: String, required: true, trim: true },
    thumbnail: { type: String, trim: true },
    mimeType: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, default: Date.now },
    filename: { type: String, required: true, trim: true },
    filePath: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
