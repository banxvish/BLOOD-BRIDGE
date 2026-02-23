import React, { useState } from 'react';
import { X, Droplet, MapPin, Phone, Calendar, Clock, User, MessageCircle, Heart, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const userIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444" stroke="#991B1B" stroke-width="1"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const donorIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1"/>
        <path d="M12 6l3 5h-2v3h-2v-3H9l3-5z" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const MapUpdater = ({ positions }: { positions: [number, number][] }) => {
    const map = useMap();
    React.useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [map, positions]);
    return null;
};

interface DonorDetailSheetProps {
    donor: Donor | null;
    isOpen: boolean;
    onClose: () => void;
    seekerLocation?: string;
    searchedBloodType?: string;
    defaultUrgency?: string;
    userCoords?: { lat: number; lng: number } | null;
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

export const DonorDetailSheet: React.FC<DonorDetailSheetProps> = ({ donor, isOpen, onClose, seekerLocation, searchedBloodType, defaultUrgency, userCoords }) => {
    const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>('high');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [routeData, setRouteData] = useState<[number, number][]>([]);
    const [etaInfo, setEtaInfo] = useState<{ duration: string, distance: string } | null>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            if (defaultUrgency && ['critical', 'high', 'normal'].includes(defaultUrgency)) {
                setSelectedUrgency(defaultUrgency as UrgencyLevel);
            } else {
                setSelectedUrgency('high');
            }

            // Fetch Route from OSRM
            if (donor?.latitude && donor?.longitude && userCoords?.lat && userCoords?.lng) {
                setIsLoadingRoute(true);
                const url = `https://router.project-osrm.org/route/v1/driving/${userCoords.lng},${userCoords.lat};${donor.longitude},${donor.latitude}?overview=full&geometries=geojson`;
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                            const route = data.routes[0];
                            const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
                            setRouteData(coords);

                            const durationMins = Math.round(route.duration / 60);
                            const distanceKm = (route.distance / 1000).toFixed(1);
                            setEtaInfo({
                                duration: `${durationMins} mins`,
                                distance: `${distanceKm} km`
                            });
                        }
                    })
                    .catch(err => console.error("OSRM Error:", err))
                    .finally(() => setIsLoadingRoute(false));
            }

        } else {
            setAiResult(null);
            setIsAnalyzing(false);
            setRouteData([]);
            setEtaInfo(null);
        }
    }, [isOpen, defaultUrgency, donor, userCoords]);

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

    const runAIAnalysis = () => {
        setIsAnalyzing(true);
        setAiResult(null);

        // Simulate network delay for AI analysis
        setTimeout(() => {
            // --- PRIMARY DRIVER: Days since last donation ---
            const today = new Date();
            let daysSinceDonation: number | null = null;

            if (donor.lastDonation) {
                const lastDate = new Date(donor.lastDonation);
                const diffMs = today.getTime() - lastDate.getTime();
                daysSinceDonation = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            }

            // Base score from days since last donation (most critical factor)
            let score = 95;
            let reason = "";
            const warnings: string[] = [];

            if (daysSinceDonation === null) {
                // No donation history — likely eligible, moderate-high confidence
                score = 75;
                reason = `No prior donation history recorded. This donor is likely eligible and fully rested.`;
            } else if (daysSinceDonation < 56) {
                // Donated less than 56 days ago — medically ineligible (whole blood requires 56 days min)
                score = 5;
                reason = `Medically INELIGIBLE. Their last donation was only ${daysSinceDonation} days ago. A minimum of 56 days must pass between whole blood donations for safety.`;
                warnings.push(`Eligibility: Last donated ${daysSinceDonation} days ago (min 56 days required).`);
            } else if (daysSinceDonation < 90) {
                // 56–89 days — technically eligible but very recently donated
                score = 25;
                reason = `Technically eligible but recently active. ${daysSinceDonation} days have passed since their last donation. They may feel somewhat fatigued.`;
                warnings.push(`Caution: Only ${daysSinceDonation} days since last donation. Recovery may be incomplete.`);
            } else if (daysSinceDonation < 180) {
                // 90–179 days — eligible and reasonably rested
                score = 55;
                reason = `Eligible with moderate confidence. ${daysSinceDonation} days have passed since their last donation. They are physically cleared to donate.`;
            } else if (daysSinceDonation < 365) {
                // 180–364 days — well-rested, great candidate
                score = 75;
                reason = `Strong match. ${daysSinceDonation} days since last donation — they are well-rested and at peak eligibility.`;
            } else {
                // 365+ days — prime candidate, long since donated
                score = 95;
                reason = `Excellent match. ${daysSinceDonation} days (${Math.floor(daysSinceDonation / 30)} months) since last donation — this donor is at optimal eligibility.`;
            }

            // --- SECONDARY: Availability check ---
            if (!donor.available) {
                score = Math.max(5, score - 30);
                warnings.push("Status: Donor has marked themselves as currently UNAVAILABLE.");
            }

            // --- SECONDARY: Distance penalty ---
            if (donor.distance && donor.distance.includes('km')) {
                const dist = parseFloat(donor.distance);
                if (dist > 50) {
                    score = Math.max(5, score - 20);
                    warnings.push(`Distance: Very far (${dist.toFixed(1)} km away). May cause significant delays.`);
                } else if (dist > 20) {
                    score = Math.max(5, score - 10);
                    warnings.push(`Distance: ${dist.toFixed(1)} km away — moderate travel time expected.`);
                }
            }

            // Snap to allowed scale [5, 25, 55, 75, 95]
            const allowedScores = [5, 25, 55, 75, 95];
            const clampedScore = Math.max(0, Math.min(100, score));
            const finalScore = allowedScores.reduce((prev, curr) =>
                Math.abs(curr - clampedScore) < Math.abs(prev - clampedScore) ? curr : prev
            );

            // Construct final output
            let finalOutput = `⚡ Gemini AI Match Score: ${finalScore}%\n\n${reason}`;
            if (warnings.length > 0) {
                finalOutput += "\n\n⚠️ Priority Flags:\n• " + warnings.join("\n• ");
            }

            setAiResult(finalOutput);
            setIsAnalyzing(false);
        }, 1500);
    };

    const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {icon}
            <p className="text-[10px] text-white/35 uppercase tracking-wider mt-1">{label}</p>
            <p className="text-white font-semibold text-sm">{value}</p>
        </div>
    );

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

                    {/* Live ETA & Routing Map */}
                    {donor.latitude && donor.longitude && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 relative" style={{ height: '180px' }}>
                            {isLoadingRoute ? (
                                <div className="absolute inset-0 bg-white/5 flex items-center justify-center z-10 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                                        Fetching live traffic route...
                                    </div>
                                </div>
                            ) : etaInfo && (
                                <div className="absolute top-2 left-2 z-[999]" style={{ pointerEvents: 'none' }}>
                                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 shadow-lg flex items-center gap-3">
                                        <div>
                                            <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Driving ETA</p>
                                            <p className="text-white font-bold text-lg leading-tight text-green-400">{etaInfo.duration}</p>
                                        </div>
                                        <div className="w-px h-6 bg-white/20"></div>
                                        <div>
                                            <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Distance</p>
                                            <p className="text-white/90 font-medium text-sm leading-tight">{etaInfo.distance}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!userCoords && (
                                <div className="absolute top-2 left-2 z-[999]" style={{ pointerEvents: 'none' }}>
                                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                                        <p className="text-[10px] text-white/50">📍 Enable location for routing & ETA</p>
                                    </div>
                                </div>
                            )}

                            <MapContainer
                                center={[donor.latitude, donor.longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                                zoomControl={false}
                                dragging={true}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; CARTO'
                                />
                                <Marker position={[donor.latitude, donor.longitude]} icon={donorIcon} />

                                {userCoords && (
                                    <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon} />
                                )}

                                {routeData.length > 0 && (
                                    <>
                                        <Polyline
                                            positions={routeData}
                                            color="#3B82F6"
                                            weight={4}
                                            opacity={0.8}
                                        />
                                        <MapUpdater positions={routeData} />
                                    </>
                                )}
                            </MapContainer>
                        </div>
                    )}

                    {/* Contact */}
                    <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-green-400" />
                            <p className="text-[10px] text-white/35 uppercase tracking-wider">Contact Number</p>
                        </div>
                        <p className="text-white/90 text-lg font-semibold">{donor.contact}</p>
                    </div>

                    {/* AI Matcher Section */}
                    <div className="mb-4">
                        {!aiResult && !isAnalyzing ? (
                            <Button
                                variant="outline"
                                className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/30 transition-all duration-300"
                                onClick={runAIAnalysis}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Run AI Exact-Match Analysis
                            </Button>
                        ) : isAnalyzing ? (
                            <div className="rounded-xl p-4 flex flex-col items-center justify-center animate-pulse" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <Sparkles className="w-5 h-5 text-purple-400 mb-2 animate-spin" />
                                <p className="text-xs text-purple-400 font-medium">Gemini AI is analyzing compatibility...</p>
                            </div>
                        ) : (
                            <div className="rounded-xl p-4" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                <div className="flex items-center gap-2 mb-2 border-b border-purple-500/20 pb-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Analysis Complete</p>
                                </div>
                                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
                                    {aiResult}
                                </p>
                            </div>
                        )}
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

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors duration-200"
                            onClick={() => window.open(`tel:${donor.contact.replace(/[^0-9+]/g, '')}`, '_self')}
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Call Donor
                        </Button>

                        <Button
                            size="lg"
                            className="w-full h-14 rounded-xl text-base font-semibold bg-green-600 hover:bg-green-700 text-white border-0 transition-colors duration-200"
                            onClick={handleWhatsApp}
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
