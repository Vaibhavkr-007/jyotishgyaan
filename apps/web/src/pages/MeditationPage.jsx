
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CourseCard from '@/components/CourseCard.jsx';
import { meditationCourses } from '@/data/coursesData';

const MeditationPage = () => {
  return (
    <>
      <Helmet>
        <title>Meditation & Mindfulness Courses - Divya Khaneja</title>
        <meta name="description" content="Learn powerful meditation techniques to cultivate inner peace, clarity, and spiritual awakening. From chakra meditation to transcendental practices." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1701709488066-8d32fe5871b8"
                alt="Meditation ashram and yoga setting"
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
                  Meditation & Mindfulness
                </h1>
                <p className="text-lg font-medium text-foreground/80 leading-relaxed drop-shadow-sm">
                  Access deeper states of consciousness through ancient meditation techniques. Cultivate inner peace, mental clarity, and spiritual awakening in your daily practice.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">The Power of Meditation</h2>
                  <div className="space-y-4 font-medium text-card-foreground/80 leading-relaxed">
                    <p>
                      Meditation is not just a practice — it is a journey into the depths of your being. Through consistent meditation, you develop the ability to observe your thoughts without attachment, access profound states of peace, and connect with your true nature.
                    </p>
                    <p>
                      Our meditation courses combine traditional techniques from various spiritual traditions with modern neuroscience insights. You will learn practices that have been refined over thousands of years, adapted for the challenges and opportunities of contemporary life.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                        <p className="text-2xl font-bold text-primary mb-2">Reduce Stress</p>
                        <p className="text-sm text-card-foreground">Lower cortisol levels and find calm</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                        <p className="text-2xl font-bold text-primary mb-2">Enhance Focus</p>
                        <p className="text-sm text-card-foreground">Improve concentration and clarity</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                        <p className="text-2xl font-bold text-primary mb-2">Spiritual Growth</p>
                        <p className="text-sm text-card-foreground">Deepen your connection to self</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-4 mb-16">
                {meditationCourses.map((course, index) => (
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

export default MeditationPage;
