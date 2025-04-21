import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const Clashmodel = new mongoose.Schema({
  // Auto-incrementing integer field (similar to Prisma's id)
  id: { type: Number },

  user_id: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },

  title: { type: String, required: true },
  description: { type: String, default: null },
  image: { type: String, required: true },

  created_at: { type: Date, default: Date.now },
  expire_at: { type: Date, required: true },


  ClashItem: [{ type: mongoose.Schema.Types.Mixed }],
  ClashComments: [{ type: mongoose.Schema.Types.Mixed }],
})



Clashmodel.index({ expire_at: 1, title: 1 });

Clashmodel.plugin(autoIncrement.plugin, {
  model: "Clash",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});


export const clash = mongoose.models.Clash || mongoose.model("Clash", Clashmodel);