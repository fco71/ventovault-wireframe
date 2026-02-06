import { motion } from 'framer-motion';
import { Shield, Zap, Globe } from 'lucide-react';

export default function HeroBrandStatement() {
  const badges = [
    { icon: Shield, text: 'Technical Agent' },
    { icon: Globe, text: 'Licensed Partners' },
    { icon: Zap, text: 'Zero Custody' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 mb-5 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-600">VentoVault</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="text-gray-900">VentoVault</span>
        <br />
        <span className="gradient-text">Orchestrates Cross-Border Money</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 font-medium"
      >
        Brand-first technical agent architecture with zero-custody design and licensed payout partners.
      </motion.p>

      {/* Value Props Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {badges.map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-all"
          >
            <badge.icon className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-gray-900">{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
