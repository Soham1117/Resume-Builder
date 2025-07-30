import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  FolderOpen,
  X,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { apiService } from "../../services/api";
import type { NormalizedProject } from "../../types";

interface ProjectFormProps {
  projects: NormalizedProject[];
  onChange: (projects: NormalizedProject[]) => void;
  onAutoSave?: (projects: NormalizedProject[]) => void;
  onLoad?: (projects: NormalizedProject[]) => void;
  onSaveComplete?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NormalizedProject>>({
    bullets: [],
    technologiesList: [],
  });
  const [newBulletPoint, setNewBulletPoint] = useState("");
  const [newTechnology, setNewTechnology] = useState("");

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const handleAdd = () => {
    const newProject: Partial<NormalizedProject> = {
      title: "",
      technologies: "",
      link: "",
      priority: projects.length + 1,
      bullets: [],
      technologiesList: [],
    };
    setEditingId(-1); // Temporary ID for new items
    setFormData(newProject);
    setIsAddingNew(true);
  };

  const handleEdit = (item: NormalizedProject) => {
    setEditingId(item.id!);
    setFormData({ ...item });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingId || !formData.title) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const projectData: Partial<NormalizedProject> = {
        title: formData.title,
        technologies: formData.technologies || "",
        link: formData.link || "",
        priority: formData.priority || projects.length + 1,
        bullets: formData.bullets || [],
        technologiesList: formData.technologiesList || [],
      };

      let savedProject: NormalizedProject;

      if (isAddingNew) {
        savedProject = await apiService.saveProject(
          projectData as NormalizedProject
        );
        const updatedProjects = [...projects, savedProject];
        onChange(updatedProjects);
        if (onAutoSave) {
          onAutoSave(updatedProjects);
        }
      } else {
        savedProject = await apiService.saveProject({
          ...projectData,
          id: editingId,
        } as NormalizedProject);
        const updatedProjects = projects.map((item) =>
          item.id === editingId ? savedProject : item
        );
        onChange(updatedProjects);
        if (onAutoSave) {
          onAutoSave(updatedProjects);
        }
      }

