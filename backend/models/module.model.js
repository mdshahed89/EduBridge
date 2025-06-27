import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    moduleNumber: { type: Number, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

moduleSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastModule = await mongoose.model("Module").findOne({ course: this.course })
      .sort({ moduleNumber: -1 });

    this.moduleNumber = lastModule ? lastModule.moduleNumber + 1 : 1;
  }
  next();
});

const Module = mongoose.model("Module", moduleSchema);

export default Module;
