import { mongoose } from "../lib/db.js";
const { Schema } = mongoose;
const clashItemSchema = new Schema({
    id: { type: Number },
    clash: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clash', // Reference to Clash model
        required: true
    },
    image: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
// clashItemSchema.plugin(autoIncrement.plugin, {
//   model: "ClashItem",
//   field: "id",
//   startAt: 1,
//   incrementBy: 1,
// });
export const clash = mongoose.models.ClashItem || mongoose.model("ClashItem", clashItemSchema);
