const mongoose = require('mongoose');
import autoIncrement from "mongoose-auto-increment";
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
Clashmodel.plugin(autoIncrement.plugin, {
    model: "ClashItem",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});
export const clash = mongoose.models.ClashItem || mongoose.model("ClashItem", clashItemSchema);
