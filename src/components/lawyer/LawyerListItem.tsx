import { Phone, MessageCircle, Instagram, Send, Star, MapPin, Briefcase, Languages } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface LawyerListItemProps {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  location: string;
  languages: string[];
  consultationFee: number;
  image: string;
  isStarred?: boolean;
  onWhatsApp?: () => void;
  onCall?: () => void;
  onInstagram?: () => void;
  onTelegram?: () => void;
  onStar?: () => void;
  onViewProfile?: () => void;
}

export function LawyerListItem({
  name,
  specialization,
  rating,
  experience,
  location,
  languages,
  consultationFee,
  image,
  isStarred = false,
  onWhatsApp,
  onCall,
  onInstagram,
  onTelegram,
  onStar,
  onViewProfile,
}: LawyerListItemProps) {
  return (
    <div className="bg-white border border-slate-200 p-4 hover:border-primary transition-all hover:shadow-md" style={{ borderRadius: "12px" }}>
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar className="w-20 h-20 flex-shrink-0">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-blue-100 text-primary" style={{ color: "#2563eb" }}>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-slate-900 font-serif-legal truncate" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {name}
                </h3>
                <button
                  onClick={onStar}
                  className={`flex-shrink-0 transition-colors ${
                    isStarred ? "text-gold" : "text-slate-300 hover:text-gold"
                  }`}
                  aria-label={isStarred ? "Unstar lawyer" : "Star lawyer"}
                >
                  <Star className="w-5 h-5" fill={isStarred ? "#f59e0b" : "none"} />
                </button>
              </div>
              <Badge className="bg-blue-50 text-primary border-0 mb-2" style={{ color: "#2563eb" }}>
                {specialization}
              </Badge>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-gold text-gold" style={{ color: "#f59e0b" }} />
              <span className="text-slate-900" style={{ fontSize: "14px", fontWeight: 600 }}>
                {rating}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span style={{ fontSize: "14px" }}>{experience} years exp.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span style={{ fontSize: "14px" }}>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Languages className="w-4 h-4 flex-shrink-0" />
              <span style={{ fontSize: "14px" }}>{languages.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <span style={{ fontSize: "14px", fontWeight: 600 }}>₹{consultationFee} / session</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Contact Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onWhatsApp}
                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={onCall}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                aria-label="Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={onInstagram}
                className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={onTelegram}
                className="p-2 bg-sky-100 hover:bg-sky-200 text-sky-600 rounded-lg transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* View Profile Button */}
            <Button
              onClick={onViewProfile}
              variant="outline"
              size="sm"
              className="ml-auto border-primary text-primary hover:bg-primary hover:text-white"
              style={{ borderRadius: "8px", color: "#2563eb" }}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
