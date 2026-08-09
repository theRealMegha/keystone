import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter street address or location...",
  required = false,
  className = ""
}) => {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              onChange(data.display_name);
              setLocating(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Reverse geocode fallback to coordinates", e);
        }
        onChange(`GPS Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocating(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve GPS location. Please check browser permissions.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex gap-2">
        <div className="ks-input-group flex-1">
          <span className="ks-input-icon">
            <MapPin size={16} />
          </span>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ks-input text-xs"
            required={required}
          />
        </div>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={locating}
          className="ks-btn-secondary text-xs px-3 shrink-0 flex items-center gap-1.5 h-[42px] border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          title="Detect and insert my current GPS location"
        >
          {locating ? (
            <Loader2 size={14} className="animate-spin text-cyan-400" />
          ) : (
            <Navigation size={14} className="text-cyan-400" />
          )}
          <span className="hidden sm:inline">{locating ? "Locating..." : "Use My Location"}</span>
        </button>
      </div>
      {error && <p className="text-[10px] text-red-400 font-mono mt-1">{error}</p>}
    </div>
  );
};
