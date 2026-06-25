
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CourseCard from '@/components/CourseCard.jsx';
import { astrologyCourses } from '@/data/coursesData';

const AstrologyPage = () => {
  return (
    <>
      <Helmet>
        <title>Vedic Astrology Courses - Divya Khaneja</title>
        <meta name="description" content="Master the ancient science of Vedic astrology. Learn to read birth charts, understand planetary influences, and guide others through cosmic wisdom." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1685478237361-a5b50d0eb76b"
                alt="Jyotish zodiac wheel"
                className="vedic-hero-img"
              />
              <div className="absolute inset-0 vedic-hero-overlay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Vedic Astrology Education
                </h1>
                <p className="text-lg text-foreground/80 font-medium leading-relaxed drop-shadow-sm">
                  Discover the profound wisdom of Vedic astrology and learn to interpret the cosmic blueprint of human destiny. Our comprehensive courses guide you from foundational principles to advanced predictive techniques.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-card-foreground">What You Will Learn</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-base">
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-card-foreground">Foundational Knowledge</h3>
                        <ul className="space-y-2 text-card-foreground/70">
                          <li>Understanding the 12 zodiac signs and their qualities</li>
                          <li>Planetary influences and their meanings</li>
                          <li>House systems and their significance</li>
                          <li>Reading and interpreting birth charts</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-card-foreground">Advanced Techniques</h3>
                        <ul className="space-y-2 text-card-foreground/70">
                          <li>Dasha systems and timing of events</li>
                          <li>Planetary transits and their effects</li>
                          <li>Relationship compatibility analysis</li>
                          <li>Remedial measures and spiritual guidance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Available Courses</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto py-4 mb-16">
                {astrologyCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
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

export default AstrologyPage;
