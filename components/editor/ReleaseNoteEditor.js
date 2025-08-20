"use client";
// Release note editor component with markdown editing and preview
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ReleaseNoteEditor({ patchNote, project, session }) {
  const [content, setContent] = useState(patchNote.content || "");
  const [title, setTitle] = useState(patchNote.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (content !== patchNote.content || title !== patchNote.title) {
        if (isSaving) return;
        
        setIsSaving(true);
        try {
          const response = await axios.put(`/api/patch-notes/${patchNote._id}`, {
            title,
            content,
            status: 'draft'
          });

          if (response.data.success) {
            setLastSaved(new Date());
          }
        } catch (error) {
          console.error("❌ Error auto-saving draft:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [content, title, patchNote.content, patchNote.title, patchNote._id, isSaving]);

  const handleSave = useCallback(async (showMessage = true) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/patch-notes/${patchNote._id}`, {
        title,
        content,
        status: 'draft'
      });

      if (response.data.success) {
        setLastSaved(new Date());
        if (showMessage) {
          alert("Draft saved successfully!");
        }
      }
    } catch (error) {
      console.error("❌ Error saving draft:", error);
      if (showMessage) {
        alert("Failed to save draft. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }, [patchNote._id, title, content, isSaving, setLastSaved]);

  const handlePublish = async () => {
    if (isPublishing) return;
    
    const confirmPublish = confirm(
      "Are you sure you want to publish this release note? It will be visible on your public changelog."
    );
    
    if (!confirmPublish) return;

    setIsPublishing(true);
    try {
      const response = await axios.put(`/api/patch-notes/${patchNote._id}`, {
        title,
        content,
        status: 'published'
      });

      if (response.data.success) {
        // Wait a moment to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        alert("Release notes published successfully!");
        
        // Wait another moment before redirect to ensure alert is processed
        setTimeout(() => {
          window.location.href = `/${project.projectSlug}`;
        }, 100);
      }
    } catch (error) {
      console.error("❌ Error publishing release notes:", error);
      alert("Failed to publish release notes. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const formatMarkdownPreview = (markdown) => {
    // Simple markdown to HTML conversion for preview
    return markdown
      .replace(/^# (.+)$/gm, '<h1 class="font-raleway font-black tracking-tighter text-3xl mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="font-raleway font-bold text-xl tracking-tighter mb-3 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="font-raleway font-bold text-lg tracking-tighter mb-2 mt-4">$1</h3>')
      .replace(/^\* (.+)$/gm, '<li class="font-lora tracking-tighter opacity-80 text-neutral mb-1">$1</li>')
      .replace(/^- (.+)$/gm, '<li class="font-lora tracking-tighter opacity-80 text-neutral mb-1">$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="font-space tracking-tighter bg-base-200 px-1 rounded">$1</code>')
      .replace(/\n\n/g, '</p><p class="font-lora tracking-tighter opacity-80 text-neutral mb-4">')
      .replace(/^(?!<[h|l])/gm, '<p class="font-lora tracking-tighter opacity-80 text-neutral mb-4">')
      .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4">$1</ul>')
      .replace(/<\/li><li/g, '</li><li');
  };

  return (
    <div className="space-y-6">
      {/* Editor Controls */}
      <div className="border border-neutral rounded-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-raleway font-bold text-xl tracking-tighter">
            editor
          </h2>
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter"
              >
                {showPreview ? "edit" : "preview"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="btn btn-secondary btn-sm font-raleway font-bold tracking-tighter"
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    saving...
                  </>
                ) : (
                  "save draft"
                )}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || patchNote.status === 'published'}
                className="btn btn-primary btn-sm font-raleway font-bold tracking-tighter"
              >
                {isPublishing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    publishing...
                  </>
                ) : patchNote.status === 'published' ? (
                  "published"
                ) : (
                  "publish"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Title Editor */}
        <div className="mb-4">
          <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
            title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full font-raleway"
            placeholder="Release notes title..."
          />
        </div>

        {/* Content Editor/Preview */}
        <div className="grid grid-cols-1 gap-4">
          {showPreview ? (
            <div className="border border-neutral rounded-sm p-4 min-h-96 bg-base-50">
              <h3 className="font-raleway font-bold tracking-tighter mb-4">preview</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdownPreview(content) 
                }}
              />
            </div>
          ) : (
            <div>
              <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                content (markdown supported)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-bordered w-full h-96 font-space text-sm"
                placeholder="Write your release notes here... You can use markdown formatting."
              />
              <div className="mt-2 text-sm opacity-60 font-space tracking-tighter">
                tip: use markdown syntax like # headings, **bold**, *italic*, - lists, etc.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Commit Information */}
      <div className="border border-neutral rounded-sm p-4">
        <h3 className="font-raleway font-bold text-xl tracking-tighter mb-4">
          included commits
        </h3>
        <div className="space-y-2">
          {patchNote.commits && patchNote.commits.length > 0 ? (
            patchNote.commits.map((commitSha, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                  {commitSha.substring(0, 7)}
                </span>
                <a
                  href={`${project.repositoryUrl}/commit/${commitSha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-space tracking-tighter text-sm opacity-80 text-neutral hover:opacity-100"
                >
                  view on github
                </a>
              </div>
            ))
          ) : (
            <p className="font-lora tracking-tighter opacity-80 text-neutral">
              no commits associated with this release note
            </p>
          )}
        </div>
      </div>
    </div>
  );
}