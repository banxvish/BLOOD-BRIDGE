import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

// Custom RED marker for user location
const userIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444" stroke="#991B1B" stroke-width="1"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

// Custom BLUE arrow marker for donors
const donorIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1"/>
        <path d="M12 6l3 5h-2v3h-2v-3H9l3-5z" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

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
    latitude: number | null;
    longitude: number | null;
}

interface MapTabProps {
    donors: Donor[];
    userLocation?: { lat: number; lng: number } | null;
    onDonorSelect?: (donor: Donor) => void;
}

export const MapTab: React.FC<MapTabProps> = ({ donors, userLocation, onDonorSelect }) => {
    // Default center (India center roughly)
    const defaultCenter: [number, number] = [20.5937, 78.9629];
    const center = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : defaultCenter;
    const zoom = userLocation ? 12 : 5;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-border shadow-sm">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="font-semibold text-red-600">📍 You are here</div>
                        </Popup>
                    </Marker>
                )}

                {donors.filter(d => d.latitude && d.longitude).map((donor) => (
                    <Marker
                        key={donor.id}
                        position={[donor.latitude!, donor.longitude!]}
                        icon={donorIcon}
                    >
                        <Popup className="donor-popup">
                            <div className="flex flex-col gap-2 p-4 min-w-[220px]">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-base leading-tight text-white">{donor.name}</h3>
                                    <Badge variant="destructive" className="ml-2 font-bold text-sm">
                                        {donor.bloodType}
                                    </Badge>
                                </div>

                                <div className="text-sm text-gray-400 mt-1">
                                    📍 {donor.address ? `${donor.address}, ` : ""}{donor.city}
                                </div>

                                <div className="flex gap-2 mt-1">
                                    <Badge variant={donor.available ? "default" : "secondary"} className={donor.available ? "bg-green-600/20 text-green-400 border-green-600/30 text-xs" : "text-xs"}>
                                        {donor.available ? "Available" : "Unavailable"}
                                    </Badge>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <Button
                                        size="sm"
                                        variant="hero"
                                        className="w-full h-9"
                                        onClick={() => onDonorSelect?.(donor)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Show Details
                                    </Button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
