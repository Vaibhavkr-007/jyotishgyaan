import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ConsultationCard from '@/components/ConsultationCard.jsx';
import { consultationServices } from '@/data/consultationsData.js';

const ConsultationsPage = () => {
  useEffect(() => {
    console.log('[ConsultationsPage] Component mounted');
  }, []);

  return (
    <>
      <Helmet>
        <title>Personalized Consultations - Divya Khaneja</title>
        <meta name="description" content="Book a personalized spiritual consultation with Divya Khaneja. Choose from Tarot, Vedic Astrology, Reiki and Personalized Consultancy." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-24 overflow-hidden border-b border-border/30">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1621788894112-ddb767d097e1"
                alt="Traditional Indian Vedic imagery"
                className="vedic-hero-img w-full h-full object-cover"
              />
              <div className="absolute inset-0 vedic-hero-overlay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Spiritual Consultations
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed drop-shadow-sm">
                  Receive profound insights and spiritual guidance tailored specifically to your life's journey. Choose the format that best fits your schedule and depth of inquiry.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Specific Service Modalities */}
          <section className="py-20 relative bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                  Explore Healing Modalities
                </h2>
                <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                  Our comprehensive deep-dive services focus on specific spiritual traditions. Each modality provides unique tools for clarity and energetic balance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto py-4">
                {consultationServices.map((service, index) => (
                  <ConsultationCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/60 border-t border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-foreground">How It Works</h2>
                <div className="grid sm:grid-cols-3 gap-8 mt-12">
                  <div className="space-y-3 bg-card p-6 rounded-2xl shadow-sm border border-border transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold mb-4">1</div>
                    <h3 className="font-bold text-card-foreground text-lg">Choose Format</h3>
                    <p className="text-sm font-medium text-card-foreground/70">Select chat, audio, or video based on your time and preference.</p>
                  </div>
                  <div className="space-y-3 bg-card p-6 rounded-2xl shadow-sm border border-border transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold mb-4">2</div>
                    <h3 className="font-bold text-card-foreground text-lg">Book a Time</h3>
                    <p className="text-sm font-medium text-card-foreground/70">Pick a convenient date and time from the available slots.</p>
                  </div>
                  <div className="space-y-3 bg-card p-6 rounded-2xl shadow-sm border border-border transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold mb-4">3</div>
                    <h3 className="font-bold text-card-foreground text-lg">Gain Clarity</h3>
                    <p className="text-sm font-medium text-card-foreground/70">Join the session and receive personalized spiritual guidance.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConsultationsPage;