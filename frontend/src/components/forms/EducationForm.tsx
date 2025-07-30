import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  GraduationCap,
  Save,
  Loader2,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { apiService } from "../../services/api";
import type { NormalizedEducation } from "../../types";

interface EducationFormProps {
  education: NormalizedEducation[];
  onChange: (education: NormalizedEducation[]) => void;
  onAutoSave?: (education: NormalizedEducation[]) => void;
  onLoad?: (education: NormalizedEducation[]) => void;
  onSaveComplete?: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NormalizedEducation>>({});

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const handleAdd = () => {
    const newEducation: Partial<NormalizedEducation> = {
      degree: "",
      institution: "",
      dateRange: "",
      gpa: "",
      location: "",
    };
    setEditingId(-1); // Temporary ID for new items
    setFormData(newEducation);
  };

  const handleEdit = (item: NormalizedEducation) => {
    setEditingId(item.id!);
    setFormData(item);
  };

  const handleSave = async () => {
    if (!editingId || !formData.degree || !formData.institution) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const educationData: Partial<NormalizedEducation> = {
        degree: formData.degree,
        institution: formData.institution,
        dateRange: formData.dateRange || "",
        gpa: formData.gpa || "",
        location: formData.location || "",
      };

      let savedEducation: NormalizedEducation;

      if (editingId === -1) {
        // Adding new education
        savedEducation = await apiService.saveEducation(
          educationData as NormalizedEducation
        );
        const updatedEducation = [...education, savedEducation];
        onChange(updatedEducation);
        if (onAutoSave) {
          onAutoSave(updatedEducation);
        }
      } else {
        // Updating existing education
        savedEducation = await apiService.saveEducation({
          ...educationData,
          id: editingId,
        } as NormalizedEducation);
        const updatedEducation = education.map((item) =>
          item.id === editingId ? savedEducation : item
        );
        onChange(updatedEducation);
        if (onAutoSave) {
          onAutoSave(updatedEducation);
        }
      }

      setEditingId(null);
      setFormData({});
      
      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving education:", err);
      setError("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      setError(null);
      await apiService.deleteEducation(id);
      const updatedEducation = education.filter((item) => item.id !== id);
      onChange(updatedEducation);
      if (onAutoSave) {
        onAutoSave(updatedEducation);
      }
    } catch (err) {
      console.error("Error deleting education:", err);
      setError("Failed to delete education");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof NormalizedEducation, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              No education entries yet
            </p>
            <p className="text-xs text-gray-400">
              Click "Add Education" to get started
            </p>
          </div>
        ) : (
          <>
            {/* Add new education form */}
            {editingId === -1 && (
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Education
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                      </label>
                      <Input
                        value={formData.degree || ""}
                        onChange={(e) => handleChange("degree", e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution *
                      </label>
                      <Input
                        value={formData.institution || ""}
                        onChange={(e) =>
                          handleChange("institution", e.target.value)
                        }
                        placeholder="e.g., University of California, Berkeley"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <Input
                        value={formData.dateRange || ""}
                        onChange={(e) =>
                          handleChange("dateRange", e.target.value)
                        }
                        placeholder="e.g., 2018 - 2022"
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
                        placeholder="e.g., Berkeley, CA"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GPA
                      </label>
                      <Input
                        value={formData.gpa || ""}
                        onChange={(e) => handleChange("gpa", e.target.value)}
                        placeholder="e.g., 3.8/4.0"
                        disabled={saving}
                      />
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
                        saving || !formData.degree || !formData.institution
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
                          <span>Save Education</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show existing education */}
            {education.map((item) => (
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
                          Degree *
                        </label>
                        <Input
                          value={formData.degree || ""}
                          onChange={(e) =>
                            handleChange("degree", e.target.value)
                          }
                          placeholder="e.g., Bachelor of Science in Computer Science"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution *
                        </label>
                        <Input
                          value={formData.institution || ""}
                          onChange={(e) =>
                            handleChange("institution", e.target.value)
                          }
                          placeholder="e.g., University of California, Berkeley"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Range
                        </label>
                        <Input
                          value={formData.dateRange || ""}
                          onChange={(e) =>
                            handleChange("dateRange", e.target.value)
                          }
                          placeholder="e.g., 2018 - 2022"
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
                          placeholder="e.g., Berkeley, CA"
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GPA
                        </label>
                        <Input
                          value={formData.gpa || ""}
                          onChange={(e) => handleChange("gpa", e.target.value)}
                          placeholder="e.g., 3.8/4.0"
                          disabled={saving}
                        />
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
                          saving || !formData.degree || !formData.institution
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">
                          {item.degree}
                        </h4>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={saving}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id!)}
                            disabled={saving}
                            className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-start gap-1">
                        <p className="text-sm text-gray-600 mb-1">
                          {item.institution}
                        </p>
                        {item.gpa && (
                          <span className="text-sm text-gray-600">
                            {" "}
                            &nbsp;•&nbsp; GPA: {item.gpa}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{item.dateRange}</span>
                        {item.location && (
                          <>
                            <span>•</span>
                            <span>{item.location}</span>
                          </>
                        )}
                      </div>
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

export default EducationForm;
