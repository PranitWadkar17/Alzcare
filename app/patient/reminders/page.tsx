"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [now, setNow] = useState(new Date());

  // ⏱ LIVE CLOCK
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // 🔔 PERMISSION
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 📦 LOAD
  useEffect(() => {
    const data = localStorage.getItem("reminders");
    if (data) setReminders(JSON.parse(data));
  }, []);

  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  // 🔊 SOUND
  const playSound = () => {
    const audio = new Audio("/alert.mp3"); // put file in public folder
    audio.play();
  };

  // 📱 VIBRATION
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
  };

  // ⏰ TIME → MINUTES
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  // 🔔 ALERT ENGINE
  useEffect(() => {
    reminders.forEach((r) => {
      const reminderMinutes = toMinutes(r.time);

      if (
        reminderMinutes === currentMinutes &&
        !r.triggered &&
        !r.done
      ) {
        // 🔔 Notification
        if (Notification.permission === "granted") {
          new Notification("Reminder", {
            body: r.text,
          });
        }

        playSound();
        vibrate();

        setReminders((prev) =>
          prev.map((item) =>
            item.id === r.id
              ? { ...item, triggered: true }
              : item
          )
        );
      }
    });
  }, [now]);

  // ➕ ADD
  const addReminder = () => {
    if (!text || !time) return;

    setReminders([
      ...reminders,
      {
        id: Date.now(),
        text,
        time,
        done: false,
        triggered: false,
      },
    ]);

    setText("");
    setTime("");
  };

  // ✅ DONE
  const markDone = (id: number) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, done: true } : r
    ));
  };

  // ❌ DELETE
  const del = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // ⏳ COUNTDOWN
  const countdown = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0);

    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Now";

    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);

    return `${min}m ${sec}s`;
  };

  // 🧠 LOGIC
  const processed = reminders.map(r => {
    const minutes = toMinutes(r.time);

    return {
      ...r,
      missed: !r.done && minutes < currentMinutes,
      next: !r.done && minutes >= currentMinutes,
    };
  });

  const missed = processed.filter(r => r.missed);
  const upcoming = processed.filter(r => r.next);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex gap-2 mb-6">
        <Bell className="text-emerald-400"/> Smart Reminders
      </h1>

      {/* ADD */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Reminder (e.g. Medicine)"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10"
        />

        <input
          type="time"
          value={time}
          onChange={(e)=>setTime(e.target.value)}
          className="p-3 bg-white/5 rounded-xl border border-white/10"
        />

        <button
          onClick={addReminder}
          className="bg-emerald-500 px-4 rounded-xl"
        >
          <Plus/>
        </button>
      </div>

      {/* MISSED */}
      {missed.length > 0 && (
        <div className="mb-6">
          <h2 className="text-red-400 mb-2">Missed</h2>

          {missed.map(r => (
            <motion.div
              key={r.id}
              className="p-4 mb-3 bg-red-500/10 border border-red-500/20 rounded-xl flex justify-between"
            >
              <div>
                <p>{r.text}</p>
                <p className="text-xs">{r.time}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>markDone(r.id)}>
                  <CheckCircle/>
                </button>
                <button onClick={()=>del(r.id)}>
                  <Trash2/>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* NEXT */}
      <div>
        <h2 className="mb-2">Upcoming</h2>

        {upcoming.length === 0 ? (
          <div className="text-center p-6 bg-white/5 rounded-xl">
            No reminders yet 📝
          </div>
        ) : (
          upcoming.map(r => (
            <motion.div
              key={r.id}
              className="p-4 mb-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex justify-between"
            >
              <div>
                <p className="text-xs text-emerald-400">
                  ⏳ {countdown(r.time)}
                </p>
                <p>{r.text}</p>
                <p className="text-xs text-slate-400">{r.time}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>markDone(r.id)}>
                  <CheckCircle/>
                </button>
                <button onClick={()=>del(r.id)}>
                  <Trash2/>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}