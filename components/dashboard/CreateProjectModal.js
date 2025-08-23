"use client";
// Project creation modal for selecting GitHub repositories
import { useState } from "react";
import axios from "axios";
import { toasts, showError } from "@/lib/toast";
import RepositorySelector from "./RepositorySelector";

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setProjectName(repo.fullName.split('/')[1]); // Pre-fill with repo name (not full name)
  };

  const handleCreateProject = async () => {
    if (!selectedRepo || !projectName.trim()) {
      showError("Please fill in all required fields");
      return;
    }

    // Validate project name for URL safety
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(projectName.trim())) {
      showError("Project name can only contain letters, numbers, spaces, hyphens, and underscores");
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post("/api/projects", {
        projectName: projectName.trim(),
        repository: selectedRepo.fullName,
        repositoryUrl: selectedRepo.htmlUrl,
        description: description.trim(),
      });

      // Call callback to refresh projects
      if (onProjectCreated) {
        onProjectCreated(response.data.project);
      }

      // Reset form and close modal
      handleClose();
      toasts.projectCreated(projectName.trim());
    } catch (error) {
      console.error("❌ Error creating project:", error);
      const errorMessage = error.response?.data?.error || "Failed to create project";
      showError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedRepo(null);
    setProjectName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl bg-base-100 border-1 border-neutral rounded-sm h-[70vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-base-300 mb-6">
          <h2 className="font-raleway font-extrabold tracking-tighter text-2xl lowercase">
            create new project
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-outline border-1 border-neutral rounded-sm"
            disabled={isCreating}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Repository Selection */}
          <RepositorySelector
            onRepositorySelect={handleRepoSelect}
            selectedRepository={selectedRepo}
            disabled={isCreating}
          />

          {/* Project Details - Only show if repository is selected */}
          {selectedRepo && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="font-raleway font-extrabold tracking-tighter lowercase">
                    project name *
                  </span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input input-bordered w-full font-lora tracking-wide border-1 border-neutral focus:border-neutral"
                  placeholder="my awesome project"
                  required
                  disabled={isCreating}
                />
                {projectName && (
                  <div className="mt-2 p-2 bg-base-200 rounded-sm border-1 border-neutral">
                    {/^[a-zA-Z0-9\s\-_]+$/.test(projectName) ? (
                      <div>
                        <p className="font-space tracking-normal text-sm opacity-60 lowercase">
                          url preview: shipnotes.dev/{projectName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}
                        </p>
                        <p className="font-space tracking-normal text-xs opacity-50 mt-1 lowercase">
                          ✓ valid project name
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-space tracking-normal text-sm text-error lowercase">
                          ❌ invalid characters detected
                        </p>
                        <p className="font-space tracking-normal text-xs opacity-50 mt-1 lowercase">
                          only letters, numbers, spaces, hyphens, and underscores allowed
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="font-raleway font-extrabold tracking-tighter lowercase">
                    description
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered w-full font-lora tracking-wide border-1 border-neutral focus:border-neutral"
                  placeholder="optional project description"
                  rows={3}
                  disabled={isCreating}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleCreateProject}
                  className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                  disabled={isCreating || !projectName.trim() || !/^[a-zA-Z0-9\s\-_]+$/.test(projectName.trim())}
                >
                  {isCreating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      creating...
                    </>
                  ) : (
                    "create project"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}