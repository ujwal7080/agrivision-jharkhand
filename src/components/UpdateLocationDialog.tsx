"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpdateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationUpdated: () => void;
}

export default function UpdateLocationDialog({
  open,
  onOpenChange,
  onLocationUpdated,
}: UpdateLocationDialogProps) {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim()) {
      toast.error("Please enter your district");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location: location.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      toast.success("Location updated successfully!");
      onLocationUpdated();
      onOpenChange(false);
      setLocation("");
    } catch (error) {
      toast.error("Failed to update location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-5 h-5 text-green-600" />
            {t("profile.updateLocation") || "Set Your Location"}
          </DialogTitle>
          <DialogDescription>
            Enter your district to see local weather information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              {t("register.district") || "District"}
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Ranchi, Dhanbad, Bokaro..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
            <p className="text-xs text-gray-500">
              Available districts: Ranchi, Dhanbad, Bokaro, Jamshedpur,
              Giridih, Hazaribagh, and more
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.loading") || "Saving..."}
                </>
              ) : (
                t("common.save") || "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
