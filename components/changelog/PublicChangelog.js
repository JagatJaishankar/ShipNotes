"use client";
// Public changelog component for displaying published release notes to customers
import { useState, useEffect } from "react";

export default function PublicChangelog({ project, patchNotes }) {
  const [viewedNotes, setViewedNotes] = useState(new Set());

  // Track view counts when notes come into view
  useEffect(() => {
    const trackView = async (noteId) => {
      if (viewedNotes.has(noteId)) return;
      
      try {
        await fetch(`/api/patch-notes/${noteId}/view`, {
          method: 'POST',
        });
        setViewedNotes(prev => new Set([...prev, noteId]));
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    // Set up intersection observer to track when notes come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const noteId = entry.target.dataset.noteId;
            if (noteId) trackView(noteId);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all patch note elements
    document.querySelectorAll('[data-note-id]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [patchNotes, viewedNotes]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdown = (markdown) => {
    // Enhanced markdown to HTML conversion for customer-facing content
    return markdown
      // Headers
      .replace(/^# (.+)$/gm, '<h1 class="font-raleway font-black tracking-tighter text-3xl mb-6 text-primary">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="font-raleway font-bold text-2xl tracking-tighter mb-4 mt-8 text-secondary">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="font-raleway font-bold text-xl tracking-tighter mb-3 mt-6">$1</h3>')
      
      // Lists
      .replace(/^\* (.+)$/gm, '<li class="font-lora tracking-tighter opacity-90 text-neutral mb-2">$1</li>')
      .replace(/^- (.+)$/gm, '<li class="font-lora tracking-tighter opacity-90 text-neutral mb-2">$1</li>')
      
      // Text formatting
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="font-space tracking-tighter bg-base-200 px-2 py-1 rounded text-sm">$1</code>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="font-lora tracking-tighter opacity-80 text-neutral mb-4 leading-relaxed">')
      .replace(/^(?!<[h|l|p])/gm, '<p class="font-lora tracking-tighter opacity-80 text-neutral mb-4 leading-relaxed">')
      
      // Lists containers
      .replace(/(<li.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-6 space-y-1 ml-4">$1</ul>')
      .replace(/<\/li><li/g, '</li><li');
  };

  if (!patchNotes || patchNotes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="border border-neutral rounded-sm p-8 bg-base-50">
          <h2 className="font-raleway font-bold text-2xl tracking-tighter mb-4 opacity-60">
            no release notes yet
          </h2>
          <p className="font-lora tracking-tighter opacity-60 text-neutral max-w-md mx-auto">
            this changelog will be updated when new features and improvements are released.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-raleway font-black tracking-tighter text-3xl mb-4">
          changelog
        </h2>
        <p className="font-lora tracking-tighter opacity-80 text-neutral">
          {patchNotes.length} release{patchNotes.length !== 1 ? 's' : ''} published
        </p>
      </div>

      {/* Release Notes */}
      <div className="space-y-12">
        {patchNotes.map((note) => (
          <article
            key={note._id}
            data-note-id={note._id}
            className="border border-neutral rounded-sm p-8 bg-base-50 hover:bg-base-100 transition-colors"
          >
            {/* Release Header */}
            <header className="mb-6 pb-4 border-b border-neutral">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-raleway font-black tracking-tighter text-2xl">
                  {note.title}
                </h3>
                <time className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                  {formatDate(note.publishedAt)}
                </time>
              </div>
              
              {/* Version/Status Badge */}
              <div className="flex items-center space-x-3 mt-3">
                <span className="badge badge-success font-raleway font-bold tracking-tighter">
                  published
                </span>
                {note.version && (
                  <span className="badge badge-outline font-space tracking-tighter text-xs">
                    {note.version}
                  </span>
                )}
              </div>
            </header>

            {/* Release Content */}
            <div 
              className="prose prose-lg max-w-none release-content"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(note.content) 
              }}
            />

            {/* Release Footer */}
            <footer className="mt-8 pt-4 border-t border-neutral">
              <div className="flex justify-between items-center text-sm opacity-60">
                <span className="font-space tracking-tighter">
                  {note.commits?.length || 0} commit{note.commits?.length !== 1 ? 's' : ''} included
                </span>
                {note.viewCount > 0 && (
                  <span className="font-space tracking-tighter">
                    {note.viewCount} view{note.viewCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </footer>
          </article>
        ))}
      </div>

      {/* Archive Notice */}
      {patchNotes.length > 5 && (
        <div className="text-center pt-8 border-t border-neutral">
          <p className="font-lora tracking-tighter opacity-60 text-neutral">
            showing all {patchNotes.length} releases
          </p>
        </div>
      )}
    </div>
  );
}