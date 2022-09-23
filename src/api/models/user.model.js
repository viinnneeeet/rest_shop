const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    education: { type: String, default: '' },
    work: { type: String, default: '' },
    availableFor: { type: String, default: '' },
    skills: { type: String, default: '' },
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    refreshToken: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('User', UserSchema);
