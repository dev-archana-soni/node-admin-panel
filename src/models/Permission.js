const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
