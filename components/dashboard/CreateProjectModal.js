"use client";
// Project creation modal for selecting GitHub repositories
import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [step, setStep] = useState(1); // 1: repos, 2: project details
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch repositories when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      fetchRepositories();
    }
  }, [isOpen, step]);

  const fetchRepositories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/github/repositories");
      setRepositories(response.data.repositories);
    } catch (error) {
      console.error("❌ Error fetching repositories:", error);
      alert("Failed to fetch repositories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setProjectName(repo.name); // Pre-fill project name
    setStep(2);
  };

  const handleCreateProject = async () => {
    if (!selectedRepo || !projectName.trim()) {
      alert("Please fill in all required fields");
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
      alert("Project created successfully!");
    } catch (error) {
      console.error("❌ Error creating project:", error);
      const errorMessage = error.response?.data?.error || "Failed to create project";
      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedRepo(null);
    setProjectName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 border border-neutral rounded-sm p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-raleway font-black tracking-tighter text-2xl">
            {step === 1 ? "select repository" : "project details"}
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm"
            disabled={isCreating}
          >
            ✕
          </button>
        </div>

        {/* Step 1: Repository Selection */}
        {step === 1 && (
          <div>
            <p className="font-lora tracking-tighter opacity-80 text-neutral mb-4">
              choose a github repository to create your patchnote project
            </p>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => handleRepoSelect(repo)}
                    className="border border-neutral rounded-sm p-4 cursor-pointer hover:bg-base-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-raleway font-bold text-lg tracking-tighter">
                          {repo.name}
                        </h3>
                        <p className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                          {repo.fullName}
                        </p>
                        {repo.description && (
                          <p className="font-lora tracking-tighter opacity-80 text-neutral mt-2">
                            {repo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {repo.isPrivate && (
                          <span className="badge badge-secondary font-space text-xs">
                            private
                          </span>
                        )}
                        <span className="font-space tracking-tighter text-xs opacity-60">
                          {new Date(repo.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Project Details */}
        {step === 2 && selectedRepo && (
          <div className="space-y-4">
            <div className="border border-neutral rounded-sm p-4 bg-base-200">
              <h3 className="font-raleway font-bold text-lg tracking-tighter">
                selected repository
              </h3>
              <p className="font-space tracking-tighter text-sm opacity-60">
                {selectedRepo.fullName}
              </p>
            </div>

            <div>
              <label className="label">
                <span className="font-raleway font-bold tracking-tighter">
                  project name *
                </span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="input input-bordered w-full font-lora"
                placeholder="my awesome project"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="font-raleway font-bold tracking-tighter">
                  description
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full font-lora"
                placeholder="optional project description"
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="btn btn-secondary font-raleway font-bold tracking-tighter"
                disabled={isCreating}
              >
                back
              </button>
              <button
                onClick={handleCreateProject}
                className="btn btn-primary font-raleway font-bold tracking-tighter"
                disabled={isCreating || !projectName.trim()}
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
  );
}