"use client";
// Component for managing drafts and published release notes
import { useState, useEffect } from "react";
import axios from "axios";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Link from "next/link";

export default function ReleaseNotesManager({ project }) {
  const [activeTab, setActiveTab] = useState("drafts");
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReleaseNotes();
  }, [project._id]);

  const fetchReleaseNotes = async () => {
    setLoading(true);
    try {
      // Fetch drafts
      const draftsResponse = await axios.get(`/api/patch-notes?status=draft&projectId=${project._id}`);
      setDrafts(draftsResponse.data.patchNotes || []);

      // Fetch published notes
      const publishedResponse = await axios.get(`/api/patch-notes?status=published&projectId=${project._id}`);
      setPublished(publishedResponse.data.patchNotes || []);
    } catch (error) {
      console.error("❌ Error fetching release notes:", error);
      showError("Failed to load release notes");
    } finally {
      setLoading(false);
    }
  };

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNotesList = (notes, type) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-lora text-sm opacity-60 mt-2">loading {type}...</p>
        </div>
      );
    }

    if (notes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="font-lora tracking-tighter opacity-60">
            no {type} found
          </p>
          {type === 'drafts' && (
            <p className="font-lora tracking-tighter text-xs opacity-40 mt-2">
              create release notes from commits to see drafts here
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-neutral rounded-sm p-4 hover:bg-base-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-raleway font-bold tracking-tighter text-lg">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="font-space text-xs opacity-60">
                    created: {formatDate(note.createdAt)}
                  </p>
                  {note.updatedAt !== note.createdAt && (
                    <p className="font-space text-xs opacity-60">
                      updated: {formatDate(note.updatedAt)}
                    </p>
                  )}
                  {note.publishedAt && (
                    <p className="font-space text-xs opacity-60">
                      published: {formatDate(note.publishedAt)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`badge ${type === 'drafts' ? 'badge-warning' : 'badge-success'} badge-sm`}>
                  {type === 'drafts' ? 'draft' : 'published'}
                </span>
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-3">
              <p className="font-lora text-sm opacity-80 line-clamp-3">
                {note.content.substring(0, 200)}
                {note.content.length > 200 && "..."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  href={`/edit/${note.id}`}
                  className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
                >
                  {type === 'drafts' ? 'continue editing' : 'edit'}
                </Link>
                {type === 'published' && (
                  <button
                    onClick={() => copyReleaseNoteLink(note)}
                    className="btn btn-secondary btn-sm font-raleway tracking-tighter"
                  >
                    copy link
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setNoteToDelete(note);
                  setShowDeleteModal(true);
                }}
                className="btn btn-error btn-sm font-raleway tracking-tighter"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-neutral rounded-sm p-6">
      <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
        release notes
      </h2>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        <button
          onClick={() => setActiveTab("drafts")}
          className={`tab ${activeTab === "drafts" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          drafts ({drafts.length})
        </button>
        <button
          onClick={() => setActiveTab("published")}
          className={`tab ${activeTab === "published" ? "tab-active" : ""} font-raleway font-bold tracking-tighter`}
        >
          published ({published.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "drafts" && renderNotesList(drafts, "drafts")}
      {activeTab === "published" && renderNotesList(published, "published")}

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