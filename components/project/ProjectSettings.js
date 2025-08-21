"use client";
// Comprehensive project settings component
import { useState } from "react";
import axios from "axios";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProjectSettings({ project, onProjectUpdate, onProjectDelete }) {
  const [isEditing, setIsEditing] = useState({
    name: false,
    repository: false,
    description: false,
  });
  const [formData, setFormData] = useState({
    projectName: project.projectName,
    repository: project.repository,
    repositoryUrl: project.repositoryUrl,
    description: project.description || "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async (field) => {
    if (!formData[field] && field !== 'description') {
      showError(`${field} cannot be empty`);
      return;
    }

    setUpdating(true);
    const loadingToast = showLoading("updating project...");

    try {
      const updateData = {};
      
      if (field === 'projectName') {
        updateData.projectName = formData.projectName;
      } else if (field === 'repository') {
        updateData.repository = formData.repository;
        updateData.repositoryUrl = formData.repositoryUrl;
      } else if (field === 'description') {
        updateData.description = formData.description;
      }

      const response = await axios.put(`/api/projects/${project._id}`, updateData);
      
      dismissToast(loadingToast);
      toasts.projectCreated("project updated");
      
      if (onProjectUpdate) {
        onProjectUpdate(response.data.project);
      }
      
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.response?.data?.error || "Failed to update project");
      // Reset form data on error
      setFormData({
        projectName: project.projectName,
        repository: project.repository,
        repositoryUrl: project.repositoryUrl,
        description: project.description || "",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    setDeleting(true);
    const loadingToast = showLoading("deleting project...");

    try {
      await axios.delete(`/api/projects/${project._id}`);
      
      dismissToast(loadingToast);
      toasts.draftDeleted();
      
      if (onProjectDelete) {
        onProjectDelete();
      }
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.response?.data?.error || "Failed to delete project");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const copyChangelogLink = async () => {
    const changelogUrl = `${window.location.origin}/${project.projectSlug}`;
    
    try {
      await navigator.clipboard.writeText(changelogUrl);
      toasts.copied();
    } catch (error) {
      toasts.copyError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-bold tracking-tighter">project name</h3>
          {!isEditing.name && (
            <button
              onClick={() => setIsEditing({ ...isEditing, name: true })}
              className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              disabled={updating}
            >
              edit
            </button>
          )}
        </div>
        
        {isEditing.name ? (
          <div className="space-y-3">
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="input input-bordered w-full font-lora"
              disabled={updating}
            />
            {formData.projectName && (
              <p className="font-space text-xs opacity-60">
                URL: shipnotes.dev/{formData.projectName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}
              </p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdate('projectName')}
                disabled={updating}
                className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
              >
                {updating ? "saving..." : "save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing({ ...isEditing, name: false });
                  setFormData({ ...formData, projectName: project.projectName });
                }}
                disabled={updating}
                className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-lora tracking-tighter">{project.projectName}</p>
            <p className="font-space text-xs opacity-60 mt-1">
              URL: shipnotes.dev/{project.projectSlug}
            </p>
          </div>
        )}
      </div>

      {/* Repository */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-bold tracking-tighter">repository</h3>
          {!isEditing.repository && (
            <button
              onClick={() => setIsEditing({ ...isEditing, repository: true })}
              className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              disabled={updating}
            >
              edit
            </button>
          )}
        </div>
        
        {isEditing.repository ? (
          <div className="space-y-3">
            <input
              type="text"
              value={formData.repository}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  repository: e.target.value,
                  repositoryUrl: `https://github.com/${e.target.value}`
                });
              }}
              placeholder="owner/repository"
              className="input input-bordered w-full font-space"
              disabled={updating}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdate('repository')}
                disabled={updating}
                className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
              >
                {updating ? "saving..." : "save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing({ ...isEditing, repository: false });
                  setFormData({ 
                    ...formData, 
                    repository: project.repository,
                    repositoryUrl: project.repositoryUrl,
                  });
                }}
                disabled={updating}
                className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-space tracking-tighter">{project.repository}</p>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-space text-xs link link-primary mt-1"
              >
                view on github →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-bold tracking-tighter">description</h3>
          {!isEditing.description && (
            <button
              onClick={() => setIsEditing({ ...isEditing, description: true })}
              className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              disabled={updating}
            >
              edit
            </button>
          )}
        </div>
        
        {isEditing.description ? (
          <div className="space-y-3">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="optional project description"
              className="textarea textarea-bordered w-full font-lora resize-none"
              rows={3}
              disabled={updating}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdate('description')}
                disabled={updating}
                className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
              >
                {updating ? "saving..." : "save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing({ ...isEditing, description: false });
                  setFormData({ ...formData, description: project.description || "" });
                }}
                disabled={updating}
                className="btn btn-ghost btn-sm font-raleway tracking-tighter"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="font-lora tracking-tighter opacity-80">
            {project.description || "no description"}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border border-neutral rounded-sm p-4">
        <h3 className="font-raleway font-bold tracking-tighter mb-3">quick actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyChangelogLink}
            className="btn btn-secondary btn-sm font-raleway font-bold tracking-tighter"
          >
            copy changelog link
          </button>
          <a
            href={`/${project.projectSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter"
          >
            view changelog →
          </a>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-error rounded-sm p-4">
        <h3 className="font-raleway font-bold tracking-tighter text-error mb-3">danger zone</h3>
        <div>
          <p className="font-lora tracking-tighter text-sm opacity-80 mb-3">
            delete this project and all associated release notes. this action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-error btn-sm font-raleway font-bold tracking-tighter"
            disabled={deleting}
          >
            {deleting ? "deleting..." : "delete project"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        title="delete project"
        message={`Are you sure you want to delete "${project.projectName}"? This will permanently delete the project and all associated release notes.`}
        confirmText="delete project"
        type="error"
      />
    </div>
  );
}