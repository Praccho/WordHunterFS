import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  gamesPlayed: { type: Number, default: 0 },
  highscore: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

export default User;