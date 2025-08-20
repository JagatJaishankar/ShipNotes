"use client";
// Client-side dashboard component for managing projects
import { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";

export default function DashboardClient({ session }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data.projects);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div>
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

        {isLoading ? (
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

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}