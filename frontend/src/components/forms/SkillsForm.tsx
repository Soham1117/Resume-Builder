import React, { useState, useEffect } from "react";
import { Plus, Code, X, Save, Loader2 } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { apiService } from "../../services/api";
import type { NormalizedSkill } from "../../types";

interface SkillsFormProps {
  skills: NormalizedSkill[];
  onChange: (skills: NormalizedSkill[]) => void;
  onAutoSave?: (skills: NormalizedSkill[]) => void;
  onLoad?: (skills: NormalizedSkill[]) => void;
  onSaveComplete?: () => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NormalizedSkill>>({});

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const handleAdd = () => {
    const newSkill: Partial<NormalizedSkill> = {
      category: "",
      skillName: "",
      orderIndex: skills.length + 1,
    };
    setEditingId(-1); // Temporary ID for new items
    setFormData(newSkill);
  };

  const handleSave = async () => {
    if (!editingId || !formData.category || !formData.skillName) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const skillData: Partial<NormalizedSkill> = {
        category: formData.category,
        skillName: formData.skillName,
        orderIndex: formData.orderIndex || skills.length + 1,
      };

      let savedSkill: NormalizedSkill;

      if (editingId === -1) {
        // Adding new skill
        savedSkill = await apiService.saveSkill(skillData as NormalizedSkill);
        const updatedSkills = [...skills, savedSkill];
        onChange(updatedSkills);
        if (onAutoSave) {
          onAutoSave(updatedSkills);
        }
      } else {
        // Updating existing skill
        savedSkill = await apiService.updateSkill({
          ...skillData,
          id: editingId,
        } as NormalizedSkill);
        const updatedSkills = skills.map((item) =>
          item.id === editingId ? savedSkill : item
        );
        onChange(updatedSkills);
        if (onAutoSave) {
          onAutoSave(updatedSkills);
        }
      }

      setEditingId(null);
      setFormData({});

      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving skill:", err);
      setError("Failed to save skill");
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
      await apiService.deleteSkill(id);
      const updatedSkills = skills.filter((item) => item.id !== id);
      onChange(updatedSkills);
      if (onAutoSave) {
        onAutoSave(updatedSkills);
      }
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("Failed to delete skill");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof NormalizedSkill, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  // Group skills by category for display
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, NormalizedSkill[]>);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">No skills yet</p>
            <p className="text-xs text-gray-400">
              Click "Add Skill" to get started
            </p>
          </div>
        ) : (
          <>
            {/* Show skills grouped by category */}
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => (
                <div
                  key={category}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{category}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleAdd()}
                        disabled={saving}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        <span>{skill.skillName}</span>
                        <button
                          onClick={() => handleDelete(skill.id!)}
                          disabled={saving}
                          className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Add new skill form */}
            {editingId && (
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <Input
                        value={formData.category || ""}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        placeholder="e.g., Programming Languages, Frameworks, Soft Skills"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill Name *
                      </label>
                      <Input
                        value={formData.skillName || ""}
                        onChange={(e) =>
                          handleChange("skillName", e.target.value)
                        }
                        placeholder="e.g., JavaScript, React, Leadership"
                        required
                        disabled={saving}
                        onKeyPress={handleKeyPress}
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
                        saving || !formData.category || !formData.skillName
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
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default SkillsForm;
