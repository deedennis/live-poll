import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChartBar, FaEye, FaHeart, FaCalendarAlt, FaEdit, FaTrash, FaShare, FaCog } from "react-icons/fa";
import { useQuery } from "react-query";
import getUserPollData from "../services/getUserPollData";
import ErrorFallback from "../components/Errors/ErrorFallback";
import { formatDataByDate } from "../utils/util";
import useUserStore from "../store/useStore";
import useLogout from "../hooks/useLogout";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Badge from "../components/Badge/Badge";

function Dashboard() {
  const navigator = useNavigate();
  const { handleLogout } = useLogout();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading, isError, refetch, isSuccess } = useQuery(
    ["polls", user?._id],
    getUserPollData,
    {
      cacheTime: 1000 * 60 * 5,
      staleTime: 0, // Always fetch fresh data
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when window regains focus
      enabled: !!user?._id, // Only run query if user is logged in
    }
  );

  const pollData = formatDataByDate(data) || [];

  const getPollStats = () => {
    if (!pollData) return { total: 0, published: 0, totalVotes: 0, totalLikes: 0 };
    
    return pollData.reduce((acc, poll) => ({
      total: acc.total + 1,
      published: acc.published + (poll.published ? 1 : 0),
      totalVotes: acc.totalVotes + (poll.totalVotes || 0),
      totalLikes: acc.totalLikes + (poll.likesCount || 0)
    }), { total: 0, published: 0, totalVotes: 0, totalLikes: 0 });
  };

  const stats = getPollStats();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPollStatus = (poll) => {
    if (!poll.published) return { label: "Draft", variant: "gray" };
    
    const now = new Date();
    const createdAt = new Date(poll.createdAt);
    const daysDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return { label: "New", variant: "success" };
    if (daysDiff <= 7) return { label: "Active", variant: "warning" };
    return { label: "Published", variant: "info" };
  };

  const filteredPolls = activeTab === 'all' 
    ? pollData 
    : pollData.filter(poll => 
        activeTab === 'published' ? poll.published : !poll.published
      );

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Section */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">
                  Welcome back, <span className="text-gradient-primary">{user?.username}</span>
                </h1>
                <p className="text-gray-400 mt-1">Manage your polls and track engagement</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <FaCog />
                <span>Settings</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigator("/create")}
                className="flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create Poll</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "Total Polls", 
              value: stats.total, 
              icon: <FaChartBar className="w-6 h-6" />, 
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-500/10"
            },
            { 
              title: "Published", 
              value: stats.published, 
              icon: <FaEye className="w-6 h-6" />, 
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-500/10"
            },
            { 
              title: "Total Votes", 
              value: stats.totalVotes, 
              icon: <FaChartBar className="w-6 h-6" />, 
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-500/10"
            },
            { 
              title: "Total Likes", 
              value: stats.totalLikes, 
              icon: <FaHeart className="w-6 h-6" />, 
              color: "from-red-500 to-red-600",
              bgColor: "bg-red-500/10"
            }
          ].map((stat, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <div className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Polls Section */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl font-display font-bold text-white">Your Polls</h2>
            
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 bg-dark-800 rounded-xl p-1">
              {[
                { key: 'all', label: 'All Polls' },
                { key: 'published', label: 'Published' },
                { key: 'draft', label: 'Drafts' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Polls List */}
          {isError && (
            <div className="h-60 w-full">
              <ErrorFallback onRetry={refetch} />
            </div>
          )}
          
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-dark-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          )}
          
          {!isLoading && !isError && (
            <>
              {filteredPolls.length === 0 ? (
                <Card className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartBar className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No polls found</h3>
                  <p className="text-gray-400 mb-6">
                    {activeTab === 'all' 
                      ? "You haven't created any polls yet." 
                      : `No ${activeTab} polls found.`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigator("/create")}
                    className="flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Create Your First Poll</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPolls.map((poll, index) => {
                    const status = getPollStatus(poll);
                    return (
                      <Card key={poll._id} className="group hover:scale-105 transition-all duration-300">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white truncate group-hover:text-gradient-primary transition-colors duration-300">
                                {poll.title}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {poll.description}
                              </p>
                            </div>
                            <Badge variant={status.variant} size="sm">
                              {status.label}
                            </Badge>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <FaChartBar className="w-3 h-3" />
                                <span>{poll.totalVotes || 0} votes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaHeart className="w-3 h-3" />
                                <span>{poll.likesCount || 0} likes</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              <span>{formatDate(poll.createdAt)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigator(`/view/${poll._id}`)}
                              className="flex items-center space-x-2"
                            >
                              <FaEye />
                              <span>View</span>
                            </Button>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator(`/edit/${poll._id}`)}
                                className="flex items-center space-x-2"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;