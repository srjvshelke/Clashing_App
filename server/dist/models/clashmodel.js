import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
const Clashmodel = new mongoose.Schema({
    // Auto-incrementing integer field (similar to Prisma's id)
    id: { type: Number },
    // A field to represent the relation to the User model.
    // Depending on your system you can either store a number (if your User model uses an auto-increment number)
    // or an ObjectId. Here we keep it as a number for consistency with the Prisma model.
    user_id: { type: Number, required: true },
    // Alternatively, you could choose to store it as an ObjectId:
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    image: { type: String, required: true },
    // Use JavaScript’s Date.now for default time creation.
    created_at: { type: Date, default: Date.now },
    expire_at: { type: Date, required: true },
    // Arrays for ClashItem and ClashComments.
    // You can define more structured sub-schemas here if needed.
    ClashItem: [{ type: mongoose.Schema.Types.Mixed }],
    ClashComments: [{ type: mongoose.Schema.Types.Mixed }],
});
Clashmodel.index({ expire_at: 1, title: 1 });
Clashmodel.plugin(autoIncrement.plugin, {
    model: "Clash",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});
// export const Clashmodel = mongoose.models.Clash || mongoose.model("Clash", clashmodel);
