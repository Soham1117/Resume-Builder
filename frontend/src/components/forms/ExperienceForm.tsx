import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Briefcase, X, Save, Loader2 } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { apiService } from "../../services/api";
import type { NormalizedExperience } from "../../types";

interface ExperienceFormProps {
  experiences: NormalizedExperience[];
  onChange: (experiences: NormalizedExperience[]) => void;
  onAutoSave?: (experiences: NormalizedExperience[]) => void;
  onLoad?: (experiences: NormalizedExperience[]) => void;
  onSaveComplete?: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NormalizedExperience>>({
    bullets: [],
    technologies: [],
  });
  const [newBulletPoint, setNewBulletPoint] = useState("");
  const [newBulletLink, setNewBulletLink] = useState("");
  const [newTechnology, setNewTechnology] = useState("");

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const handleAdd = () => {
    const newExperience: Partial<NormalizedExperience> = {
      title: "",
      company: "",
      location: "",
      dateRange: "",
      description: "",
      priority: experiences.length + 1,
      bullets: [],
      technologies: [],
    };
    setEditingId(-1); // Temporary ID for new items
    setFormData(newExperience);
    setIsAddingNew(true);
  };

  const handleEdit = (item: NormalizedExperience) => {
    setEditingId(item.id!);

    // Parse existing bullets to extract links
    const parsedBullets =
      item.bullets?.map((bullet) => {
        // Check if bullet text contains link indicator
        if (bullet.bulletText && bullet.bulletText.includes("[LINK:")) {
          const linkMatch = bullet.bulletText.match(/\[LINK:\s*([^\]]+)\]/);
          if (linkMatch) {
            const link = linkMatch[1].trim();
            const textWithoutLink = bullet.bulletText
              .replace(/\[LINK:\s*[^\]]+\]/, "")
              .trim();
            return {
              ...bullet,
              bulletText: textWithoutLink,
              link: link,
            };
          }
        }
        return bullet;
      }) || [];

    setFormData({
      ...item,
      bullets: parsedBullets,
    });
    setIsAddingNew(false);
    // Clear the input fields when editing
    setNewBulletPoint("");
    setNewBulletLink("");
    setNewTechnology("");
  };

  const handleSave = async () => {
    if (
      !editingId ||
      !formData.title ||
      !formData.company ||
      !formData.dateRange
    ) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const experienceData: Partial<NormalizedExperience> = {
        title: formData.title,
        company: formData.company,
        location: formData.location || "",
        dateRange: formData.dateRange,
        description: formData.description || "",
        priority: formData.priority || experiences.length + 1,
        bullets: formData.bullets || [],
        technologies: formData.technologies || [],
      };

      let savedExperience: NormalizedExperience;

      if (isAddingNew) {
        savedExperience = await apiService.saveExperience(
          experienceData as NormalizedExperience
        );
        const updatedExperiences = [...experiences, savedExperience];
        onChange(updatedExperiences);
        if (onAutoSave) {
          onAutoSave(updatedExperiences);
        }
      } else {
        savedExperience = await apiService.saveExperience({
          ...experienceData,
          id: editingId,
        } as NormalizedExperience);
        const updatedExperiences = experiences.map((item) =>
          item.id === editingId ? savedExperience : item
        );
        onChange(updatedExperiences);
        if (onAutoSave) {
          onAutoSave(updatedExperiences);
        }
      }

      setEditingId(null);
      setFormData({ bullets: [], technologies: [] });
      setIsAddingNew(false);

      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving experience:", err);
      setError("Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ bullets: [], technologies: [] });
    setIsAddingNew(false);
    setNewBulletPoint("");
    setNewBulletLink("");
    setNewTechnology("");
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      setError(null);
      await apiService.deleteExperience(id);
      const updatedExperiences = experiences.filter((item) => item.id !== id);
      onChange(updatedExperiences);
      if (onAutoSave) {
        onAutoSave(updatedExperiences);
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
      setError("Failed to delete experience");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof NormalizedExperience, value: string) => {
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
        link: newBulletLink.trim() || undefined,
      };

      if (isAddingNew) {
        // For new experiences, add to local state
        const updatedBullets = [...(formData.bullets || []), bulletData];
        setFormData((prev) => ({ ...prev, bullets: updatedBullets }));
      } else {
        // For existing experiences, save to database
        const savedBullet = await apiService.addBulletToExperience(
          editingId,
          bulletData.bulletText,
          bulletData.orderIndex,
          bulletData.link
        );
        const updatedBullets = [...(formData.bullets || []), savedBullet];
        setFormData((prev) => ({ ...prev, bullets: updatedBullets }));
      }

      setNewBulletPoint("");
      setNewBulletLink("");
    } catch (err) {
      console.error("Error adding bullet point:", err);
      setError("Failed to add bullet point");
    }
  };

  const handleRemoveBulletPoint = async (bulletId: number) => {
    try {
      if (!isAddingNew && editingId) {
        await apiService.removeBulletFromExperience(editingId, bulletId);
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
        // For new experiences, add to local state
        const technologyData = { technology: newTechnology.trim() };
        const updatedTechnologies = [
          ...(formData.technologies || []),
          technologyData,
        ];
        setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
      } else {
        // For existing experiences, save to database
        const savedTechnology = await apiService.addTechnologyToExperience(
          editingId,
          newTechnology.trim()
        );
        const updatedTechnologies = [
          ...(formData.technologies || []),
          savedTechnology,
        ];
        setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
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
        await apiService.removeTechnologyFromExperience(
          editingId,
          technologyId
        );
      }
      const updatedTechnologies =
        formData.technologies?.filter((tech) => tech.id !== technologyId) || [];
      setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
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
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {experiences.length === 0 && !editingId ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">No work experience yet</p>
            <p className="text-xs text-gray-400">
              Click "Add Experience" to get started
            </p>
          </div>
        ) : (
          <>
            {/* Add new experience form */}
            {editingId === -1 && (
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Experience
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <Input
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                      </label>
                      <Input
                        value={formData.company || ""}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                        placeholder="e.g., Google"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={formData.location || ""}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        placeholder="e.g., San Francisco, CA"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range *
                      </label>
                      <Input
                        value={formData.dateRange || ""}
                        onChange={(e) =>
                          handleChange("dateRange", e.target.value)
                        }
                        placeholder="e.g., Jan 2022 - Present"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Brief description of your role and responsibilities"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      rows={3}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Achievements & Responsibilities
                    </label>
                    <div className="space-y-2">
                      {formData.bullets?.map((bullet, index) => (
                        <div
                          key={bullet.id || index}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-gray-400 mt-1">•</span>
                          <div className="flex-1">
                            <span className="text-sm">{bullet.bulletText}</span>
                            {bullet.link && (
                              <div className="mt-1">
                                <a
                                  href={bullet.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                                >
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  View Project
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() =>
                                handleRemoveBulletPoint(bullet.id!)
                              }
                              disabled={saving}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 mt-1"
                              title="Remove bullet point"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={newBulletPoint}
                            onChange={(e) => setNewBulletPoint(e.target.value)}
                            placeholder="Add a key achievement or responsibility"
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
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">
                            Project Link (optional)
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              value={newBulletLink}
                              onChange={(e) => setNewBulletLink(e.target.value)}
                              placeholder="https://github.com/username/project"
                              disabled={saving}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technologies Used
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies?.map((tech, index) => (
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
                      disabled={
                        saving ||
                        !formData.title ||
                        !formData.company ||
                        !formData.dateRange
                      }
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4" />
                      <span>Save Experience</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show existing experiences */}
            {experiences.map((item) => (
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
                          Job Title *
                        </label>
                        <Input
                          value={formData.title || ""}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          placeholder="e.g., Senior Software Engineer"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company *
                        </label>
                        <Input
                          value={formData.company || ""}
                          onChange={(e) =>
                            handleChange("company", e.target.value)
                          }
                          placeholder="e.g., Google"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Input
                          value={formData.location || ""}
                          onChange={(e) =>
                            handleChange("location", e.target.value)
                          }
                          placeholder="e.g., San Francisco, CA"
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Range *
                        </label>
                        <Input
                          value={formData.dateRange || ""}
                          onChange={(e) =>
                            handleChange("dateRange", e.target.value)
                          }
                          placeholder="e.g., Jan 2022 - Present"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ""}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="Brief description of your role and responsibilities"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        rows={3}
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Achievements & Responsibilities
                      </label>
                      <div className="space-y-2">
                        {formData.bullets?.map((bullet, index) => (
                          <div
                            key={bullet.id || index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-gray-400 mt-1">•</span>
                            <div className="flex-1">
                              <span className="text-sm">
                                {bullet.bulletText}
                              </span>
                              {bullet.link && (
                                <div className="mt-1">
                                  <a
                                    href={bullet.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                                  >
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    View Project
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() =>
                                  handleRemoveBulletPoint(bullet.id!)
                                }
                                disabled={saving}
                                className="text-red-500 hover:text-red-700 disabled:opacity-50 mt-1"
                                title="Remove bullet point"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              value={newBulletPoint}
                              onChange={(e) =>
                                setNewBulletPoint(e.target.value)
                              }
                              placeholder="Add a key achievement or responsibility"
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
                          <div className="space-y-1">
                            <label className="block text-xs text-gray-600">
                              Project Link (optional)
                            </label>
                            <div className="flex space-x-2">
                              <Input
                                value={newBulletLink}
                                onChange={(e) =>
                                  setNewBulletLink(e.target.value)
                                }
                                placeholder="https://github.com/username/project"
                                disabled={saving}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies Used
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.technologies?.map((tech, index) => (
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
                        disabled={
                          saving ||
                          !formData.title ||
                          !formData.company ||
                          !formData.dateRange
                        }
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
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{item.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <span>{item.dateRange}</span>
                        {item.location && (
                          <>
                            <span>•</span>
                            <span>{item.location}</span>
                          </>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
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
                              <div className="flex-1">
                                <span>{bullet.bulletText}</span>
                                {bullet.link && (
                                  <div className="mt-1">
                                    <a
                                      href={bullet.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                                    >
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      View Project
                                    </a>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                          {item.bullets.length > 3 && (
                            <li className="text-gray-500 text-xs">
                              +{item.bullets.length - 3} more achievements
                            </li>
                          )}
                        </ul>
                      )}
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.slice(0, 5).map((tech, index) => (
                            <span
                              key={tech.id || index}
                              className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              {tech.technology}
                            </span>
                          ))}
                          {item.technologies.length > 5 && (
                            <span className="text-gray-500 text-xs">
                              +{item.technologies.length - 5} more
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

export default ExperienceForm;
