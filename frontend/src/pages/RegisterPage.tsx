import { useState } from "react";
import { motion } from "framer-motion";
import { Droplet, MapPin, Phone, User, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegisterPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      bloodType: formData.get("bloodType") as string,
      contact: formData.get("contact") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string || undefined,
      age: parseInt(formData.get("age") as string, 10),
      lastDonation: formData.get("lastDonation") ? new Date(formData.get("lastDonation") as string).toISOString() : undefined,
      available: formData.get("available") !== null, // checkbox returns "on" if checked
    };

    setIsSubmitting(true);

    let lat = undefined;
    let lng = undefined;

    // Geocode the address + city to get lat/long
    try {
      const searchAddress = `${data.address || ''} ${data.city}`.trim();
      if (searchAddress) {
        const query = encodeURIComponent(searchAddress);
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const geoData = await geoRes.json();

        if (geoData && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        } else {
          toast.error("Location Not Found", {
            description: "We couldn't exactly map coordinates for this address, but your profile will still be saved.",
          });
        }
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }

    // Build final payload
    const payload = {
      ...data,
      latitude: lat,
      longitude: lng
    };

    try {
      const response = await fetch("http://localhost:3000/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Registration failed");

      setSubmitted(true);
      toast.success("Registration Successful!", {
        description: "Thank you for registering as a blood donor.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to register donor. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 px-6 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-3">You're Registered!</h2>
            <p className="text-muted-foreground mb-6">
              Your donor profile is now active. You'll be notified when someone nearby needs your blood type.
            </p>
            <Button variant="hero" onClick={() => setSubmitted(false)}>Register Another Donor</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 px-6 pb-12">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Become a Donor</h1>
            <p className="text-muted-foreground text-lg mb-8">Register your profile to help save lives in emergencies</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Full Name
                </Label>
                <Input name="name" placeholder="Enter your full name" className="bg-background border-border" required />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-primary" /> Blood Group
                </Label>
                <Select name="bloodType" required>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Contact Number
                </Label>
                <Input name="contact" placeholder="+91 XXXXX XXXXX" className="bg-background border-border" required />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> City / Location
                </Label>
                <Input name="city" placeholder="Enter your city" className="bg-background border-border" required />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Full Address
                </Label>
                <Input name="address" placeholder="e.g. 123 Health Street, Near Main Hospital" className="bg-background border-border" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Last Donation Date
                </Label>
                <Input name="lastDonation" type="date" className="bg-background border-border" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">Age</Label>
                <Input name="age" type="number" placeholder="Enter your age" min="18" max="65" className="bg-background border-border" required />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
              <div>
                <p className="font-medium">Available for Donation</p>
                <p className="text-sm text-muted-foreground">Toggle on when you're available to donate</p>
              </div>
              <Switch name="available" defaultChecked />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full text-base py-6" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register as Donor"}
            </Button>
          </motion.form>
        </div>
      </div >
    </div >
  );
};

export default RegisterPage;
