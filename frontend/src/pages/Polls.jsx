import React, { useState } from "react";
import { useQuery } from "react-query";
import { FaSearch, FaFilter, FaSort, FaChevronLeft, FaChevronRight, FaFire, FaClock, } from "react-icons/fa";
import getPollsService from "../services/getPollsService";
import PollCard from "../components/PollCard/PollCard";
import ErrorFallback from "../components/Errors/ErrorFallback";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Card from "../components/Card/Card";
import Badge from "../components/Badge/Badge";

function Polls() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const { data, isLoading, isError, isSuccess, refetch } = useQuery(
    ["polls", page, limit, searchTerm, sortBy, filterBy],
    () => getPollsService(page, limit),
    {
      cacheTime: 1000 * 60 * 5,
      staleTime: 0, // Always fetch fresh data
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when window regains focus
      retry: 3,
      retryDelay: 1000,
    }
  );

  const polls = data?.data?.polls || [];
  const totalPages = data?.data?.totalPages || 1;

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: <FaClock /> },
    { value: "popular", label: "Most Popular", icon: <FaFire /> },
    { value: "trending", label: "Trending", icon: <FaFire /> },
    { value: "votes", label: "Most Votes", icon: <FaSort /> }
  ];

  const filterOptions = [
    { value: "all", label: "All Polls", count: polls.length },
    {
      value: "recent", label: "Recent", count: polls.filter(p => {
        const daysDiff = Math.floor((new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      }).length
    },
    { value: "popular", label: "Popular", count: polls.filter(p => (p.likesCount || 0) > 10).length }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setPage(1);
  };

  const filteredPolls = polls.filter(poll => {
    if (searchTerm && !poll.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !poll.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filterBy === "recent") {
      const daysDiff = Math.floor((new Date() - new Date(poll.createdAt)) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }

    if (filterBy === "popular") {
      return (poll.likesCount || 0) > 10;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Discover <span className="text-gradient-primary">Polls</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore engaging polls from the community, participate in discussions, and share your opinions.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search polls by title or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center space-x-2 bg-dark-800 rounded-xl p-1">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${filterBy === filter.value
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span>{filter.label}</span>
                    <Badge variant="gray" size="sm">{filter.count}</Badge>
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Polls Grid */}
        {isError && (
          <div className="flex justify-center">
            <ErrorFallback onRetry={() => refetch()} />
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-80 bg-dark-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {isSuccess && (
          <>
            {filteredPolls.length === 0 ? (
              <Card className="text-center py-16">
                <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No polls found</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm
                    ? `No polls match "${searchTerm}". Try adjusting your search terms.`
                    : "No polls available at the moment. Check back later!"
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </Card>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    Showing {filteredPolls.length} of {polls.length} polls
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <FaFire className="w-4 h-4" />
                    <span>Live updates enabled</span>
                  </div>
                </div>

                {/* Polls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {filteredPolls.map((poll, index) => (
                    <div
                      key={poll._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PollCard poll={poll} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="flex items-center space-x-2"
                    >
                      <FaChevronLeft />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center space-x-2">
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = page <= 3 ? index + 1 : page - 2 + index;
                        if (pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${page === pageNum
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-800 text-gray-400 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <FaChevronRight />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Polls;