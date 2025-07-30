import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Card from "../ui/Card";
import { apiService } from "../../services/api";
import type { NormalizedPersonalInfo } from "../../types";

interface PersonalInfoFormProps {
  data: NormalizedPersonalInfo;
  onChange: (data: NormalizedPersonalInfo) => void;
  onAutoSave?: (data: NormalizedPersonalInfo) => void;
  onLoad?: (data: NormalizedPersonalInfo) => void;
  onSaveComplete?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
  onAutoSave,
  onSaveComplete,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Component mount - no need to load data as parent manages it
  useEffect(() => {
    // Data is passed as props from parent
    // No need to load separately
  }, []);

  const [formData, setFormData] = useState<NormalizedPersonalInfo>(data);

  // Update local form data when props change
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof NormalizedPersonalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const savedData = await apiService.savePersonalInfoNormalized(formData);
      onChange(savedData);
      setFormData(savedData);
      if (onAutoSave) {
        onAutoSave(savedData);
      }
      // Trigger data loading after successful save
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving personal info:", err);
      setError("Failed to save personal information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        {saving && <span className="text-sm text-blue-600">Saving...</span>}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            required
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john.doe@example.com"
            required
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="San Francisco, CA"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <Input
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio/Website
          </label>
          <Input
            type="url"
            value={formData.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="https://johndoe.dev"
            disabled={saving}
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          * Required fields. This information will appear at the top of your
          resume.
        </p>
        <button
          onClick={handleSave}
          disabled={saving || !formData.name || !formData.email}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </Card>
  );
};

export default PersonalInfoForm;
