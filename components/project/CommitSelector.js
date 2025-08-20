"use client";
// Component for selecting commits to include in release notes
import { useState } from "react";

export default function CommitSelector({ 
  commits, 
  selectedCommits, 
  onCommitToggle, 
  isLoading, 
  onRefresh 
}) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll || selectedCommits.length === commits.length) {
      // Deselect all
      selectedCommits.forEach(commit => onCommitToggle(commit));
      setSelectAll(false);
    } else {
      // Select all unselected commits
      commits.forEach(commit => {
        const isSelected = selectedCommits.some(c => c.sha === commit.sha);
        if (!isSelected) {
          onCommitToggle(commit);
        }
      });
      setSelectAll(true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCommitSelected = (commit) => {
    return selectedCommits.some(c => c.sha === commit.sha);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-lora tracking-tighter opacity-80 text-neutral mb-4">
          no commits found in the selected time range.
        </p>
        <button
          onClick={onRefresh}
          className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter"
        >
          refresh commits
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Select All Controls */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedCommits.length === commits.length}
            onChange={handleSelectAll}
            className="checkbox checkbox-primary"
          />
          <span className="font-raleway font-bold tracking-tighter">
            select all ({commits.length} commits)
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="btn btn-ghost btn-sm font-raleway font-bold tracking-tighter"
        >
          refresh
        </button>
      </div>

      {/* Commits List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {commits.map((commit) => (
          <div
            key={commit.sha}
            className={`border rounded-sm p-4 cursor-pointer transition-colors ${
              isCommitSelected(commit)
                ? "border-primary bg-primary bg-opacity-10"
                : "border-neutral hover:bg-base-200"
            }`}
            onClick={() => onCommitToggle(commit)}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isCommitSelected(commit)}
                onChange={() => onCommitToggle(commit)}
                className="checkbox checkbox-primary mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-lora tracking-tighter text-neutral font-medium mb-1">
                      {commit.message.split('\n')[0]} {/* First line only */}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-space tracking-tighter opacity-60">
                        {commit.author.name}
                      </span>
                      <span className="font-space tracking-tighter opacity-60">
                        {formatDate(commit.author.date)}
                      </span>
                      <a
                        href={commit.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-space tracking-tighter opacity-60 hover:opacity-100 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {commit.sha.substring(0, 7)}
                      </a>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  {commit.stats && (
                    <div className="flex items-center space-x-2 text-xs">
                      {commit.stats.additions > 0 && (
                        <span className="text-success font-space">
                          +{commit.stats.additions}
                        </span>
                      )}
                      {commit.stats.deletions > 0 && (
                        <span className="text-error font-space">
                          -{commit.stats.deletions}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Full commit message if multi-line */}
                {commit.message.split('\n').length > 1 && (
                  <details className="mt-2">
                    <summary className="font-space tracking-tighter text-xs opacity-60 cursor-pointer">
                      show full message
                    </summary>
                    <pre className="font-space tracking-tighter text-sm opacity-80 mt-2 whitespace-pre-wrap">
                      {commit.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-neutral">
        <p className="font-space tracking-tighter text-sm opacity-60 text-center">
          {selectedCommits.length} of {commits.length} commits selected
        </p>
      </div>
    </div>
  );
}