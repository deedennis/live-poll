import React, { useState } from "react";
import { FaPlus, FaTrashAlt, FaRocket, FaLightbulb, FaArrowLeft, FaSave } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import createPollService from "../services/createPollService";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Input from "../components/Input/Input";
import Badge from "../components/Badge/Badge";

function CreatePollForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAddOption = () => {
    if (optionInput.trim() === "") {
      toast.error("Please enter an option");
      return;
    }
    if (options.includes(optionInput.trim())) {
      toast.error("This option already exists");
      return;
    }
    if (options.length >= 10) {
      toast.error("Maximum 10 options allowed");
      return;
    }
    setOptions((prev) => [...prev, optionInput.trim()]);
    setOptionInput("");
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      toast.error("At least 2 options are required");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleClearPoll = () => {
    setTitle("");
    setDescription("");
    setOptions([]);
    setOptionInput("");
  };

  const mutation = useMutation(createPollService, {
    onSuccess: (data) => {
      const message = data?.message || "Poll created successfully";
      toast.success(message);
      // Invalidate polls queries to refetch updated data
      queryClient.invalidateQueries(['polls']);
      handleClearPoll();
      navigate(`/view/${data?.data?._id}`);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const handlePollSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "" || options.length < 2) {
      toast.error("All fields are required and at least 2 options needed");
      return;
    }
    mutation.mutate({ title, description, options });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <FaArrowLeft />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">
                Create <span className="text-gradient-primary">New Poll</span>
              </h1>
              <p className="text-gray-400 mt-2">Share your thoughts and gather opinions</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handlePollSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Poll Details */}
              <div className="space-y-6">
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <FaLightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Poll Details</h2>
                    </div>

                    {/* Poll Title */}
                    <Input
                      label="Poll Title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter an engaging poll title..."
                      helperText="Make it clear and attention-grabbing"
                      className="text-lg"
                    />

                    {/* Poll Description */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the purpose and context of your poll..."
                        className="w-full px-4 py-3 rounded-xl border-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 resize-none"
                        rows="4"
                      />
                      <p className="mt-2 text-sm text-gray-400">
                        Provide context to help people understand your poll
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Poll Options */}
              <div className="space-y-6">
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-green-500 rounded-lg flex items-center justify-center">
                          <FaPlus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Poll Options</h2>
                      </div>
                      <Badge variant="info" size="sm">
                        {options.length}/10
                      </Badge>
                    </div>

                    {/* Existing Options */}
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="flex-1 text-white font-medium">{option}</span>
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                              title="Remove option"
                            >
                              <FaTrashAlt className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Option Input */}
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a new option..."
                        helperText="Press Enter or click Add to include this option"
                      />
                      <Button
                        type="button"
                        variant="accent"
                        size="md"
                        onClick={handleAddOption}
                        disabled={!optionInput.trim() || options.length >= 10}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <FaPlus />
                        <span>Add Option</span>
                      </Button>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h3 className="text-blue-400 font-medium mb-2">💡 Tips for better polls:</h3>
                      <ul className="text-sm text-blue-300 space-y-1">
                        <li>• Keep options clear and concise</li>
                        <li>• Avoid bias in your wording</li>
                        <li>• Include 3-6 options for best results</li>
                        <li>• Make options mutually exclusive</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  if (title || description || options.length > 0) {
                    const sure = window.confirm("Are you sure you want to clear the poll?");
                    if (sure) {
                      handleClearPoll();
                    }
                  }
                }}
                className="flex items-center space-x-2 sm:w-auto w-full"
              >
                <FaTrashAlt />
                <span>Clear Poll</span>
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={mutation.isLoading}
                disabled={!title.trim() || !description.trim() || options.length < 2}
                className="flex items-center space-x-2 sm:w-auto w-full"
              >
                <FaRocket />
                <span>Create Poll</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePollForm;