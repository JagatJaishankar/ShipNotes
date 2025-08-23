"use client";
// Client-side project component for commit selection and release note generation
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommitSelector from "./CommitSelector";
import WidgetGenerator from "./WidgetGenerator";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui";

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
  const [publishedCommits, setPublishedCommits] = useState([]);
  const [draftCommits, setDraftCommits] = useState([]);

  const checkPublishedNotes = useCallback(async () => {
    try {
      const response = await axios.get(`/api/widget/${project.projectSlug}`);
      setHasPublishedNotes(response.data.stats.totalUpdates > 0);
    } catch (error) {
      // If API returns 404 or error, assume no published notes
      setHasPublishedNotes(false);
    }
  }, [project.projectSlug]);

  const fetchCommitUsage = useCallback(async () => {
    try {
      // Fetch published commits
      const publishedResponse = await axios.get(`/api/patch-notes?status=published&projectId=${project._id}`);
      const publishedNotes = publishedResponse.data.patchNotes || [];
      const publishedCommitShas = publishedNotes.flatMap(note => note.commits || []);
      setPublishedCommits(publishedCommitShas);

      // Fetch draft commits  
      const draftResponse = await axios.get(`/api/patch-notes?status=draft&projectId=${project._id}`);
      const draftNotes = draftResponse.data.patchNotes || [];
      const draftCommitShas = draftNotes.flatMap(note => note.commits || []);
      setDraftCommits(draftCommitShas);
    } catch (error) {
      console.error("❌ Error fetching commit usage:", error);
      // Set empty arrays on error
      setPublishedCommits([]);
      setDraftCommits([]);
    }
  }, [project._id]);

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
    fetchCommitUsage();
  }, [dateRange, fetchCommits, checkPublishedNotes, fetchCommitUsage]);

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
      <div className="tabs tabs-lift">
        <input 
          type="radio" 
          name="project_tabs" 
          className="tab font-raleway lowercase font-extrabold" 
          aria-label="generate release notes" 
          checked={activeTab === 'commits'}
          onChange={() => setActiveTab('commits')}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="space-y-6">
            {/* Date Range Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-raleway font-extrabold text-xl tracking-tighter lowercase">
                  select commits
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                    show commits from last:
                  </span>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(Number(e.target.value))}
                    className="select-sm"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </Select>
                </div>
              </div>

              {/* Selected Commits Summary */}
              {selectedCommits.length > 0 && (
                <div className="mb-4 p-3 bg-base-200 rounded-sm border-1 border-neutral">
                  <div className="flex justify-between items-center">
                    <span className="font-lora tracking-wide opacity-80 text-neutral lowercase">
                      {selectedCommits.length} commit{selectedCommits.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleGenerateReleaseNotes}
                      disabled={isGenerating}
                      className="btn btn-primary btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
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
                publishedCommits={publishedCommits}
                draftCommits={draftCommits}
              />
            </div>
          </div>
        </div>

        <input 
          type="radio" 
          name="project_tabs" 
          className="tab font-raleway lowercase font-extrabold" 
          aria-label="manage release notes" 
          checked={activeTab === 'notes'}
          onChange={() => setActiveTab('notes')}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <ReleaseNotesManager project={currentProject} />
        </div>

        <input 
          type="radio" 
          name="project_tabs" 
          className="tab font-raleway lowercase font-extrabold" 
          aria-label="widget & integration" 
          checked={activeTab === 'widget'}
          onChange={() => setActiveTab('widget')}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <WidgetGenerator 
            project={currentProject} 
            hasPublishedNotes={hasPublishedNotes}
          />
        </div>

        <input 
          type="radio" 
          name="project_tabs" 
          className="tab font-raleway lowercase font-extrabold" 
          aria-label="project settings" 
          checked={activeTab === 'settings'}
          onChange={() => setActiveTab('settings')}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <ProjectSettings 
            project={currentProject} 
            onProjectUpdate={handleProjectUpdate}
            onProjectDelete={handleProjectDelete}
          />
        </div>
      </div>

    </div>
  );
}