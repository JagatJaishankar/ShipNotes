"use client";
// Component for managing drafts and published release notes
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import { ConfirmModal, Button, Badge } from "@/components/ui";

export default function ReleaseNotesManager({ project }) {
  const [activeTab, setActiveTab] = useState("drafts");
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReleaseNotes = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch drafts
      const draftsResponse = await axios.get(
        `/api/patch-notes?status=draft&projectId=${project._id}`,
      );
      setDrafts(draftsResponse.data.patchNotes || []);

      // Fetch published notes
      const publishedResponse = await axios.get(
        `/api/patch-notes?status=published&projectId=${project._id}`,
      );
      setPublished(publishedResponse.data.patchNotes || []);
    } catch (error) {
      console.error("❌ Error fetching release notes:", error);
      showError("Failed to load release notes");
    } finally {
      setLoading(false);
    }
  }, [project._id]);

  useEffect(() => {
    fetchReleaseNotes();
  }, [fetchReleaseNotes]);

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setDeleting(true);
    const loadingToast = showLoading("deleting release note...");

    try {
      await axios.delete(`/api/patch-notes/${noteToDelete.id}`);

      dismissToast(loadingToast);
      toasts.draftDeleted();

      // Refresh the list
      await fetchReleaseNotes();

      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.response?.data?.error || "Failed to delete release note");
    } finally {
      setDeleting(false);
    }
  };

  const copyReleaseNoteLink = async (note) => {
    const releaseUrl = `${window.location.origin}/${project.projectSlug}#${note.id}`;

    try {
      await navigator.clipboard.writeText(releaseUrl);
      toasts.copied();
    } catch (error) {
      toasts.copyError();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderNotesList = (notes, type) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg text-neutral"></span>
        </div>
      );
    }

    if (notes.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl opacity-50 mb-4">
            {type === "drafts" ? "✏️" : "🚀"}
          </div>
          <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase opacity-70 mb-2">
            no {type} yet
          </h3>
          <p className="font-lora tracking-wide opacity-80 text-neutral lowercase max-w-md mx-auto">
            {type === "drafts"
              ? "create release notes from commits to see drafts here."
              : "publish your first release note to see it here."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-base-100 border-1 border-neutral rounded-sm p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-raleway font-extrabold tracking-tighter text-lg">
                  {note.title} {/* Keep user content in original case */}
                </h3>
                <p className="font-space tracking-normal opacity-60 text-neutral lowercase text-sm">
                  {type === "published"
                    ? `published ${formatDate(note.publishedAt)}`
                    : `last edited ${formatDate(note.updatedAt)}`}
                </p>
              </div>
              <span
                className={`badge ${type === "drafts" ? "badge-secondary" : "badge-secondary"} font-space tracking-normal lowercase border-1 border-neutral`}
              >
                {type === "drafts" ? "draft" : "published"}
              </span>
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm mb-4 line-clamp-2">
              {note.content}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Link
                  href={`/edit/${note.id}`}
                  className="btn btn-primary btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                >
                  {type === "drafts" ? "continue editing" : "edit"}
                </Link>
                {type === "published" && (
                  <button
                    onClick={() => copyReleaseNoteLink(note)}
                    className="btn btn-secondary btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                  >
                    copy link
                  </button>
                )}
                <button
                  onClick={() => {
                    setNoteToDelete(note);
                    setShowDeleteModal(true);
                  }}
                  className="btn btn-error btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                >
                  delete
                </button>
              </div>
              <span className="font-space tracking-normal text-xs lowercase opacity-60">
                {note.commits?.length || 0} commits selected
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase">
          release notes
        </h3>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="notes_tabs"
          className="tab font-raleway lowercase font-extrabold"
          aria-label={`drafts (${drafts.length})`}
          checked={activeTab === "drafts"}
          onChange={() => setActiveTab("drafts")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-4">
          {renderNotesList(drafts, "drafts")}
        </div>

        <input
          type="radio"
          name="notes_tabs"
          className="tab font-raleway lowercase font-extrabold"
          aria-label={`published (${published.length})`}
          checked={activeTab === "published"}
          onChange={() => setActiveTab("published")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-4">
          {renderNotesList(published, "published")}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleDeleteNote}
        title="delete release note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        confirmText="delete"
        type="error"
        loading={deleting}
      />
    </div>
  );
}
