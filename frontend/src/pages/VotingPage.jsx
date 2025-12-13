import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FaBookmark, FaHeart, FaShare, FaArrowLeft, FaUser, FaCalendarAlt, FaEye, FaChartBar, FaFire } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

import getPollData from "../services/getPollData";
import ErrorFallback from "../components/Errors/ErrorFallback";
import createVoteService from "../services/createVoteService";
import { likePollService, unlikePollService } from "../services/likeService";
import { makeChartDataObjFromPollData } from "../utils/util";
import useBookmark from "../hooks/useBookmark";
import useUserStore from "../store/useStore";
import { getPollSelectedOptionData } from "../services/getPollSelectedOptionData";

import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Badge from "../components/Badge/Badge";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function VotingPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const { handleBookmark } = useBookmark();
  const [poll, setPoll] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("https://poll-app-c1hs.onrender.com");
    // const s = io("http://localhost:3000");
    setSocket(s);
  
    s.on("connect", () => {
      console.log("Connected to the server");
      s.emit("joinPoll", pollId);
    });
  
    return () => {
      s.disconnect();
    };
  }, [pollId]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery(["poll", pollId], () => getPollData(pollId), {
    cacheTime: 10 * 60 * 1000,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    onSuccess: (data) => {
      setPoll(data);
      setIsLiked(data?.data?.pollData?.likedBy?.includes(user?._id) || false);
      setLikesCount(data?.data?.pollData?.likesCount || 0);
    },
  });

  useQuery(["selectedOption", pollId], () => getPollSelectedOptionData(pollId), {
    cacheTime: 10 * 60 * 1000,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    onSuccess: (data) => {
      setSelectedOption(data?.data?.optionId || null);
    },
  });

  useEffect(() => {
    if (socket) {
      socket.on("pollDataUpdated", (data) => {
        console.log("Received updated poll data:", data);
        setPoll(data);
        setIsLiked(data?.data?.pollData?.likedBy?.includes(user?._id) || false);
        setLikesCount(data?.data?.pollData?.likesCount || 0);
        // Refetch the query to update the UI
        refetch();
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
      });

      return () => {
        socket.off("pollDataUpdated");
        socket.off("error");
      };
    }
  }, [socket, user?._id, refetch]); 

  const mutation = useMutation(createVoteService, {
    onSuccess: (data) => {
      toast.success("Vote submitted successfully");
      // Invalidate poll queries to refetch updated data
      queryClient.invalidateQueries(['poll', pollId]);
      queryClient.invalidateQueries(['polls']);
      if (socket) {
        socket.emit("vote", { pollId, success: data?.success });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    },
  });

  const handleOptionSelect = (id) => {
    if (!selectedOption){
      setSelectedOption(id);
    }
    mutation.mutate({ pollId, optionId: id });
  };

  const handleLikeClick = async () => {
    if (!user) {
      toast.error("Please login to like polls");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    try {
      if (isLiked) {
        await unlikePollService(pollId);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        toast.success("Removed from likes");
      } else {
        await likePollService(pollId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success("Added to likes");
      }
      // Invalidate poll queries to refetch updated data
      queryClient.invalidateQueries(['poll', pollId]);
      queryClient.invalidateQueries(['polls']);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Poll link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <ErrorFallback onRetry={refetch} />
        </div>
      </div>
    );
  }

  const pollData = poll?.data?.pollData;
  const creatorData = poll?.data?.creatorData;
  const chartData = makeChartDataObjFromPollData(poll);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Poll Header */}
          <Card className="mb-8">
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {creatorData?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {creatorData?.username || "Unknown"}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{formatDate(pollData?.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaEye className="w-3 h-3" />
                        <span>{pollData?.totalVotes || 0} votes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBookmark(pollId)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-300"
                    title="Bookmark poll"
                  >
                    <FaBookmark className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={handleLikeClick}
                    disabled={isLiking}
                    className={`p-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      isLiked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-400'
                    } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Like poll"
                  >
                    <FaHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{likesCount}</span>
                  </button>
                </div>
              </div>

              {/* Poll Title and Description */}
              <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                  {pollData?.title || "Loading..."}
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {pollData?.description || "Loading..."}
                </p>
              </div>

              {/* Poll Status */}
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="success" size="md">
                  <FaFire className="w-3 h-3 mr-1" />
                  Live Poll
                </Badge>
                <Badge variant="info" size="md">
                  <FaChartBar className="w-3 h-3 mr-1" />
                  Real-time Updates
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voting Section */}
            <Card>
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {selectedOption ? "Your Vote" : "Cast Your Vote"}
                </h2>
                
                <div className="space-y-4">
                  {pollData?.options?.map((option, index) => {
                    const isSelected = selectedOption === option._id;
                    const voteCount = option.voteCount || 0;
                    const totalVotes = pollData?.totalVotes || 1;
                    const percentage = Math.round((voteCount / totalVotes) * 100);
                    
                    return (
                      <div
                        key={option._id}
                        onClick={() => handleOptionSelect(option._id)}
                        className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow' 
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                        } ${selectedOption && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-lg">{option.name}</span>
                          {selectedOption && (
                            <span className="text-sm font-semibold">
                              {percentage}%
                            </span>
                          )}
                        </div>
                        
                        {selectedOption && (
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedOption && (
                  <div className="text-center pt-4 border-t border-white/10">
                    <p className="text-green-400 font-medium">
                      ✓ Vote submitted successfully!
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Results update in real-time
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Chart Section */}
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Results</h2>
                  <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                        chartType === 'bar' 
                          ? 'bg-primary-500 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartType('doughnut')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                        chartType === 'doughnut' 
                          ? 'bg-primary-500 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Pie
                    </button>
                  </div>
                </div>

                <div className="h-80">
                  {chartType === 'bar' ? (
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: '#ffffff'
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: '#9ca3af'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              color: '#9ca3af'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <Doughnut
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#ffffff',
                              padding: 20
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>

                {/* Live Indicator */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates enabled</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingPage;