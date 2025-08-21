"use client";
// Client-side project component for commit selection and release note generation
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommitSelector from "./CommitSelector";
import WidgetGenerator from "./WidgetGenerator";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function ProjectClient({ project, session, ProjectSettings, ReleaseNotesManager }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("commits");
  const [currentProject, setCurrentProject] = useState(project);
  const [commits, setCommits] = useState([]);
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [dateRange, setDateRange] = useState(30); // Default: last 30 days
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPublishedNotes, setHasPublishedNotes] = useState(false);

  const checkPublishedNotes = useCallback(async () => {
    try {
      const response = await axios.get(`/api/widget/${project.projectSlug}`);
      setHasPublishedNotes(response.data.stats.totalUpdates > 0);
    } catch (error) {
      // If API returns 404 or error, assume no published notes
      setHasPublishedNotes(false);
    }
  }, [project.projectSlug]);

  const fetchCommits = useCallback(async () => {
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
      toasts.commitsError();
    } finally {
      setIsLoadingCommits(false);
    }
  }, [dateRange, project.repository]);

  // Fetch commits and check for published notes when component mounts
  useEffect(() => {
    fetchCommits();
    checkPublishedNotes();
  }, [dateRange, fetchCommits, checkPublishedNotes]);

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
      showError("Please select at least one commit to generate release notes.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toasts.generating();
    
    try {
      const response = await axios.post("/api/openai/generate", {
        projectId: project._id,
        selectedCommits: selectedCommits,
        title: `${project.projectName} - Release Notes`,
      });

      if (response.data.success) {
        dismissToast(loadingToast);
        toasts.generated();
        // Small delay to show success toast before navigating
        setTimeout(() => {
          window.location.href = `/edit/${response.data.patchNote.id}`;
        }, 500);
      } else {
        throw new Error(response.data.error || "Failed to generate release notes");
      }
    } catch (error) {
      console.error("❌ Error generating release notes:", error);
      
      dismissToast(loadingToast);
      
      // Handle no credits scenario
      if (error.response?.data?.errorType === "no_credits") {
        showError(error.response.data.error);
        // Redirect to feedback page after short delay
        setTimeout(() => {
          window.location.href = "/feedback";
        }, 2000);
        return;
      }
      
      // Handle other error messages
      let errorMessage = "Failed to generate release notes. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setCurrentProject(updatedProject);
    // If project slug changed, redirect to new URL
    if (updatedProject.projectSlug !== project.projectSlug) {
      router.push(`/project/${updatedProject.projectSlug}`);
    }
  };

  const handleProjectDelete = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="tabs tabs-bordered">
        <button
          onClick={() => setActiveTab("commits")}
          className={`tab ${activeTab === "commits" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          generate release notes
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`tab ${activeTab === "notes" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          manage release notes
        </button>
        <button
          onClick={() => setActiveTab("widget")}
          className={`tab ${activeTab === "widget" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          widget & integration
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`tab ${activeTab === "settings" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          project settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "commits" && (
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
        </div>
      )}

      {/* Release Notes Management Tab */}
      {activeTab === "notes" && (
        <ReleaseNotesManager project={currentProject} />
      )}

      {/* Widget & Integration Tab */}
      {activeTab === "widget" && (
        <WidgetGenerator 
          project={currentProject} 
          hasPublishedNotes={hasPublishedNotes}
        />
      )}

      {/* Project Settings Tab */}
      {activeTab === "settings" && (
        <ProjectSettings 
          project={currentProject} 
          onProjectUpdate={handleProjectUpdate}
          onProjectDelete={handleProjectDelete}
        />
      )}
    </div>
  );
}