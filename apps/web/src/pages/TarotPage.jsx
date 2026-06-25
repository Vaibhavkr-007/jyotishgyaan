
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CourseCard from '@/components/CourseCard.jsx';
import { tarotCourses } from '@/data/coursesData';

const TarotPage = () => {
  return (
    <>
      <Helmet>
        <title>Tarot Reading Courses - Divya Khaneja</title>
        <meta name="description" content="Master the art of tarot reading. Learn card meanings, spreads, and intuitive techniques to guide yourself and others with clarity and wisdom." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1621787086207-638ea80a9017"
                alt="Sacred Indian spiritual art"
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
                  Tarot Reading Mastery
                </h1>
                <p className="text-lg font-medium text-foreground/80 leading-relaxed drop-shadow-sm">
                  Unlock the mysteries of the 78 cards and develop your intuitive abilities. Learn to deliver transformative readings that inspire clarity, healing, and personal growth.
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
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">The Art of Tarot</h2>
                  <div className="space-y-4 font-medium text-card-foreground/80 leading-relaxed">
                    <p>
                      Tarot is far more than fortune-telling — it is a profound tool for self-reflection, spiritual guidance, and accessing intuitive wisdom. Each card in the tarot deck carries layers of symbolic meaning that speak to universal human experiences.
                    </p>
                    <p>
                      Through our comprehensive tarot courses, you will learn to read the cards with confidence and depth. You will develop your intuition, understand archetypal symbolism, and master various spread techniques for different types of questions and situations.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-card-foreground">Major Arcana</h3>
                        <p className="text-sm">
                          The 22 cards of the Major Arcana represent life's significant spiritual lessons and archetypal energies. Learn to interpret these powerful cards and their journey from The Fool to The World.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-card-foreground">Minor Arcana</h3>
                        <p className="text-sm">
                          The 56 cards of the Minor Arcana reflect everyday experiences across four suits: Wands (passion), Cups (emotions), Swords (thoughts), and Pentacles (material world).
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 rounded-xl bg-card border border-border shadow-sm">
                      <h3 className="text-lg font-bold text-card-foreground mb-4">What You Will Master</h3>
                      <ul className="grid md:grid-cols-2 gap-3 text-sm text-card-foreground/90">
                        <li>• Card meanings and symbolism</li>
                        <li>• Intuitive reading techniques</li>
                        <li>• Various spread layouts</li>
                        <li>• Ethical reading practices</li>
                        <li>• Connecting with your deck</li>
                        <li>• Professional reading skills</li>
                      </ul>
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
                {tarotCourses.map((course, index) => (
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

export default TarotPage;
