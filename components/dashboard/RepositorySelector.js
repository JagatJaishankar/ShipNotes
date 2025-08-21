"use client";
// Simple repository selector component
import { useState, useEffect } from "react";
import axios from "axios";
import { showError } from "@/lib/toast";

export default function RepositorySelector({ onRepositorySelect, selectedRepository, disabled = false }) {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/github/repositories");
      setRepositories(response.data.repositories || []);
    } catch (error) {
      console.error("❌ Error fetching repositories:", error);
      showError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepository = (repo) => {
    onRepositorySelect({
      fullName: repo.fullName,
      htmlUrl: repo.htmlUrl,
      description: repo.description,
      isPrivate: repo.isPrivate,
    });
    setShowDropdown(false);
  };

  return (
    <div className="space-y-4">
      <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
        select repository
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
          className="input input-bordered w-full text-left flex items-center justify-between"
          disabled={disabled}
        >
          <span className="font-space text-sm">
            {selectedRepository ? selectedRepository.fullName : "choose a repository..."}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-base-100 border border-neutral rounded-sm shadow-lg max-h-screen overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : repositories.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-lora text-sm opacity-60">no repositories found</p>
              </div>
            ) : (
              repositories.slice(0, 50).map((repo) => (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => handleSelectRepository(repo)}
                  className="w-full p-4 hover:bg-base-200 text-left border-b border-neutral/20 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{repo.isPrivate ? "🔒" : "📁"}</span>
                    <div className="flex-1">
                      <p className="font-space text-base font-bold">
                        {repo.fullName}
                      </p>
                      {repo.description && (
                        <p className="font-lora text-sm opacity-60 mt-1">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedRepository && (
        <div className="border border-success rounded-sm p-3 bg-success/5">
          <div className="flex items-center space-x-2">
            <span>{selectedRepository.isPrivate ? "🔒" : "📁"}</span>
            <div>
              <p className="font-space text-sm font-bold text-success">
                {selectedRepository.fullName}
              </p>
              {selectedRepository.description && (
                <p className="font-lora text-xs opacity-80">
                  {selectedRepository.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}