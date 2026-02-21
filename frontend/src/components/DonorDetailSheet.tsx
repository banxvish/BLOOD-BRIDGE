import React, { useState } from 'react';
import { X, Droplet, MapPin, Phone, Calendar, Clock, User, MessageCircle, Heart, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Donor {
    id: string;
    name: string;
    bloodType: string;
    city: string;
    address?: string | null;
    distance?: string;
    lastDonation: string | null;
    available: boolean;
    contact: string;
    age?: number;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: string;
}

interface DonorDetailSheetProps {
    donor: Donor | null;
    isOpen: boolean;
    onClose: () => void;
    seekerLocation?: string;
    searchedBloodType?: string;
    defaultUrgency?: string;
}

type UrgencyLevel = 'critical' | 'high' | 'normal';

interface MessageContext {
    donor: Donor;
    location: string;
    bloodType: string;
}

const urgencyConfig: Record<UrgencyLevel, {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    getMessage: (ctx: MessageContext) => string;
}> = {
    critical: {
        label: '\ud83d\udea8 Critical',
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-red-400',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
        getMessage: ({ donor, location, bloodType }) =>
            `\ud83d\udea8 *URGENT \u2014 LIFE AT RISK* \ud83d\udea8\n\n` +
            `Hi ${donor.name},\n\n` +
            `I'm reaching out from *${location}*. A patient here is in *critical condition* and desperately needs *${bloodType}* blood right now.\n\n` +
            `\u23f0 *This is an emergency* \u2014 we have very little time.\n` +
            `\ud83e\ude78 Blood Type Needed: *${bloodType}*\n` +
            `\ud83d\udccd Patient Location: *${location}*\n\n` +
            `I found your profile on Blood Bridge and you're the closest match. Could you please help? Every minute matters. \ud83d\ude4f\n\n` +
            `_Sent via Blood Bridge_`,
    },
    high: {
        label: '\u26a0\ufe0f High',
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'text-amber-400',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.2)',
        getMessage: ({ donor, location, bloodType }) =>
            `\u26a0\ufe0f *Urgent Blood Donation Request*\n\n` +
            `Hi ${donor.name},\n\n` +
            `I'm contacting you from *${location}*. A patient near my location needs *${bloodType}* blood for an upcoming procedure within the next *24 hours*.\n\n` +
            `\ud83e\ude78 Blood Type Needed: *${bloodType}*\n` +
            `\ud83d\udccd Patient Location: *${location}*\n\n` +
            `I found your donor profile on Blood Bridge. Would you be available to donate? Your help would mean the world to us. \ud83d\ude4f\n\n` +
            `_Sent via Blood Bridge_`,
    },
    normal: {
        label: '\ud83d\udccb Normal',
        icon: <Info className="w-4 h-4" />,
        color: 'text-blue-400',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        getMessage: ({ donor, location, bloodType }) =>
            `Hi ${donor.name},\n\n` +
            `I found your profile on Blood Bridge. I'm from *${location}* and looking for a *${bloodType}* blood donor.\n\n` +
            `\ud83e\ude78 Blood Type Needed: *${bloodType}*\n` +
            `\ud83d\udccd My Location: *${location}*\n\n` +
            `There's no immediate rush. Whenever you're free, could you let me know if you'd be willing to help? Thank you so much! \ud83d\ude0a\n\n` +
            `_Sent via Blood Bridge_`,
    },
};

