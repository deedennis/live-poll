import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaEye, FaUser, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { likePollService, unlikePollService } from "../../services/likeService";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import Card from "../Card/Card";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import useUserStore from "../../store/useStore";

function PollCard({ poll }) {
  const navigator = useNavigate();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(poll.likedBy?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(poll.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleViewOnClick = () => {
    navigator(`/view/${poll._id}`);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to like polls");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    try {
      if (isLiked) {
        await unlikePollService(poll._id);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        toast.success("Removed from likes");
      } else {
        await likePollService(poll._id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success("Added to likes");
      }
      // Invalidate polls queries to refetch updated data
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['poll']);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPollStatus = () => {
    const now = new Date();
    const createdAt = new Date(poll.createdAt);
    const daysDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return { label: "New", variant: "success" };
    if (daysDiff <= 7) return { label: "Trending", variant: "warning" };
    return { label: "Popular", variant: "info" };
  };

  const status = getPollStatus();

  return (
    <Card 
      className="group hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={handleViewOnClick}
    >
      <div className="relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>

        {/* Poll Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-white group-hover:text-gradient-primary transition-colors duration-300 line-clamp-2">
            {poll.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {poll.description}
          </p>

          {/* Poll Options Preview */}
          <div className="space-y-2">
            {poll.options?.slice(0, 2).map((option, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="truncate">{option.text}</span>
              </div>
            ))}
            {poll.options?.length > 2 && (
              <div className="text-xs text-gray-500">
                +{poll.options.length - 2} more options
              </div>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <FaEye className="w-3 h-3" />
                <span>{poll.totalVotes || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendarAlt className="w-3 h-3" />
                <span>{formatDate(poll.createdAt)}</span>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FaUser className="w-3 h-3" />
              <span className="truncate max-w-20">{poll.creatorData?.username}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaHeart className={`w-4 h-4 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>

            {/* View Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOnClick();
              }}
              className="flex items-center space-x-2"
            >
              <span>View Poll</span>
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PollCard;