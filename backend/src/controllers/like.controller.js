import { createLikeService, removeLikeService, getUserLikesService, getPollLikesService } from "../services/like.service.js";

export const createLikeController = async (req, res) => {
    try {
        const { pollId } = req.params;
        const userId = req.user._id;

        const result = await createLikeService(pollId, userId);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        // Emit socket event for real-time updates
        if (req.io) {
            req.io.to(pollId).emit("like", { pollId });
        }

        res.status(201).json({
            success: true,
            message: "Poll liked successfully",
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const removeLikeController = async (req, res) => {
    try {
        const { pollId } = req.params;
        const userId = req.user._id;

        const result = await removeLikeService(pollId, userId);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        // Emit socket event for real-time updates
        if (req.io) {
            req.io.to(pollId).emit("like", { pollId });
        }

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserLikesController = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await getUserLikesService(userId);
        
        res.status(200).json({
            success: true,
            message: "User likes fetched successfully",
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getPollLikesController = async (req, res) => {
    try {
        const { pollId } = req.params;

        const result = await getPollLikesService(pollId);
        
        res.status(200).json({
            success: true,
            message: "Poll likes fetched successfully",
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
