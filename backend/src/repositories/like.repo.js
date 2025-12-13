import LikeModel from "../models/like.model.js";
import PollModel from "../models/poll.model.js";

export const createLikeRepo = async (pollId, userId) => {
    try {
        // Check if user already liked this poll
        const existingLike = await LikeModel.findOne({ pollId, userId });
        if (existingLike) {
            return { success: false, message: "Already liked this poll" };
        }

        // Create new like
        const like = await LikeModel.create({ pollId, userId });
        
        // Update poll likes count and likedBy array
        await PollModel.findByIdAndUpdate(pollId, {
            $inc: { likesCount: 1 },
            $addToSet: { likedBy: userId }
        });

        return { success: true, data: like };
    } catch (error) {
        throw error;
    }
};

export const removeLikeRepo = async (pollId, userId) => {
    try {
        // Check if user has liked this poll
        const existingLike = await LikeModel.findOne({ pollId, userId });
        if (!existingLike) {
            return { success: false, message: "Poll not liked yet" };
        }

        // Remove like
        await LikeModel.findOneAndDelete({ pollId, userId });
        
        // Update poll likes count and likedBy array
        await PollModel.findByIdAndUpdate(pollId, {
            $inc: { likesCount: -1 },
            $pull: { likedBy: userId }
        });

        return { success: true, message: "Like removed successfully" };
    } catch (error) {
        throw error;
    }
};

export const getUserLikesRepo = async (userId) => {
    try {
        const likes = await LikeModel.find({ userId }).populate('pollId');
        return { success: true, data: likes };
    } catch (error) {
        throw error;
    }
};

export const getPollLikesRepo = async (pollId) => {
    try {
        const likes = await LikeModel.find({ pollId }).populate('userId', 'username email');
        return { success: true, data: likes };
    } catch (error) {
        throw error;
    }
};
