import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isPreset: {
      type: Boolean,
      default: false,
    },
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
categorySchema.pre("save", function (next) {
  if (this.shareLink === "") {
    this.shareLink = null;
  }
  next();
});
export const Category = mongoose.model("Category", categorySchema);
