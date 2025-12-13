import axiosInstance from "../helper/axiosInstance.js";

export const likePollService = async (pollId) => {
    try {
        const response = await axiosInstance.post(`/like/${pollId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const unlikePollService = async (pollId) => {
    try {
        const response = await axiosInstance.delete(`/like/${pollId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getUserLikesService = async () => {
    try {
        const response = await axiosInstance.get("/like/user");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPollLikesService = async (pollId) => {
    try {
        const response = await axiosInstance.get(`/like/poll/${pollId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
