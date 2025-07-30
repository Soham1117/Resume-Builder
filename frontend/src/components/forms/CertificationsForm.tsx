import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Award,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { apiService } from "../../services/api";
import type { NormalizedCertification } from "../../types";

interface CertificationsFormProps {
  certifications: NormalizedCertification[];
  onChange: (certifications: NormalizedCertification[]) => void;
  onAutoSave?: (certifications: NormalizedCertification[]) => void;
  onLoad?: (certifications: NormalizedCertification[]) => void;
  onSaveComplete?: () => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NormalizedCertification>>(
    {}
  );

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const handleAdd = () => {
    const newCertification: Partial<NormalizedCertification> = {
      name: "",
      issuer: "",
      dateObtained: "",
      link: "",
    };
    setEditingId(-1); // Temporary ID for new items
    setFormData(newCertification);
    setIsAddingNew(true);
  };

  const handleEdit = (item: NormalizedCertification) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingId || !formData.name || !formData.issuer) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const certificationData: Partial<NormalizedCertification> = {
        name: formData.name,
        issuer: formData.issuer,
        dateObtained: formData.dateObtained || "",
        link: formData.link || "",
      };

      let savedCertification: NormalizedCertification;

      if (isAddingNew) {
        savedCertification = await apiService.saveCertification(
          certificationData as NormalizedCertification
        );
        const updatedCertifications = [...certifications, savedCertification];
        onChange(updatedCertifications);
        if (onAutoSave) {
          onAutoSave(updatedCertifications);
        }
      } else {
        savedCertification = await apiService.saveCertification({
          ...certificationData,
          id: editingId,
        } as NormalizedCertification);
        const updatedCertifications = certifications.map((item) =>
          item.id === editingId ? savedCertification : item
        );
        onChange(updatedCertifications);
        if (onAutoSave) {
          onAutoSave(updatedCertifications);
        }
      }

      setEditingId(null);
      setFormData({});
      setIsAddingNew(false);
      
      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving certification:", err);
      setError("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setIsAddingNew(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      setError(null);
      await apiService.deleteCertification(id);
      const updatedCertifications = certifications.filter(
        (item) => item.id !== id
      );
      onChange(updatedCertifications);
      if (onAutoSave) {
        onAutoSave(updatedCertifications);
      }
    } catch (err) {
      console.error("Error deleting certification:", err);
      setError("Failed to delete certification");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof NormalizedCertification,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Certifications & Achievements
        </h3>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {certifications.length === 0 && !editingId ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">No certifications yet</p>
            <p className="text-xs text-gray-400">
              Click "Add Certification" to get started
            </p>
          </div>
        ) : (
          <>
            {/* Add new certification form */}
            {editingId === -1 && (
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Certification
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certification Name *
                      </label>
                      <Input
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issuing Organization *
                      </label>
                      <Input
                        value={formData.issuer || ""}
                        onChange={(e) => handleChange("issuer", e.target.value)}
                        placeholder="e.g., Amazon Web Services"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Obtained
                      </label>
                      <Input
                        type="date"
                        value={formData.dateObtained || ""}
                        onChange={(e) =>
                          handleChange("dateObtained", e.target.value)
                        }
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Link
                      </label>
                      <Input
                        type="url"
                        value={formData.link || ""}
                        onChange={(e) => handleChange("link", e.target.value)}
                        placeholder="https://credly.com/badges/..."
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
                      disabled={saving || !formData.name || !formData.issuer}
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
                          <span>Save Certification</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show existing certifications */}
            {certifications.map((item) => (
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
                          Certification Name *
                        </label>
                        <Input
                          value={formData.name || ""}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="e.g., AWS Certified Solutions Architect"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issuing Organization *
                        </label>
                        <Input
                          value={formData.issuer || ""}
                          onChange={(e) =>
                            handleChange("issuer", e.target.value)
                          }
                          placeholder="e.g., Amazon Web Services"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Earned
                        </label>
                        <Input
                          type="date"
                          value={formData.dateObtained || ""}
                          onChange={(e) =>
                            handleChange("dateObtained", e.target.value)
                          }
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Verification Link
                        </label>
                        <Input
                          type="url"
                          value={formData.link || ""}
                          onChange={(e) => handleChange("link", e.target.value)}
                          placeholder="https://credly.com/badges/..."
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
                        disabled={saving || !formData.name || !formData.issuer}
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
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            title="View certificate"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        {item.issuer}
                      </p>

                      {item.dateObtained && (
                        <div className="text-xs text-gray-500">
                          Earned:{" "}
                          {new Date(item.dateObtained).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </div>
                      )}
                    </div>

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
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
};

export default CertificationsForm;
