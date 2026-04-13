'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Activity } from 'lucide-react';
import { Mic } from 'lucide-react';
export default function ActivityLog() {
  const [activities, setActivities] = useState([
    { id: 1, time: "10:30 AM", text: "Took Medicine" },
    { id: 2, time: "11:00 AM", text: "Went for Walk" },
  ]);

  const [newActivity, setNewActivity] = useState("");
  const [listening, setListening] = useState(false);
  const startListening = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    setListening(true);

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewActivity(transcript);
        setTimeout(() => addActivity(), 500);
        setListening(false);
    };

    recognition.onerror = () => {
        setListening(false);
    };

    recognition.onend = () => {
        setListening(false);
    };
    };
    useEffect(() => {
        const stored = localStorage.getItem("activities");
        if (stored) {
            setActivities(JSON.parse(stored));
        }
        }, []);
    // Add Activity
    const addActivity = () => {
        if (!newActivity.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry = {
      id: Date.now(),
      time,
      text: newActivity,
    };

    const updatedActivities = [newEntry, ...activities];
    setActivities(updatedActivities);

    // SAVE TO LOCALSTORAGE
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    setNewActivity("");
  };

  // Delete Activity
  const deleteActivity = (id: number) => {
    const confirmDelete = window.confirm("Delete this activity?");
    if (!confirmDelete) return;

    setActivities(activities.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-emerald-400" />
          Activity Log
        </h1>
        <p className="text-slate-400 text-sm">
          Track your daily activities
        </p>
      </div>

      {/* Add Activity */}
      <div className="flex gap-3 mb-6">

  <input
    type="text"
    placeholder="What did you do?"
    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-sm"
    value={newActivity}
    onChange={(e) => setNewActivity(e.target.value)}
  />

  {/* 🎤 MIC BUTTON */}
    <button
        onClick={startListening}
        className={`px-3 rounded-xl ${
        listening
            ? 'bg-red-500 animate-pulse'
            : 'bg-slate-700 hover:bg-slate-600'
        }`}
    >
        <Mic size={18} />
    </button>

    <button
        onClick={addActivity}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm"
    >
        Add
    </button>

    </div>
        

      {/* Activity List */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/10">
            <p className="text-slate-400 text-sm">No activities yet</p>
          </div>
        ) : (
          activities.map((act) => (
            <motion.div
              key={act.id}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div>
                <p className="text-sm">{act.text}</p>
                <span className="text-xs text-slate-400">
                  {act.time}
                </span>
              </div>

              <button
                onClick={() => deleteActivity(act.id)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}