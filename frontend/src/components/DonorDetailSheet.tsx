import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, MapPin, Phone, Calendar, Clock, User, MessageCircle, Heart } from 'lucide-react';
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
}

export const DonorDetailSheet: React.FC<DonorDetailSheetProps> = ({ donor, isOpen, onClose }) => {
    if (!donor) return null;

    const handleWhatsApp = () => {
        const formattedPhone = donor.contact.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        style={{ zIndex: 9998 }}
                        onClick={onClose}
                    />

                    {/* Sheet - full screen, no scroll */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8,
                        }}
                        className="fixed inset-0 flex flex-col"
                        style={{
                            zIndex: 9999,
                            background: 'rgb(15, 15, 25)',
                        }}
                    >
                        {/* Top Bar */}
                        <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
                            <div className="w-10 h-1 rounded-full bg-white/30 mx-auto" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-white/70" />
                            </button>
                        </div>

                        {/* Content - flex layout to fill screen without scroll */}
                        <div className="flex-1 px-6 pb-6 flex flex-col justify-between max-w-2xl mx-auto w-full">
                            {/* Top Section: Header + Blood Type side by side */}
                            <div className="flex items-center gap-5 mb-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/30 to-red-700/30 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-7 h-7 text-red-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-2xl font-bold text-white truncate">{donor.name}</h2>
                                        <Badge
                                            variant={donor.available ? "default" : "secondary"}
                                            className={
                                                donor.available
                                                    ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-1"
                                                    : "bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs mt-1"
                                            }
                                        >
                                            <Heart className="w-3 h-3 mr-1" />
                                            {donor.available ? "Available" : "Unavailable"}
                                        </Badge>
                                    </div>
                                </div>
                                {/* Blood type inline */}
                                <div
                                    className="rounded-2xl px-6 py-3 text-center flex-shrink-0"
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                    }}
                                >
                                    <Droplet className="w-5 h-5 text-red-400 mx-auto mb-1" />
                                    <p className="text-3xl font-black text-red-400">{donor.bloodType}</p>
                                </div>
                            </div>

                            {/* Info Grid - 2x3 compact */}
                            <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
                                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <MapPin className="w-4 h-4 text-blue-400 mb-1" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">City</p>
                                    <p className="text-white font-semibold text-sm">{donor.city}</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Clock className="w-4 h-4 text-amber-400 mb-1" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Distance</p>
                                    <p className="text-white font-semibold text-sm">{donor.distance || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <User className="w-4 h-4 text-purple-400 mb-1" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Age</p>
                                    <p className="text-white font-semibold text-sm">{donor.age ? `${donor.age} yrs` : 'N/A'}</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Calendar className="w-4 h-4 text-green-400 mb-1" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Last Donated</p>
                                    <p className="text-white font-semibold text-sm">
                                        {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                                    </p>
                                </div>
                                {donor.address && (
                                    <div className="rounded-xl p-3 col-span-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <MapPin className="w-4 h-4 text-blue-400 mb-1" />
                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Address</p>
                                        <p className="text-white font-semibold text-sm truncate">{donor.address}, {donor.city}</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="rounded-xl p-4 mb-4 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Phone className="w-4 h-4 text-green-400" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Contact Number</p>
                                </div>
                                <p className="text-white/90 text-lg font-semibold">{donor.contact}</p>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Action Button */}
                            <Button
                                size="lg"
                                className="w-full h-14 rounded-2xl text-base font-semibold bg-green-600 hover:bg-green-700 text-white border-0 flex-shrink-0"
                                onClick={handleWhatsApp}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                WhatsApp
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