export const DonorDetailSheet: React.FC<DonorDetailSheetProps> = ({ donor, isOpen, onClose, seekerLocation, searchedBloodType, defaultUrgency }) => {
    const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>('high');

    React.useEffect(() => {
        if (isOpen) {
            if (defaultUrgency && ['critical', 'high', 'normal'].includes(defaultUrgency)) {
                setSelectedUrgency(defaultUrgency as UrgencyLevel);
            } else {
                setSelectedUrgency('high');
            }
        }
    }, [isOpen, defaultUrgency]);

    if (!donor) return null;

    const msgContext: MessageContext = {
        donor,
        location: seekerLocation || 'my area',
        bloodType: searchedBloodType || donor.bloodType,
    };

    const handleWhatsApp = () => {
        const formattedPhone = donor.contact.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(urgencyConfig[selectedUrgency].getMessage(msgContext));
        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                style={{ zIndex: 9998 }}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`fixed inset-0 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{
                    zIndex: 9999,
                    background: 'rgb(15, 15, 25)',
                }}
            >
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
                    <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    >
                        <X className="w-4 h-4 text-white/70" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 pb-6 flex flex-col max-w-2xl mx-auto w-full overflow-y-auto">
                    {/* Header + Blood Type */}
                    <div className="flex items-center gap-5 mb-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/15 flex items-center justify-center flex-shrink-0">
                                <User className="w-7 h-7 text-red-400" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl font-bold text-white truncate">{donor.name}</h2>
                                <Badge
                                    variant={donor.available ? "default" : "secondary"}
                                    className={
                                        donor.available
                                            ? "bg-green-500/15 text-green-400 border-green-500/20 text-xs mt-1"
                                            : "bg-gray-500/15 text-gray-400 border-gray-500/20 text-xs mt-1"
                                    }
                                >
                                    <Heart className="w-3 h-3 mr-1" />
                                    {donor.available ? "Available" : "Unavailable"}
                                </Badge>
                            </div>
                        </div>
                        <div
                            className="rounded-2xl px-6 py-3 text-center flex-shrink-0"
                            style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.15)',
                            }}
                        >
                            <Droplet className="w-5 h-5 text-red-400 mx-auto mb-1" />
                            <p className="text-3xl font-black text-red-400">{donor.bloodType}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <InfoCard icon={<MapPin className="w-4 h-4 text-blue-400" />} label="City" value={donor.city} />
                        <InfoCard icon={<Clock className="w-4 h-4 text-amber-400" />} label="Distance" value={donor.distance || 'N/A'} />
                        <InfoCard icon={<User className="w-4 h-4 text-purple-400" />} label="Age" value={donor.age ? `${donor.age} yrs` : 'N/A'} />
                        <InfoCard
                            icon={<Calendar className="w-4 h-4 text-green-400" />}
                            label="Last Donated"
                            value={donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                        />
                        {donor.address && (
                            <div className="rounded-xl p-3 col-span-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <MapPin className="w-4 h-4 text-blue-400 mb-1" />
                                <p className="text-[10px] text-white/35 uppercase tracking-wider">Address</p>
                                <p className="text-white font-semibold text-sm truncate">{donor.address}, {donor.city}</p>
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-green-400" />
                            <p className="text-[10px] text-white/35 uppercase tracking-wider">Contact Number</p>
                        </div>
                        <p className="text-white/90 text-lg font-semibold">{donor.contact}</p>
                    </div>

                    {/* Urgency Selector */}
                    <div className="mb-3">
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Select Emergency Level</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(urgencyConfig) as UrgencyLevel[]).map((level) => {
                                const config = urgencyConfig[level];
                                const isSelected = selectedUrgency === level;
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedUrgency(level)}
                                        className={`rounded-xl p-3 text-center transition-all duration-200 cursor-pointer ${config.color}`}
                                        style={{
                                            background: isSelected ? config.bgColor : 'rgba(255,255,255,0.03)',
                                            border: `1.5px solid ${isSelected ? config.borderColor : 'rgba(255,255,255,0.06)'}`,
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-1.5 mb-1">
                                            {config.icon}
                                        </div>
                                        <p className="text-xs font-semibold">{config.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Message Preview */}
                    <div
                        className="rounded-xl p-3 mb-4 flex-1 min-h-0 overflow-y-auto"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Message Preview</p>
                        <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line">
                            {urgencyConfig[selectedUrgency].getMessage(msgContext)}
                        </p>
                    </div>

                    {/* WhatsApp Button */}
                    <Button
                        size="lg"
                        className="w-full h-14 rounded-2xl text-base font-semibold bg-green-600 hover:bg-green-700 text-white border-0 transition-colors duration-200 flex-shrink-0"
                        onClick={handleWhatsApp}
                    >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Send via WhatsApp
                    </Button>
                </div>
            </div>
        </>
    );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {icon}
        <p className="text-[10px] text-white/35 uppercase tracking-wider mt-1">{label}</p>
        <p className="text-white font-semibold text-sm">{value}</p>
    </div>
);
