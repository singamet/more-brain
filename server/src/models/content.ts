import mongoose from "mongoose";
const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    shareLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
contentSchema.pre("save", function (next) {
  if (this.shareLink === "") {
    this.shareLink = undefined;
  }
  next();
});
export const Content = mongoose.model("Content", contentSchema);
