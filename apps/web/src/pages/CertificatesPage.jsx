
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileBadge } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CertificateCard from '@/components/CertificateCard.jsx';
import CertificateModal from '@/components/CertificateModal.jsx';
import { certificatesData } from '@/data/certificatesData.js';

const CertificatesPage = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <>
      <Helmet>
        <title>Certificates & Credentials - Divya Khaneja</title>
        <meta name="description" content="Explore the professional credentials, degrees, and certifications of Divya Khaneja across Vedic Astrology, Reiki, and Tarot Reading." />
      </Helmet>

      <div className="min-h-screen flex flex-col relative bg-tangerine-fallback">
        {/* Global Background for Certificates Page */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1644212054093-e5924f084240"
            alt="Sacred geometry mandala background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 certificates-bg-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/90"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/20 bg-background/40 backdrop-blur-sm">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl mx-auto text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm mb-6">
                    <FileBadge className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">Professional Recognition</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground drop-shadow-sm" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                    Certificates & Credentials
                  </h1>
                  
                  <p className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed drop-shadow-sm">
                    A comprehensive showcase of professional qualifications validating decades of rigorous study and mastery in holistic healing and ancient sciences.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Grid Section */}
            <section className="py-20 relative">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
                  {certificatesData.map((cert, index) => (
                    <CertificateCard 
                      key={cert.id} 
                      certificate={cert} 
                      index={index} 
                      onClick={setSelectedCertificate}
                    />
                  ))}
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>

      <CertificateModal 
        isOpen={!!selectedCertificate} 
        onClose={() => setSelectedCertificate(null)} 
        certificate={selectedCertificate} 
      />
    </>
  );
};

export default CertificatesPage;
