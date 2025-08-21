"use client";
// Client-side dashboard component for managing projects
import { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { toasts } from "@/lib/toast";

export default function DashboardClient({ session }) {
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, draftId: null, title: '' });

  // Fetch projects and drafts on component mount
  useEffect(() => {
    fetchProjects();
    fetchDrafts();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data.projects);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await axios.get("/api/patch-notes?status=draft&limit=10");
      setDrafts(response.data.patchNotes);
    } catch (error) {
      console.error("❌ Error fetching drafts:", error);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const openDeleteConfirm = (draftId, draftTitle) => {
    setConfirmModal({ 
      isOpen: true, 
      draftId, 
      title: draftTitle 
    });
  };

  const handleDeleteDraft = async () => {
    try {
      await axios.delete(`/api/patch-notes/${confirmModal.draftId}`);
      setDrafts(prev => prev.filter(draft => draft.id !== confirmModal.draftId));
      toasts.draftDeleted();
    } catch (error) {
      console.error("❌ Error deleting draft:", error);
      toasts.draftDeleteError();
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleContinueEditing = (draftId) => {
    // Store current drafts in session storage to detect changes when user comes back
    sessionStorage.setItem('shipnotes_drafts_count', drafts.length.toString());
    window.location.href = `/edit/${draftId}`;
  };

  return (
    <div className="space-y-6">
      {/* Projects Section */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-raleway font-bold text-xl tracking-tighter">
            your projects
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary font-raleway font-bold tracking-tighter"
          >
            create project
          </button>
        </div>

        {isLoadingProjects ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-lora tracking-tighter opacity-80 text-neutral mb-4">
              no projects yet. create your first project to get started with automated release notes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-neutral rounded-sm p-4 hover:bg-base-200 transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to project page (we'll build this next)
                  window.location.href = `/project/${project.projectSlug}`;
                }}
              >
                <h3 className="font-raleway font-bold text-lg tracking-tighter mb-2">
                  {project.projectName}
                </h3>
                <p className="font-space tracking-tighter text-sm opacity-60 text-neutral mb-2">
                  {project.repository}
                </p>
                {project.description && (
                  <p className="font-lora tracking-tighter opacity-80 text-neutral text-sm">
                    {project.description}
                  </p>
                )}
                <div className="mt-3 flex justify-between items-center">
                  <span className="badge badge-success font-space text-xs">
                    active
                  </span>
                  <span className="font-space tracking-tighter text-xs opacity-60">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drafts Section */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-raleway font-bold text-xl tracking-tighter">
            your drafts
          </h2>
          <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoadingDrafts ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-lora tracking-tighter opacity-80 text-neutral mb-2">
              no drafts found.
            </p>
            <p className="font-space tracking-tighter text-sm opacity-60 text-neutral">
              drafts are automatically saved when you generate release notes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="border border-neutral rounded-sm p-4 hover:bg-base-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-raleway font-bold text-lg tracking-tighter mb-1 truncate">
                      {draft.title}
                    </h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                        {draft.project?.name || 'Unknown Project'}
                      </span>
                      <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                        {new Date(draft.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="badge badge-secondary font-space text-xs">
                        draft
                      </span>
                    </div>
                    <p className="font-lora tracking-tighter opacity-80 text-neutral text-sm">
                      {draft.content.slice(0, 150)}{draft.content.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleContinueEditing(draft.id)}
                      className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
                    >
                      continue editing
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(draft.id, draft.title)}
                      className="btn btn-error btn-outline btn-sm font-raleway font-bold tracking-tighter"
                    >
                      delete
                    </button>
                  </div>
                </div>
                
                {draft.commits && draft.commits.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral">
                    <span className="font-space tracking-tighter text-xs opacity-60 text-neutral">
                      includes {draft.commits.length} commit{draft.commits.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, draftId: null, title: '' })}
        onConfirm={handleDeleteDraft}
        title="Delete Draft"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
        confirmText="Delete Draft"
        type="error"
      />
    </div>
  );
}