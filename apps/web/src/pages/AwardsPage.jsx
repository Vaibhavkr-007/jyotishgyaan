
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AwardCard from '@/components/AwardCard.jsx';
import { awardsData } from '@/data/awardsData.js';

const AwardsPage = () => {
  return (
    <>
      <Helmet>
        <title>Awards & Recognition - Divya Khaneja</title>
        <meta name="description" content="Discover the awards and global recognition received by Divya Khaneja for excellence in Vedic astrology, Reiki healing, and spiritual education." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1619879310659-01e83a8e9d6b"
                alt="Mystical background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 vedic-hero-overlay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm mb-6">
                  <Trophy className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Global Recognition</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Awards & Recognition
                </h1>
                
                <p className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed">
                  Honoring decades of dedication to preserving ancient Vedic wisdom, fostering spiritual growth, and leading with compassionate guidance.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Awards Grid */}
          <section className="py-20 relative bg-card/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
                {awardsData.map((award, index) => (
                  <AwardCard key={award.id} award={award} index={index} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AwardsPage;
