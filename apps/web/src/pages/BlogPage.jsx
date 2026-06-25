
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BlogCard from '@/components/BlogCard.jsx';
import { articles } from '@/data/articlesData';

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Spiritual Insights & Articles - Divya Khaneja Blog</title>
        <meta name="description" content="Explore articles and insights on astrology, meditation, reiki healing, and tarot reading. Deepen your spiritual knowledge and practice." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1626784214767-1d290c470252"
                alt="Ancient Sanskrit manuscript"
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
                  Spiritual Insights & Wisdom
                </h1>
                <p className="text-lg text-foreground/80 font-medium leading-relaxed drop-shadow-sm">
                  Explore articles on astrology, meditation, reiki, and tarot. Deepen your understanding of ancient wisdom and modern spiritual practices.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto py-4">
                {articles.map((article, index) => (
                  <BlogCard key={article.id} article={article} index={index} />
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

export default BlogPage;
