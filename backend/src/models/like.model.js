import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    pollId: {
        type: Schema.Types.ObjectId,
        ref: "Poll",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Ensure a user can only like a poll once
likeSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const LikeModel = mongoose.model("Like", likeSchema);
export default LikeModel;
