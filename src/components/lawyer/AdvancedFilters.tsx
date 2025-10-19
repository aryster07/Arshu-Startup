import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface FilterOptions {
  specializations: string[];
  experience: number[];
  rating: number;
  languages: string[];
  location: string[];
  consultationFee: number[];
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  activeFilterCount: number;
}

const specializationOptions = [
  "Corporate Law",
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Tax Law",
  "Cyber Law",
  "Labour Law",
  "IPR Law",
];

const languageOptions = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
];

const locationOptions = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];

export function AdvancedFilters({ filters, onFiltersChange, activeFilterCount }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSpecializationToggle = (spec: string) => {
    const updated = localFilters.specializations.includes(spec)
      ? localFilters.specializations.filter((s) => s !== spec)
      : [...localFilters.specializations, spec];
    setLocalFilters({ ...localFilters, specializations: updated });
  };

  const handleLanguageToggle = (lang: string) => {
    const updated = localFilters.languages.includes(lang)
      ? localFilters.languages.filter((l) => l !== lang)
      : [...localFilters.languages, lang];
    setLocalFilters({ ...localFilters, languages: updated });
  };

  const handleLocationToggle = (loc: string) => {
    const updated = localFilters.location.includes(loc)
      ? localFilters.location.filter((l) => l !== loc)
      : [...localFilters.location, loc];
    setLocalFilters({ ...localFilters, location: updated });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      specializations: [],
      experience: [0, 50],
      rating: 0,
      languages: [],
      location: [],
      consultationFee: [0, 10000],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-slate-200"
          style={{ borderRadius: "8px" }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white px-2 py-0.5 rounded-full" style={{ fontSize: "12px" }}>
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white">
        <SheetHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div className="flex-1">
              <SheetTitle className="font-serif-legal text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>
                Filter Lawyers
              </SheetTitle>
              <p className="text-slate-600 mt-1" style={{ fontSize: "14px" }}>
                Refine your search to find the perfect lawyer
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-24">
          {/* Specialization */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Specialization
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4 px-2">
              {specializationOptions.map((spec) => (
                <div key={spec} className="flex items-center gap-2">
                  <Checkbox
                    id={`spec-${spec}`}
                    checked={localFilters.specializations.includes(spec)}
                    onCheckedChange={() => handleSpecializationToggle(spec)}
                  />
                  <label
                    htmlFor={`spec-${spec}`}
                    className="text-slate-700 cursor-pointer"
                    style={{ fontSize: "14px" }}
                  >
                    {spec}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Experience */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Experience (Years)
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 px-2">
              <Slider
                value={localFilters.experience}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, experience: value })
                }
                min={0}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-slate-600" style={{ fontSize: "14px" }}>
                <span>{localFilters.experience[0]} years</span>
                <span>{localFilters.experience[1]} years</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Rating */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Minimum Rating
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 px-2">
              <Slider
                value={[localFilters.rating]}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, rating: value[0] })
                }
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
              <div className="text-slate-600" style={{ fontSize: "14px" }}>
                {localFilters.rating.toFixed(1)} ★ and above
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Languages */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Languages
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4 px-2">
              {languageOptions.map((lang) => (
                <div key={lang} className="flex items-center gap-2">
                  <Checkbox
                    id={`lang-${lang}`}
                    checked={localFilters.languages.includes(lang)}
                    onCheckedChange={() => handleLanguageToggle(lang)}
                  />
                  <label
                    htmlFor={`lang-${lang}`}
                    className="text-slate-700 cursor-pointer"
                    style={{ fontSize: "14px" }}
                  >
                    {lang}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Location */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Location
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4 px-2">
              {locationOptions.map((loc) => (
                <div key={loc} className="flex items-center gap-2">
                  <Checkbox
                    id={`loc-${loc}`}
                    checked={localFilters.location.includes(loc)}
                    onCheckedChange={() => handleLocationToggle(loc)}
                  />
                  <label
                    htmlFor={`loc-${loc}`}
                    className="text-slate-700 cursor-pointer"
                    style={{ fontSize: "14px" }}
                  >
                    {loc}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Consultation Fee */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
              <h3 className="font-serif-legal text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                Consultation Fee
              </h3>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 px-2">
              <Slider
                value={localFilters.consultationFee}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, consultationFee: value })
                }
                min={0}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-slate-600" style={{ fontSize: "14px" }}>
                <span>₹{localFilters.consultationFee[0]}</span>
                <span>₹{localFilters.consultationFee[1]}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 fixed bottom-0 left-0 right-0 bg-white pt-4 pb-6 px-6 border-t border-slate-200 shadow-lg">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1 border-slate-300 hover:bg-slate-50 text-slate-700"
            style={{ borderRadius: "8px", height: "44px" }}
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-primary hover:bg-blue-700 text-white shadow-md"
            style={{ borderRadius: "8px", height: "44px", backgroundColor: "#2563eb" }}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
