import { createLikeRepo, removeLikeRepo, getUserLikesRepo, getPollLikesRepo } from "../repositories/like.repo.js";

export const createLikeService = async (pollId, userId) => {
    try {
        const result = await createLikeRepo(pollId, userId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const removeLikeService = async (pollId, userId) => {
    try {
        const result = await removeLikeRepo(pollId, userId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getUserLikesService = async (userId) => {
    try {
        const result = await getUserLikesRepo(userId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getPollLikesService = async (pollId) => {
    try {
        const result = await getPollLikesRepo(pollId);
        return result;
    } catch (error) {
        throw error;
    }
};
