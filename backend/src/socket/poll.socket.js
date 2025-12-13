import { getPollDataService } from "../services/poll.service.js";

export const handlePollSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a poll room
    const handleJoinPoll = (pollId) => {
      if (!pollId) {
        socket.emit("error", { message: "Poll ID is required to join a poll room" });
        return;
      }

      socket.join(pollId);
      console.log(`User ${socket.id} joined poll room: ${pollId}`);
    };

    // Handle user voting in a poll
    const handleVote = async (data) => {
      if (!data.pollId || !data.success) {
        socket.emit("error", { message: "Invalid vote data" });
        return;
      }

      console.log("Vote received:", data);

      try {
        const pollData = await getPollDataService(data.pollId);
        // Broadcast to all users in the poll room
        io.to(data.pollId).emit("pollDataUpdated", { data: pollData });
        console.log("Poll data updated and broadcasted:", pollData);
      } catch (error) {
        console.error("Error fetching poll data:", error);
        socket.emit("error", { message: "Failed to fetch poll data" });
      }
    };

    // Handle like updates
    const handleLike = async (data) => {
      if (!data.pollId) {
        socket.emit("error", { message: "Poll ID is required for like updates" });
        return;
      }

      try {
        const pollData = await getPollDataService(data.pollId);
        io.to(data.pollId).emit("pollDataUpdated", { data: pollData });
        console.log("Like update broadcasted for poll:", data.pollId);
      } catch (error) {
        console.error("Error fetching poll data for like update:", error);
        socket.emit("error", { message: "Failed to fetch poll data for like update" });
      }
    };

    // Handle user disconnection
    const handleDisconnect = () => {
      console.log(`User disconnected: ${socket.id}`);
    };

    // Event listeners
    socket.on("joinPoll", handleJoinPoll);
    socket.on("vote", handleVote);
    socket.on("like", handleLike);
    socket.on("disconnect", handleDisconnect);
  });
};
