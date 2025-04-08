import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagname: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Tag = mongoose.model("Tag", tagSchema);
