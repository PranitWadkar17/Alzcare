'use client'

import { motion } from "framer-motion"
import { Pill, MapPin, Shield, Heart } from "lucide-react"

export default function LoginFeaturePanel() {

  const features = [
    {
      icon: Pill,
      title: "Smart Medication Reminders",
      desc: "Never miss important medication with automated reminders."
    },
    {
      icon: MapPin,
      title: "Live Location Monitoring",
      desc: "Caregivers can monitor patient safety in real time."
    },
    {
      icon: Shield,
      title: "Emergency Alerts",
      desc: "Instant notifications when a patient needs help."
    },
    {
      icon: Heart,
      title: "Caregiver Support",
      desc: "Tools designed to reduce caregiver stress."
    }
  ]

  return (
    <div className="hidden lg:block">

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >

        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Smarter Care for Alzheimer’s Patients
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed">
            AlzCare helps families manage medication, track safety,
            and support caregivers with intelligent monitoring.
          </p>
        </div>

        <div className="grid gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >

              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-emerald-400"/>
              </div>

              <div>
                <h4 className="text-white font-semibold">
                  {feature.title}
                </h4>

                <p className="text-slate-400 text-sm">
                  {feature.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        <div className="flex gap-6 text-sm text-slate-500 pt-4">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4"/> HIPAA Compliant
          </span>

          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4"/> 24/7 Monitoring
          </span>
        </div>

      </motion.div>

    </div>
  )
}