"use client";
// Client-side dashboard component for managing projects
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import CreateProjectModal from "./CreateProjectModal";
import { ConfirmModal } from "@/components/ui";
import { toasts, showSuccess } from "@/lib/toast";

export default function DashboardClient({ session }) {
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [publishedNotes, setPublishedNotes] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [isLoadingPublished, setIsLoadingPublished] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    draftId: null,
    title: "",
  });

  // Fetch projects and drafts on component mount
  useEffect(() => {
    fetchProjects();
    fetchDrafts();
    fetchPublishedNotes();
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
      const response = await axios.get(
        "/api/patch-notes?status=draft&limit=10",
      );
      setDrafts(response.data.patchNotes);
    } catch (error) {
      console.error("❌ Error fetching drafts:", error);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const fetchPublishedNotes = async () => {
    try {
      const response = await axios.get(
        "/api/patch-notes?status=published&limit=10",
      );
      setPublishedNotes(response.data.patchNotes);
    } catch (error) {
      console.error("❌ Error fetching published notes:", error);
    } finally {
      setIsLoadingPublished(false);
    }
  };

  const openDeleteConfirm = (draftId, draftTitle) => {
    setConfirmModal({
      isOpen: true,
      draftId,
      title: draftTitle,
    });
  };

  const handleDeleteDraft = async () => {
    try {
      await axios.delete(`/api/patch-notes/${confirmModal.draftId}`);
      setDrafts((prev) =>
        prev.filter((draft) => draft.id !== confirmModal.draftId),
      );
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
    sessionStorage.setItem("shipnotes_drafts_count", drafts.length.toString());
    window.location.href = `/edit/${draftId}`;
  };

  return (
    <div>
      {/* Dashboard Tabs */}
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="dashboard_tabs"
          className="tab font-raleway lowercase font-extrabold"
          aria-label="projects"
          checked={activeTab === "projects"}
          onChange={() => setActiveTab("projects")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase">
              your projects
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
            >
              create project
            </button>
          </div>

          {isLoadingProjects ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg text-neutral"></span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl opacity-50 mb-4">🚀</div>
              <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase opacity-70 mb-2">
                no projects yet
              </h3>
              <p className="font-lora tracking-wide opacity-80 text-neutral lowercase max-w-md mx-auto mb-4">
                create your first project to start generating beautiful release
                notes from your github commits.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
              >
                create your first project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="bg-base-100 hover:bg-base-200 rounded-sm border-1 border-neutral hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/project/${project.projectSlug}`)
                  }
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-raleway font-extrabold tracking-tighter text-lg lowercase">
                        {project.projectName}
                      </h3>
                      <span className="badge font-space tracking-normal lowercase border-1 border-neutral badge-secondary">
                        active
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pt-2 pb-4">
                    <p className="font-space tracking-normal opacity-60 text-neutral lowercase text-sm mb-3">
                      {project.repository}
                    </p>
                    {project.description && (
                      <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-space tracking-normal text-xs lowercase opacity-60">
                        created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="radio"
          name="dashboard_tabs"
          className="tab font-raleway lowercase font-extrabold"
          aria-label="drafts"
          checked={activeTab === "drafts"}
          onChange={() => setActiveTab("drafts")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase">
              draft release notes
            </h3>
          </div>

          {isLoadingDrafts ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg text-neutral"></span>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl opacity-50 mb-4">✍️</div>
              <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase opacity-70 mb-2">
                no drafts yet
              </h3>
              <p className="font-lora tracking-wide opacity-80 text-neutral lowercase max-w-md mx-auto">
                draft release notes will appear here as you create them.
                they&apos;ll be saved automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft._id || draft.id}
                  className="bg-base-100 rounded-sm border-1 border-neutral p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-raleway font-extrabold tracking-tighter text-lg lowercase">
                        {draft.title}
                      </h3>
                      <p className="font-space tracking-normal opacity-60 text-neutral lowercase text-sm">
                        {draft.project?.name || "unknown project"} • last edited{" "}
                        {new Date(draft.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="badge badge-secondary font-space tracking-normal lowercase border-1 border-neutral">
                      draft
                    </span>
                  </div>
                  <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm mb-4 line-clamp-2">
                    {draft.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContinueEditing(draft.id)}
                        className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                      >
                        continue editing
                      </button>
                      <Link
                        href={`/preview/${draft.id}`}
                        className="btn btn-secondary border-1 border-neutral font-raleway font-extrabold tracking-tighter lowercase"
                      >
                        preview
                      </Link>
                    </div>
                    <span className="font-space tracking-normal text-xs lowercase opacity-60">
                      {draft.commits?.length || 0} commits selected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="radio"
          name="dashboard_tabs"
          className="tab font-raleway lowercase font-extrabold"
          aria-label="published"
          checked={activeTab === "published"}
          onChange={() => setActiveTab("published")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase">
              published release notes
            </h3>
          </div>

          {isLoadingPublished ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg text-neutral"></span>
            </div>
          ) : publishedNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl opacity-50 mb-4">🚀</div>
              <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase opacity-70 mb-2">
                no published notes yet
              </h3>
              <p className="font-lora tracking-wide opacity-80 text-neutral lowercase max-w-md mx-auto">
                published release notes will appear here. create and publish
                your first release notes to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedNotes.map((note) => (
                <div
                  key={note._id || note.id}
                  className="bg-base-100 rounded-sm border-1 border-neutral p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-raleway font-extrabold tracking-tighter text-lg lowercase">
                        {note.title}
                      </h3>
                      <p className="font-space tracking-normal opacity-60 text-neutral lowercase text-sm">
                        published{" "}
                        {new Date(note.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <span className="badge badge-secondary font-space tracking-normal lowercase border-1 border-neutral">
                      published
                    </span>
                  </div>
                  <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm mb-4 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link
                        href={`/${note.project?.projectSlug || "unknown"}`}
                        className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                      >
                        view changelog
                      </Link>
                      <button
                        onClick={() =>
                          showSuccess("analytics feature coming soon!")
                        }
                        className="btn btn-secondary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                      >
                        analytics
                      </button>
                    </div>
                    <span className="font-space tracking-normal text-xs lowercase opacity-60">
                      {note.viewCount || 0} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
        onClose={() =>
          setConfirmModal({ isOpen: false, draftId: null, title: "" })
        }
        onConfirm={handleDeleteDraft}
        title="Delete Draft"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
        confirmText="Delete Draft"
        type="error"
      />
    </div>
  );
}
