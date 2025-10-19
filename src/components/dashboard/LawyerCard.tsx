import { Star, Phone, MessageCircle, Instagram, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface LawyerCardProps {
  name: string;
  specialization: string;
  rating: number;
  image?: string;
  onWhatsApp?: () => void;
  onCall?: () => void;
  onInstagram?: () => void;
  onTelegram?: () => void;
}

export function LawyerCard({
  name,
  specialization,
  rating,
  image,
  onWhatsApp,
  onCall,
  onInstagram,
  onTelegram,
}: LawyerCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div 
      className="bg-white border border-slate-200 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
      style={{ borderRadius: '12px' }}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16" style={{ borderRadius: '9999px' }}>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-blue-100 text-primary" style={{ color: '#2563eb' }}>
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-slate-900 font-serif-legal mb-1" style={{ fontWeight: 600 }}>{name}</h3>
          <Badge 
            className="bg-primary text-white mb-2"
            style={{ backgroundColor: '#2563eb', borderRadius: '9999px' }}
          >
            {specialization}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
            <span className="text-slate-900" style={{ fontSize: '14px', fontWeight: 600 }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Contact Icons */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={onWhatsApp}
          className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
          style={{ borderRadius: '8px' }}
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" style={{ color: '#10b981' }} />
        </button>
        <button
          onClick={onCall}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          style={{ borderRadius: '8px' }}
          aria-label="Call"
        >
          <Phone className="w-5 h-5" style={{ color: '#2563eb' }} />
        </button>
        <button
          onClick={onInstagram}
          className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
          style={{ borderRadius: '8px' }}
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" style={{ color: '#ec4899' }} />
        </button>
        <button
          onClick={onTelegram}
          className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors"
          style={{ borderRadius: '8px' }}
          aria-label="Telegram"
        >
          <Send className="w-5 h-5" style={{ color: '#0ea5e9' }} />
        </button>
      </div>
    </div>
  );
}
