
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CourseCard from '@/components/CourseCard.jsx';
import { reikiCourses } from '@/data/coursesData';

const ReikiPage = () => {
  return (
    <>
      <Helmet>
        <title>Reiki Healing Training - Divya Khaneja</title>
        <meta name="description" content="Become a certified Reiki practitioner. Learn to channel universal life force energy for healing, balance, and transformation." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1621788894112-ddb767d097e1"
                alt="Chakra and spiritual healing imagery"
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
                  Reiki Healing Training
                </h1>
                <p className="text-lg font-medium text-foreground/80 leading-relaxed drop-shadow-sm">
                  Learn to channel universal life force energy for profound healing and transformation. Our Reiki courses guide you from self-healing practices to professional practitioner certification.
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
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">Understanding Reiki Energy</h2>
                  <div className="space-y-4 font-medium text-card-foreground/80 leading-relaxed">
                    <p>
                      Reiki is a Japanese healing technique that channels universal life force energy through the practitioner's hands. This gentle yet powerful practice promotes physical healing, emotional balance, mental clarity, and spiritual growth.
                    </p>
                    <p>
                      During your Reiki training, you will receive attunements that open and align your energy channels, allowing you to become a clear conduit for healing energy. These sacred initiations are passed down through an unbroken lineage of Reiki masters.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-3 p-6 rounded-xl border border-border bg-card shadow-sm">
                        <h3 className="text-lg font-bold text-card-foreground">Reiki Level 1</h3>
                        <ul className="space-y-2 text-sm text-card-foreground/90">
                          <li>• Self-healing techniques</li>
                          <li>• Hand positions and energy flow</li>
                          <li>• First degree attunement</li>
                          <li>• Daily practice protocols</li>
                        </ul>
                      </div>
                      <div className="space-y-3 p-6 rounded-xl border border-border bg-card shadow-sm">
                        <h3 className="text-lg font-bold text-card-foreground">Reiki Level 2</h3>
                        <ul className="space-y-2 text-sm text-card-foreground/90">
                          <li>• Sacred Reiki symbols</li>
                          <li>• Distance healing techniques</li>
                          <li>• Second degree attunement</li>
                          <li>• Professional practice setup</li>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-4 mb-16">
                {reikiCourses.map((course, index) => (
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

export default ReikiPage;
