import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shareLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastSignedOut: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", function (next) {
  if (this.shareLink === "") {
    this.shareLink = null;
  }
  next();
});
export const User = mongoose.model("User", userSchema);
