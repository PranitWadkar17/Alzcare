'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationPage() {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError('');
      },
      () => {
        setError("Permission denied or error fetching location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="text-emerald-400" />
          Location Tracking
        </h1>
        <p className="text-slate-400 text-sm">
          Check your current location
        </p>
      </div>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={getLocation}
        className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl text-sm mb-6"
      >
        Get Current Location
      </motion.button>

      {/* Result */}
      {location && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm">Latitude: {location.lat}</p>
          <p className="text-sm">Longitude: {location.lng}</p>

          {/* Open in Google Maps */}
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            className="text-emerald-400 text-sm underline mt-3 inline-block"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

    </div>
  );
}