"use client";

import type { DriverFormData } from "@/lib/types";
import { DRIVER_LANGUAGES } from "@/lib/drivers/data";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";

interface PersonalTabProps {
  data: DriverFormData;
  onChange: (data: Partial<DriverFormData>) => void;
}

export function PersonalTab({ data, onChange }: PersonalTabProps) {
  const updatePersonal = (field: keyof DriverFormData["personal"], value: string | string[] | null) => {
    onChange({ personal: { ...data.personal, [field]: value } });
  };

  const toggleLanguage = (lang: string) => {
    const current = data.personal.languages;
    const next = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    updatePersonal("languages", next);
  };

  return (
    <div className="space-y-6">
      <FileUpload
        label="Driver Photo"
        accept="image/*"
        onFilesSelected={(files) => {
          const file = files[0];
          if (file) onChange({ photoUrl: URL.createObjectURL(file) });
        }}
        hint="JPG, PNG or WebP — max 5 MB"
      />

      {data.photoUrl && (
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.photoUrl} alt="Driver preview" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          value={data.personal.firstName}
          onChange={(e) => updatePersonal("firstName", e.target.value)}
          required
        />
        <Input
          label="Last Name"
          value={data.personal.lastName}
          onChange={(e) => updatePersonal("lastName", e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={data.personal.email}
          onChange={(e) => updatePersonal("email", e.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          value={data.personal.phone}
          onChange={(e) => updatePersonal("phone", e.target.value)}
          placeholder="+39 340 123 4567"
          required
        />
        <Input
          label="Date of Birth"
          type="date"
          value={data.personal.dateOfBirth ?? ""}
          onChange={(e) => updatePersonal("dateOfBirth", e.target.value || null)}
        />
        <Input
          label="Tax Code"
          value={data.personal.taxCode}
          onChange={(e) => updatePersonal("taxCode", e.target.value)}
          placeholder="RSSMRC85C12F205X"
        />
        <Input
          label="Address"
          value={data.personal.address}
          onChange={(e) => updatePersonal("address", e.target.value)}
          className="sm:col-span-2"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Languages</p>
        <div className="flex flex-wrap gap-2">
          {DRIVER_LANGUAGES.map((lang) => {
            const selected = data.personal.languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