      setEditingId(null);
      setFormData({ bullets: [], technologiesList: [] });
      setIsAddingNew(false);
      
      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ bullets: [], technologiesList: [] });
    setIsAddingNew(false);
    setNewBulletPoint("");
    setNewTechnology("");
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      setError(null);
      await apiService.deleteProject(id);
      const updatedProjects = projects.filter((item) => item.id !== id);
      onChange(updatedProjects);
      if (onAutoSave) {
        onAutoSave(updatedProjects);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof NormalizedProject, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddBulletPoint = async () => {
    if (!newBulletPoint.trim() || !editingId) return;

    try {
      const bulletData = {
        bulletText: newBulletPoint.trim(),
        orderIndex: (formData.bullets?.length || 0) + 1,
      };

      if (isAddingNew) {
        // For new projects, add to local state
        const updatedBullets = [...(formData.bullets || []), bulletData];
        setFormData((prev) => ({ ...prev, bullets: updatedBullets }));
      } else {
        // For existing projects, save to database
        const savedBullet = await apiService.addBulletToProject(
          editingId,
          bulletData.bulletText,
          bulletData.orderIndex
        );
        const updatedBullets = [...(formData.bullets || []), savedBullet];
        setFormData((prev) => ({ ...prev, bullets: updatedBullets }));
      }

      setNewBulletPoint("");
    } catch (err) {
      console.error("Error adding bullet point:", err);
      setError("Failed to add bullet point");
    }
  };

  const handleRemoveBulletPoint = async (bulletId: number) => {
    try {
      if (!isAddingNew && editingId) {
        await apiService.removeBulletFromProject(editingId, bulletId);
      }
      const updatedBullets =
        formData.bullets?.filter((bullet) => bullet.id !== bulletId) || [];
      setFormData((prev) => ({ ...prev, bullets: updatedBullets }));
    } catch (err) {
      console.error("Error removing bullet point:", err);
      setError("Failed to remove bullet point");
    }
  };

  const handleAddTechnology = async () => {
    if (!newTechnology.trim() || !editingId) return;

    try {
      if (isAddingNew) {
        // For new projects, add to local state
        const technologyData = { technology: newTechnology.trim() };
        const updatedTechnologies = [
          ...(formData.technologiesList || []),
          technologyData,
        ];
        setFormData((prev) => ({
          ...prev,
          technologiesList: updatedTechnologies,
        }));
      } else {
        // For existing projects, save to database
        const savedTechnology = await apiService.addTechnologyToProject(
          editingId,
          newTechnology.trim()
        );
        const updatedTechnologies = [
          ...(formData.technologiesList || []),
          savedTechnology,
        ];
        setFormData((prev) => ({
          ...prev,
          technologiesList: updatedTechnologies,
        }));
      }

      setNewTechnology("");
    } catch (err) {
      console.error("Error adding technology:", err);
      setError("Failed to add technology");
    }
  };

  const handleRemoveTechnology = async (technologyId: number) => {
    try {
      if (!isAddingNew && editingId) {
        await apiService.removeTechnologyFromProject(editingId, technologyId);
      }
      const updatedTechnologies =
        formData.technologiesList?.filter((tech) => tech.id !== technologyId) ||
        [];
      setFormData((prev) => ({
        ...prev,
        technologiesList: updatedTechnologies,
      }));
    } catch (err) {
      console.error("Error removing technology:", err);
      setError("Failed to remove technology");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {projects.length === 0 && !editingId ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">No projects yet</p>
            <p className="text-xs text-gray-400">
              Click "Add Project" to get started
            </p>
          </div>
        ) : (
          <>
            {/* Add new project form */}
            {editingId === -1 && (
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Project
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title *
                      </label>
                      <Input
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g., E-commerce Platform"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Link
                      </label>
                      <Input
                        type="url"
                        value={formData.link || ""}
                        onChange={(e) => handleChange("link", e.target.value)}
                        placeholder="https://github.com/username/project"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <Input
                      value={formData.technologies || ""}
                      onChange={(e) =>
                        handleChange("technologies", e.target.value)
                      }
                      placeholder="e.g., React, Node.js, MongoDB"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Features & Description
                    </label>
                    <div className="space-y-2">
                      {formData.bullets?.map((bullet, index) => (
                        <div
                          key={bullet.id || index}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-gray-400">•</span>
                          <span className="flex-1 text-sm">
                            {bullet.bulletText}
                          </span>
                          <button
                            onClick={() => handleRemoveBulletPoint(bullet.id!)}
                            disabled={saving}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          value={newBulletPoint}
                          onChange={(e) => setNewBulletPoint(e.target.value)}
                          placeholder="Add a feature or description"
                          onKeyPress={(e) =>
                            handleKeyPress(e, handleAddBulletPoint)
                          }
                          disabled={saving}
                        />
                        <button
                          onClick={handleAddBulletPoint}
                          disabled={saving || !newBulletPoint.trim()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology Tags
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {formData.technologiesList?.map((tech, index) => (
                          <span
                            key={tech.id || index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {tech.technology}
                            <button
                              onClick={() => handleRemoveTechnology(tech.id!)}
                              disabled={saving}
                              className="ml-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          placeholder="Add a technology"
                          onKeyPress={(e) =>
                            handleKeyPress(e, handleAddTechnology)
                          }
                          disabled={saving}
                        />
                        <button
                          onClick={handleAddTechnology}
                          disabled={saving || !newTechnology.trim()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !formData.title}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4" />
                      <span>Save Project</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show existing projects */}
            {projects.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group"
              >
                {editingId === item.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Title *
                        </label>
                        <Input
                          value={formData.title || ""}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          placeholder="e.g., E-commerce Platform"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Link
                        </label>
                        <Input
                          type="url"
                          value={formData.link || ""}
                          onChange={(e) => handleChange("link", e.target.value)}
                          placeholder="https://github.com/username/project"
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies Used
                      </label>
                      <Input
                        value={formData.technologies || ""}
                        onChange={(e) =>
                          handleChange("technologies", e.target.value)
                        }
                        placeholder="e.g., React, Node.js, MongoDB"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description & Features
                      </label>
                      <div className="space-y-2">
                        {formData.bullets?.map((bullet, index) => (
                          <div
                            key={bullet.id || index}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-gray-400">•</span>
                            <span className="flex-1 text-sm">
                              {bullet.bulletText}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveBulletPoint(bullet.id!)
                              }
                              disabled={saving}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            value={newBulletPoint}
                            onChange={(e) => setNewBulletPoint(e.target.value)}
                            placeholder="Add a feature or description"
                            onKeyPress={(e) =>
                              handleKeyPress(e, handleAddBulletPoint)
                            }
                            disabled={saving}
                          />
                          <button
                            onClick={handleAddBulletPoint}
                            disabled={!newBulletPoint.trim() || saving}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Individual Technologies
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.technologiesList?.map((tech, index) => (
                          <span
                            key={tech.id || index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {tech.technology}
                            <button
                              onClick={() => handleRemoveTechnology(tech.id!)}
                              disabled={saving}
                              className="ml-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          placeholder="Add a technology"
                          onKeyPress={(e) =>
                            handleKeyPress(e, handleAddTechnology)
                          }
                          disabled={saving}
                        />
                        <button
                          onClick={handleAddTechnology}
                          disabled={!newTechnology.trim() || saving}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || !formData.title}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {item.technologies && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.technologies}
                        </p>
                      )}
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="text-sm text-gray-600 space-y-1 mb-2">
                          {item.bullets.slice(0, 3).map((bullet, index) => (
                            <li
                              key={bullet.id || index}
                              className="flex items-start"
                            >
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{bullet.bulletText}</span>
                            </li>
                          ))}
                          {item.bullets.length > 3 && (
                            <li className="text-gray-500 text-xs">
                              +{item.bullets.length - 3} more features
                            </li>
                          )}
                        </ul>
                      )}
                      {item.technologiesList &&
                        item.technologiesList.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.technologiesList
                              .slice(0, 5)
                              .map((tech, index) => (
                                <span
                                  key={tech.id || index}
                                  className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                                >
                                  {tech.technology}
                                </span>
                              ))}
                            {item.technologiesList.length > 5 && (
                              <span className="text-gray-500 text-xs">
                                +{item.technologiesList.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        disabled={saving}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        disabled={saving}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
};

export default ProjectForm;
