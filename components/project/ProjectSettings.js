"use client";
// Comprehensive project settings component
import { useState } from "react";
import axios from "axios";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import { ConfirmModal, Button, Input, TextArea } from "@/components/ui";

export default function ProjectSettings({
  project,
  onProjectUpdate,
  onProjectDelete,
}) {
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
    if (!formData[field] && field !== "description") {
      showError(`${field} cannot be empty`);
      return;
    }

    setUpdating(true);
    const loadingToast = showLoading("updating project...");

    try {
      const updateData = {};

      if (field === "projectName") {
        updateData.projectName = formData.projectName;
      } else if (field === "repository") {
        updateData.repository = formData.repository;
        updateData.repositoryUrl = formData.repositoryUrl;
      } else if (field === "description") {
        updateData.description = formData.description;
      }

      const response = await axios.put(
        `/api/projects/${project._id}`,
        updateData,
      );

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
    <div className="space-y-4">
      {/* Project Name */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-bold tracking-tighter lowercase">
            project name
          </h3>
          {!isEditing.name && (
            <Button
              onClick={() => setIsEditing({ ...isEditing, name: true })}
              variant="ghost"
              size="sm"
              disabled={updating}
            >
              edit
            </Button>
          )}
        </div>

        {isEditing.name ? (
          <div className="space-y-3">
            <Input
              type="text"
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
              disabled={updating}
            />
            {formData.projectName && (
              <p className="font-space text-xs opacity-60 lowercase">
                url: shipnotes.dev/
                {formData.projectName
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "-")
                  .replace(/-+/g, "-")
                  .replace(/^-|-$/g, "")}
              </p>
            )}
            <div className="flex space-x-2">
              <Button
                onClick={() => handleUpdate("projectName")}
                disabled={updating}
                variant="primary"
                size="sm"
              >
                {updating ? "saving..." : "save"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing({ ...isEditing, name: false });
                  setFormData({
                    ...formData,
                    projectName: project.projectName,
                  });
                }}
                disabled={updating}
                variant="ghost"
                size="sm"
              >
                cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-lora tracking-wide">
              {project.projectName} {/* Keep user content in original case */}
            </p>
            <p className="font-space text-xs opacity-60 mt-1 lowercase">
              url: shipnotes.dev/{project.projectSlug}
            </p>
          </div>
        )}
      </div>

      {/* Repository */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-bold tracking-tighter lowercase">
            repository
          </h3>
          {!isEditing.repository && (
            <Button
              onClick={() => setIsEditing({ ...isEditing, repository: true })}
              variant="ghost"
              size="sm"
              disabled={updating}
            >
              edit
            </Button>
          )}
        </div>

        {isEditing.repository ? (
          <div className="space-y-3">
            <Input
              type="text"
              value={formData.repository}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  repository: e.target.value,
                  repositoryUrl: `https://github.com/${e.target.value}`,
                });
              }}
              placeholder="owner/repository"
              className="font-space"
              disabled={updating}
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => handleUpdate("repository")}
                disabled={updating}
                variant="primary"
                size="sm"
              >
                {updating ? "saving..." : "save"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing({ ...isEditing, repository: false });
                  setFormData({
                    ...formData,
                    repository: project.repository,
                    repositoryUrl: project.repositoryUrl,
                  });
                }}
                disabled={updating}
                variant="ghost"
                size="sm"
              >
                cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-space tracking-normal">
                {project.repository} {/* Keep user content in original case */}
              </p>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-space text-xs link link-primary mt-1 lowercase"
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
          <h3 className="font-raleway font-bold tracking-tighter lowercase">
            description
          </h3>
          {!isEditing.description && (
            <Button
              onClick={() => setIsEditing({ ...isEditing, description: true })}
              variant="ghost"
              size="sm"
              disabled={updating}
            >
              edit
            </Button>
          )}
        </div>

        {isEditing.description ? (
          <div className="space-y-3">
            <TextArea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="optional project description"
              rows={3}
              disabled={updating}
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => handleUpdate("description")}
                disabled={updating}
                variant="primary"
                size="sm"
              >
                {updating ? "saving..." : "save"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing({ ...isEditing, description: false });
                  setFormData({
                    ...formData,
                    description: project.description || "",
                  });
                }}
                disabled={updating}
                variant="ghost"
                size="sm"
              >
                cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="font-lora tracking-wide opacity-80">
            {project.description || (
              <span className="lowercase">no description</span>
            )}{" "}
            {/* Keep user content in original case */}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border border-neutral rounded-sm p-4">
        <h3 className="font-raleway font-bold tracking-tighter mb-3 lowercase">
          quick actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={copyChangelogLink} variant="secondary" size="sm">
            copy changelog link
          </Button>
          <a
            href={`/${project.projectSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1"
          >
            view changelog →
          </a>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-error rounded-sm p-4">
        <h3 className="font-raleway font-bold tracking-tighter text-error mb-3 lowercase">
          danger zone
        </h3>
        <div>
          <p className="font-lora tracking-wide text-sm opacity-80 mb-3 lowercase">
            delete this project and all associated release notes. this action
            cannot be undone.
          </p>
          <Button
            onClick={() => setShowDeleteModal(true)}
            variant="error"
            size="sm"
            disabled={deleting}
          >
            {deleting ? "deleting..." : "delete project"}
          </Button>
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
