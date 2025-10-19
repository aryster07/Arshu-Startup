import { Phone, MessageCircle, Instagram, Send, Star, MapPin, Briefcase, Languages, Award, GraduationCap, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

interface LawyerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: {
    id: number;
    name: string;
    specialization: string;
    rating: number;
    experience: number;
    location: string;
    languages: string[];
    consultationFee: number;
    image: string;
    bio?: string;
    education?: string[];
    barCouncilId?: string;
    successRate?: number;
    casesHandled?: number;
  };
  onWhatsApp?: () => void;
  onCall?: () => void;
  onInstagram?: () => void;
  onTelegram?: () => void;
}

export function LawyerProfileModal({
  isOpen,
  onClose,
  lawyer,
  onWhatsApp,
  onCall,
  onInstagram,
  onTelegram,
}: LawyerProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif-legal">Lawyer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex gap-4">
            <Avatar className="w-24 h-24 flex-shrink-0">
              <AvatarImage src={lawyer.image} alt={lawyer.name} />
              <AvatarFallback className="bg-blue-100 text-primary" style={{ color: "#2563eb" }}>
                {lawyer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-slate-900 font-serif-legal mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>
                {lawyer.name}
              </h2>
              <Badge className="bg-blue-50 text-primary border-0 mb-3" style={{ color: "#2563eb" }}>
                {lawyer.specialization}
              </Badge>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-5 h-5 fill-gold text-gold" style={{ color: "#f59e0b" }} />
                <span className="text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>
                  {lawyer.rating} Rating
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          {lawyer.bio && (
            <div>
              <h3 className="text-slate-900 font-serif-legal mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
                About
              </h3>
              <p className="text-slate-600" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {lawyer.bio}
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg text-center">
              <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" style={{ color: "#2563eb" }} />
              <p className="text-slate-900" style={{ fontSize: "18px", fontWeight: 600 }}>
                {lawyer.experience}+
              </p>
              <p className="text-slate-600" style={{ fontSize: "12px" }}>Years Exp.</p>
            </div>
            {lawyer.casesHandled && (
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-primary" style={{ color: "#2563eb" }} />
                <p className="text-slate-900" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {lawyer.casesHandled}+
                </p>
                <p className="text-slate-600" style={{ fontSize: "12px" }}>Cases</p>
              </div>
            )}
            {lawyer.successRate && (
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-primary" style={{ color: "#2563eb" }} />
                <p className="text-slate-900" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {lawyer.successRate}%
                </p>
                <p className="text-slate-600" style={{ fontSize: "12px" }}>Success Rate</p>
              </div>
            )}
            <div className="bg-slate-50 p-3 rounded-lg text-center">
              <span className="text-slate-900 block" style={{ fontSize: "18px", fontWeight: 600 }}>
                ₹{lawyer.consultationFee}
              </span>
              <p className="text-slate-600" style={{ fontSize: "12px" }}>Per Session</p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-slate-500" style={{ fontSize: "12px" }}>Location</p>
                <p className="text-slate-900" style={{ fontSize: "14px" }}>{lawyer.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-slate-500" style={{ fontSize: "12px" }}>Languages</p>
                <p className="text-slate-900" style={{ fontSize: "14px" }}>{lawyer.languages.join(", ")}</p>
              </div>
            </div>

            {lawyer.barCouncilId && (
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-slate-500" style={{ fontSize: "12px" }}>Bar Council ID</p>
                  <p className="text-slate-900" style={{ fontSize: "14px" }}>{lawyer.barCouncilId}</p>
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          {lawyer.education && lawyer.education.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-slate-900 font-serif-legal mb-3 flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 600 }}>
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h3>
                <ul className="space-y-2">
                  {lawyer.education.map((edu, index) => (
                    <li key={index} className="text-slate-600 flex items-start gap-2" style={{ fontSize: "14px" }}>
                      <span className="text-primary mt-1">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Contact Actions */}
          <div>
            <h3 className="text-slate-900 font-serif-legal mb-3" style={{ fontSize: "16px", fontWeight: 600 }}>
              Contact {lawyer.name.split(" ")[0]}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onWhatsApp}
                className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white gap-2"
                style={{ borderRadius: "8px" }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button
                onClick={onCall}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white gap-2"
                style={{ borderRadius: "8px" }}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button
                onClick={onInstagram}
                className="flex-1 sm:flex-initial bg-pink-600 hover:bg-pink-700 text-white gap-2"
                style={{ borderRadius: "8px" }}
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </Button>
              <Button
                onClick={onTelegram}
                className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white gap-2"
                style={{ borderRadius: "8px" }}
              >
                <Send className="w-4 h-4" />
                Telegram
              </Button>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-slate-700" style={{ fontSize: "12px" }}>
              <strong>Legal Disclaimer:</strong> Information provided is for general purposes only and does not constitute legal advice. 
              Please consult directly with the lawyer for advice specific to your case.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
