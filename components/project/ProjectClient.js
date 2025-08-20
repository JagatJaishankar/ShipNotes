"use client";
// Client-side project component for commit selection and release note generation
import { useState, useEffect } from "react";
import axios from "axios";
import CommitSelector from "./CommitSelector";
import WidgetGenerator from "./WidgetGenerator";

export default function ProjectClient({ project, session }) {
  const [commits, setCommits] = useState([]);
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [dateRange, setDateRange] = useState(30); // Default: last 30 days
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPublishedNotes, setHasPublishedNotes] = useState(false);

  // Fetch commits and check for published notes when component mounts
  useEffect(() => {
    fetchCommits();
    checkPublishedNotes();
  }, [dateRange]);

  const checkPublishedNotes = async () => {
    try {
      const response = await axios.get(`/api/widget/${project.projectSlug}`);
      setHasPublishedNotes(response.data.stats.totalUpdates > 0);
    } catch (error) {
      // If API returns 404 or error, assume no published notes
      setHasPublishedNotes(false);
    }
  };

  const fetchCommits = async () => {
    setIsLoadingCommits(true);
    try {
      // Calculate since date
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - dateRange);
      
      const response = await axios.get("/api/github/commits", {
        params: {
          repository: project.repository,
          since: sinceDate.toISOString(),
        },
      });
      
      setCommits(response.data.commits);
    } catch (error) {
      console.error("❌ Error fetching commits:", error);
      alert("Failed to fetch commits. Please try again.");
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const handleCommitToggle = (commit) => {
    setSelectedCommits(prev => {
      const isSelected = prev.some(c => c.sha === commit.sha);
      if (isSelected) {
        return prev.filter(c => c.sha !== commit.sha);
      } else {
        return [...prev, commit];
      }
    });
  };

  const handleGenerateReleaseNotes = async () => {
    if (selectedCommits.length === 0) {
      alert("Please select at least one commit to generate release notes.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post("/api/openai/generate", {
        projectId: project._id,
        selectedCommits: selectedCommits,
        title: `${project.projectName} - Release Notes`,
      });

      if (response.data.success) {
        // Navigate to editor page with the generated notes
        window.location.href = `/edit/${response.data.patchNote.id}`;
      } else {
        throw new Error(response.data.error || "Failed to generate release notes");
      }
    } catch (error) {
      console.error("❌ Error generating release notes:", error);
      
      // Handle specific error messages
      let errorMessage = "Failed to generate release notes. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-raleway font-bold text-xl tracking-tighter">
            select commits
          </h2>
          <div className="flex items-center space-x-4">
            <span className="font-lora tracking-tighter opacity-80 text-neutral text-sm">
              show commits from last:
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="select select-bordered select-sm font-raleway"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>

        {/* Selected Commits Summary */}
        {selectedCommits.length > 0 && (
          <div className="mb-4 p-3 bg-base-200 rounded-sm border border-neutral">
            <div className="flex justify-between items-center">
              <span className="font-lora tracking-tighter opacity-80 text-neutral">
                {selectedCommits.length} commit{selectedCommits.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleGenerateReleaseNotes}
                disabled={isGenerating}
                className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    generating...
                  </>
                ) : (
                  "generate release notes"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Commit List */}
        <CommitSelector
          commits={commits}
          selectedCommits={selectedCommits}
          onCommitToggle={handleCommitToggle}
          isLoading={isLoadingCommits}
          onRefresh={fetchCommits}
        />
      </div>

      {/* Widget Integration */}
      <WidgetGenerator 
        project={project} 
        hasPublishedNotes={hasPublishedNotes}
      />
    </div>
  );
}