import { useState } from "react";
import { Star, Search } from "lucide-react";
import { LawyerListItem } from "../lawyer/LawyerListItem";
import { LawyerProfileModal } from "../lawyer/LawyerProfileModal";
import { Input } from "../ui/input";

const myLawyers = [
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
    isStarred: true,
  },
  {
    id: 2,
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
    isStarred: false,
  },
  {
    id: 3,
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
    isStarred: true,
  },
  {
    id: 4,
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
    isStarred: false,
  },
];

export function LawyersPage() {
  const [lawyers, setLawyers] = useState(myLawyers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<typeof myLawyers[0] | null>(null);

  const handleContact = (type: string, lawyerName: string) => {
    alert(`Opening ${type} for ${lawyerName}`);
  };

  const handleStar = (lawyerId: number) => {
    setLawyers(
      lawyers.map((lawyer) =>
        lawyer.id === lawyerId ? { ...lawyer, isStarred: !lawyer.isStarred } : lawyer
      )
    );
  };

  // Filter lawyers based on search
  const filteredLawyers = lawyers.filter((lawyer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lawyer.name.toLowerCase().includes(query) ||
      lawyer.specialization.toLowerCase().includes(query) ||
      lawyer.location.toLowerCase().includes(query)
    );
  });

  // Sort lawyers: starred first
  const sortedLawyers = [...filteredLawyers].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return 0;
  });

  const starredCount = lawyers.filter((l) => l.isStarred).length;

  return (
    <div>
      {/* Stats Summary */}
      <div className="mb-6">
        <p className="text-slate-600" style={{ fontSize: "14px" }}>
          {lawyers.length} {lawyers.length === 1 ? "lawyer" : "lawyers"} • {starredCount} starred
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search your lawyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* Info Card about Starring */}
      {starredCount === 0 && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg" style={{ borderRadius: "8px" }}>
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
            <div>
              <p className="text-slate-900 mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>
                Star your favorite lawyers
              </p>
              <p className="text-slate-600" style={{ fontSize: "13px" }}>
                Click the star icon to pin important lawyers to the top of your list for quick access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lawyers List */}
      <div className="space-y-4">
        {sortedLawyers.map((lawyer) => (
          <LawyerListItem
            key={lawyer.id}
            {...lawyer}
            onWhatsApp={() => handleContact("WhatsApp", lawyer.name)}
            onCall={() => handleContact("Call", lawyer.name)}
            onInstagram={() => handleContact("Instagram", lawyer.name)}
            onTelegram={() => handleContact("Telegram", lawyer.name)}
            onStar={() => handleStar(lawyer.id)}
            onViewProfile={() => setSelectedLawyer(lawyer)}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedLawyers.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-900 mb-2" style={{ fontSize: "18px", fontWeight: 600 }}>
            No lawyers found
          </h3>
          <p className="text-slate-600">Try a different search term</p>
        </div>
      )}

      {/* Lawyer Profile Modal */}
      {selectedLawyer && (
        <LawyerProfileModal
          isOpen={!!selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
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
