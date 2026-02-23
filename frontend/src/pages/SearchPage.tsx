import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Phone, Clock, User, Droplet, Map as MapIcon, List, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapTab } from "@/components/MapTab";
import { DonorDetailSheet } from "@/components/DonorDetailSheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Fetch donors from the backend
const fetchDonors = async ({ queryKey }: any) => {
  const [_key, lat, lng] = queryKey;
  let url = "https://blood-bridge-production.up.railway.app/api/donors";
  if (lat && lng) {
    url += `?lat=${lat}&lng=${lng}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch donors");
  }
  return response.json();
};

const SearchPage = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userCity, setUserCity] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: donors = [], isLoading, isError } = useQuery({
    queryKey: ["donors", userLocation?.lat, userLocation?.lng],
    queryFn: fetchDonors,
    staleTime: 0,        // Always consider data stale → refetch on every visit
    gcTime: 30000,       // Clear cache after 30 seconds
    refetchOnWindowFocus: true,  // Refetch when user switches back to tab
  });

  // Auto-detect user city on page load (silent — no alert on failure)
  useEffect(() => {
    if (userCity) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
            .then(res => res.json())
            .then(data => {
              const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || data.address?.state || '';
              const area = data.address?.suburb || data.address?.neighbourhood || '';
              setUserCity(area ? `${area}, ${city}` : city);
            })
            .catch(() => { });
        },
        () => { } // silently ignore errors
      );
    }
  }, []);

  const handleGeolocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Reverse geocode to get city name
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
            .then(res => res.json())
            .then(data => {
              const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || data.address?.state || '';
              const area = data.address?.suburb || data.address?.neighbourhood || '';
              const detectedLoc = area ? `${area}, ${city}` : city;
              setUserCity(detectedLoc);
              toast.success("Location Detected", {
                description: `We've found you near ${detectedLoc}`,
              });
            })
            .catch(() => {
              toast.error("Geocoding Failed", { description: "We got your coordinates but couldn't resolve the city name." });
            });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Location Access Denied", {
            description: "Couldn't get your location. Please check browser permissions.",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Unsupported", { description: "Geolocation is not supported by your browser." });
      setIsLocating(false);
    }
  };

  const filteredDonors = donors.filter((donor: any) => {
    // 1. Blood type filter
    if (selectedBloodType && selectedBloodType !== "all" && donor.bloodType !== selectedBloodType) return false;

    // 2. Search query filter
    if (searchQuery && !donor.city.toLowerCase().includes(searchQuery.toLowerCase()) && !donor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // 3. Auto-detected City filter (strict mode if location is enabled)
    if (userCity) {
      const uCity = userCity.toLowerCase();
      const dCity = donor.city.toLowerCase();
      // Allow if the donor's city is anywhere in the user's detected location string (e.g. "Bandra, Mumbai" includes "Mumbai")
      // OR if the user's detected location is in the donor's city string
      if (!uCity.includes(dCity) && !dCity.includes(uCity)) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 px-4 pb-4">
          <div className="container max-w-6xl mx-auto">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-1">Find Donors</h1>
              <p className="text-muted-foreground text-base mb-4">Search for compatible blood donors near you</p>
            </div>

            {/* Filters */}
            <div
              className="glass-card rounded-xl p-4 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by city or name..."
                    className="pl-10 bg-background border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Urgency Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical — Immediate</SelectItem>
                    <SelectItem value="high">High — Within hours</SelectItem>
                    <SelectItem value="normal">Normal — Scheduled</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="hero" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Donors
                </Button>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <Button
                  variant={userLocation ? "default" : "outline"}
                  onClick={handleGeolocation}
                  disabled={isLocating}
                  className={userLocation ? "bg-primary text-primary-foreground" : ""}
                >
                  <Navigation className={`w-4 h-4 mr-2 ${isLocating ? "animate-spin" : ""}`} />
                  {isLocating ? "Locating..." : userLocation ? "Using Your Location" : "Use My Location"}
                </Button>

                <div className="flex bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-md"
                  >
                    <List className="w-4 h-4 mr-2" /> List
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="rounded-md"
                  >
                    <MapIcon className="w-4 h-4 mr-2" /> Map
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className={viewMode === "map" ? "flex gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl p-5 animate-pulse min-h-[160px] flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                        <div className="h-3 bg-white/5 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-9 bg-white/5 rounded w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16 text-destructive">
                <h3 className="font-heading text-xl font-semibold mb-2">Failed to load donors</h3>
                <p>Please check if the backend server is running on port 3000.</p>
              </div>
            ) : viewMode === "map" ? (
              <div className="flex gap-4" style={{ height: 'calc(100vh - 300px)' }}>
                {/* Donor list on the left */}
                <div className="w-[340px] flex-shrink-0 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {filteredDonors.map((donor: any) => (
                    <div
                      key={donor.id}
                      className="glass-card rounded-xl p-4 hover:glow-border transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedDonor(donor);
                        setIsSheetOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-heading font-semibold text-sm">{donor.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {donor.city}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{donor.bloodType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={donor.available ? "default" : "secondary"} className={donor.available ? "bg-green-600/20 text-green-400 border-green-600/30 text-xs" : "text-xs"}>
                          {donor.available ? "Available" : "Unavailable"}
                        </Badge>
                        {donor.distance && <span className="text-xs text-muted-foreground">{donor.distance}</span>}
                      </div>
                    </div>
                  ))}
                  {filteredDonors.length === 0 && (
                    <div className="text-center py-8">
                      <Droplet className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No donors found</p>
                    </div>
                  )}
                </div>
                {/* Map on the right */}
                <div className="flex-1">
                  <MapTab donors={filteredDonors} userLocation={userLocation} onDonorSelect={(donor) => { setSelectedDonor(donor); setIsSheetOpen(true); }} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDonors.map((donor: any, index: number) => (
                  <div
                    key={donor.id}
                    className="glass-card rounded-xl p-5 hover:glow-border transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold">{donor.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {donor.city} · {donor.distance}
                          </p>
                        </div>
                      </div>
                      <Badge variant={donor.available ? "default" : "secondary"} className={donor.available ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}>
                        {donor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Droplet className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">{donor.bloodType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Last: {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                      </div>
                    </div>

                    <Button
                      variant={donor.available ? "hero" : "secondary"}
                      size="sm"
                      className="w-full"
                      disabled={!donor.available}
                      onClick={() => {
                        setSelectedDonor(donor);
                        setIsSheetOpen(true);
                      }}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {donor.available ? "Contact Donor" : "Not Available"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {filteredDonors.length === 0 && (
              <div className="text-center py-16">
                <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">No donors found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DonorDetailSheet
        donor={selectedDonor}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        seekerLocation={userCity}
        searchedBloodType={selectedBloodType}
        defaultUrgency={urgency}
        userCoords={userLocation}
      />
    </>
  );
};

export default SearchPage;
