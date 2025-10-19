import { useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { LawyerListItem } from "../lawyer/LawyerListItem";
import { LawyerProfileModal } from "../lawyer/LawyerProfileModal";
import { AdvancedFilters } from "../lawyer/AdvancedFilters";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { Button } from "../ui/button";

interface FilterOptions {
  specializations: string[];
  experience: number[];
  rating: number;
  languages: string[];
  location: string[];
  consultationFee: number[];
}

const quickFilters = ["Near Me", "Top Rated", "Available Today", "Under ₹500"];

const mockLawyers = [
  {
    id: 1,
    name: "Priya Sharma",
    specialization: "Corporate Law",
    rating: 4.8,
    experience: 12,
    location: "Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    consultationFee: 800,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Specialized in corporate mergers, acquisitions, and business law with over 12 years of experience representing Fortune 500 companies and startups.",
    education: ["LLB, Delhi University", "LLM Corporate Law, Harvard Law School"],
    barCouncilId: "MH/2012/45678",
    successRate: 94,
    casesHandled: 230,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    specialization: "Criminal Law",
    rating: 4.9,
    experience: 18,
    location: "Delhi",
    languages: ["English", "Hindi"],
    consultationFee: 1200,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Expert criminal defense lawyer with extensive courtroom experience handling high-profile cases across Supreme Court and High Courts.",
    education: ["LLB, National Law School", "Post Graduate Diploma in Criminal Law"],
    barCouncilId: "DL/2006/12345",
    successRate: 89,
    casesHandled: 450,
  },
  {
    id: 3,
    name: "Anita Desai",
    specialization: "Family Law",
    rating: 4.7,
    experience: 10,
    location: "Bangalore",
    languages: ["English", "Hindi", "Kannada"],
    consultationFee: 600,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Compassionate family law attorney specializing in divorce, child custody, and domestic violence cases with a focus on mediation.",
    education: ["LLB, Christ University", "Family Law Certification, NLSIU"],
    barCouncilId: "KA/2014/34567",
    successRate: 91,
    casesHandled: 180,
  },
  {
    id: 4,
    name: "Vikram Singh",
    specialization: "Property Law",
    rating: 4.6,
    experience: 15,
    location: "Pune",
    languages: ["English", "Hindi", "Marathi"],
    consultationFee: 700,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Property dispute resolution expert with comprehensive knowledge of real estate transactions, land acquisition, and property inheritance.",
    education: ["LLB, Pune University", "Diploma in Real Estate Law"],
    barCouncilId: "MH/2009/23456",
    successRate: 88,
    casesHandled: 320,
  },
  {
    id: 5,
    name: "Meera Patel",
    specialization: "Tax Law",
    rating: 4.9,
    experience: 14,
    location: "Ahmedabad",
    languages: ["English", "Hindi", "Gujarati"],
    consultationFee: 900,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Tax litigation specialist helping individuals and businesses navigate complex tax laws, GST, and income tax disputes.",
    education: ["LLB, Gujarat University", "CA, ICAI", "LLM Taxation Law"],
    barCouncilId: "GJ/2010/56789",
    successRate: 96,
    casesHandled: 280,
  },
  {
    id: 6,
    name: "Arjun Verma",
    specialization: "Corporate Law",
    rating: 4.5,
    experience: 8,
    location: "Chennai",
    languages: ["English", "Hindi", "Tamil"],
    consultationFee: 550,
    image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Young corporate lawyer focusing on startup legal advisory, compliance, and intellectual property protection for tech companies.",
    education: ["LLB, Madras University", "Business Law Certification"],
    barCouncilId: "TN/2016/67890",
    successRate: 87,
    casesHandled: 120,
  },
];

export function ConsultantPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<typeof mockLawyers[0] | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    specializations: [],
    experience: [0, 50],
    rating: 0,
    languages: [],
    location: [],
    consultationFee: [0, 10000],
  });

  // Handle browser back button for lawyer profile modal
  useEffect(() => {
    const handlePopState = () => {
      if (selectedLawyer) {
        setSelectedLawyer(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedLawyer]);

  const handleViewProfile = (lawyer: typeof mockLawyers[0]) => {
    setSelectedLawyer(lawyer);
    // Push state to history so back button works
    window.history.pushState(
      { modal: 'lawyer-profile', lawyerId: lawyer.id },
      '',
      window.location.href
    );
  };

  const handleCloseProfile = () => {
    setSelectedLawyer(null);
    // Go back in history if this was opened via history push
    if (window.history.state?.modal === 'lawyer-profile') {
      window.history.back();
    }
  };

  const handleContact = (type: string, lawyerName: string) => {
    alert(`Opening ${type} for ${lawyerName}`);
  };

  // Calculate active filter count
  const activeFilterCount =
    filters.specializations.length +
    filters.languages.length +
    filters.location.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.experience[0] > 0 || filters.experience[1] < 50 ? 1 : 0) +
    (filters.consultationFee[0] > 0 || filters.consultationFee[1] < 10000 ? 1 : 0);

  // Filter lawyers based on filters
  const filteredLawyers = mockLawyers.filter((lawyer) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.specialization.toLowerCase().includes(query) ||
        lawyer.location.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Specialization filter
    if (filters.specializations.length > 0) {
      if (!filters.specializations.includes(lawyer.specialization)) return false;
    }

    // Experience filter
    if (lawyer.experience < filters.experience[0] || lawyer.experience > filters.experience[1]) {
      return false;
    }

    // Rating filter
    if (lawyer.rating < filters.rating) return false;

    // Language filter
    if (filters.languages.length > 0) {
      const hasMatchingLanguage = filters.languages.some((lang) =>
        lawyer.languages.includes(lang)
      );
      if (!hasMatchingLanguage) return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      if (!filters.location.includes(lawyer.location)) return false;
    }

    // Consultation fee filter
    if (
      lawyer.consultationFee < filters.consultationFee[0] ||
      lawyer.consultationFee > filters.consultationFee[1]
    ) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, specialization, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Results Count */}
      <p className="text-slate-600 mb-4" style={{ fontSize: "14px" }}>
        Showing {filteredLawyers.length} {filteredLawyers.length === 1 ? "lawyer" : "lawyers"}
      </p>

      {/* Lawyer List */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : (
        <div className="space-y-4">
          {filteredLawyers.map((lawyer) => (
            <LawyerListItem
              key={lawyer.id}
              {...lawyer}
              onWhatsApp={() => handleContact("WhatsApp", lawyer.name)}
              onCall={() => handleContact("Call", lawyer.name)}
              onInstagram={() => handleContact("Instagram", lawyer.name)}
              onTelegram={() => handleContact("Telegram", lawyer.name)}
              onViewProfile={() => handleViewProfile(lawyer)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredLawyers.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-900 mb-2" style={{ fontSize: "18px", fontWeight: 600 }}>
            No lawyers found
          </h3>
          <p className="text-slate-600 mb-6">
            Try adjusting your filters or search query to find more lawyers
          </p>
          <Button
            onClick={() => {
              setFilters({
                specializations: [],
                experience: [0, 50],
                rating: 0,
                languages: [],
                location: [],
                consultationFee: [0, 10000],
              });
              setSearchQuery("");
            }}
            variant="outline"
            className="border-slate-200"
            style={{ borderRadius: "8px" }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ borderRadius: "8px" }}>
        <p className="text-slate-700" style={{ fontSize: "13px" }}>
          <strong>Legal Disclaimer:</strong> The information provided by these legal professionals is general information only and does not constitute legal advice.
          We recommend consulting with the lawyer directly for advice specific to your situation.
        </p>
      </div>

      {/* Lawyer Profile Modal */}
      {selectedLawyer && (
        <LawyerProfileModal
          isOpen={!!selectedLawyer}
          onClose={handleCloseProfile}
          lawyer={selectedLawyer}
          onWhatsApp={() => handleContact("WhatsApp", selectedLawyer.name)}
          onCall={() => handleContact("Call", selectedLawyer.name)}
          onInstagram={() => handleContact("Instagram", selectedLawyer.name)}
          onTelegram={() => handleContact("Telegram", selectedLawyer.name)}
        />
      )}
    </div>
  );
}
