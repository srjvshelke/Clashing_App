import {mongoose,autoIncrement} from "../lib/db.js";


const clashCommentSchema = new mongoose.Schema({
  id: { type: Number },

  clash_id: { type: Number ,
    required: true
  },
   clash: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clash', // Reference to Clash model
      required: true
    },
  comment: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// clashCommentSchema.plugin(autoIncrement.plugin, {
//   model: "ClashComment",
//   field: "id",
//   startAt: 1,
//   incrementBy: 1,
// });

export const ClashComment = mongoose.models.ClashComment || mongoose.model("ClashComment", clashCommentSchema);

