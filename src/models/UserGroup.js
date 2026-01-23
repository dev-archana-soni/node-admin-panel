const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    logo: { type: String, trim: true }, // Logo image path
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;
