import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sparkles, Star, BookOpen, Heart, ArrowRight, Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CourseCard from '@/components/CourseCard.jsx';
import TestimonialCard from '@/components/TestimonialCard.jsx';
import ConsultationCard from '@/components/ConsultationCard.jsx';
import AwardCard from '@/components/AwardCard.jsx';
import BookingModal from '@/components/BookingModal.jsx';
import ProtectedActionButton from '@/components/ProtectedActionButton.jsx';
import { allCourses } from '@/data/coursesData';
import { testimonials } from '@/data/testimonialsData';
import { consultationServices } from '@/data/consultationsData';
import { awardsData } from '@/data/awardsData';

const HomePage = () => {
  const navigate = useNavigate();
  const featuredCourses = allCourses.slice(0, 6);
  const featuredAwards = awardsData.slice(0, 3);

  const credentials = [
    "Expert in Vedic Astrology",
    "Tarot Reading",
    "Reiki Healing",
    "Kundli Analysis"
  ];

  return (
    <>
      <Helmet>
        <title>Divya Khaneja - Astrology, Meditation, Reiki & Tarot Education</title>
        <meta name="description" content="Transform your life through ancient wisdom. Learn astrology, meditation, reiki healing, and tarot reading with expert guidance from Divya Khaneja." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section with Professional Photo */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-32 bg-tangerine-fallback">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1619879310659-01e83a8e9d6b"
                alt="Sacred geometry mandala background"
                className="w-full h-full object-cover homepage-img-blur opacity-50"
              />
              <div className="absolute inset-0 homepage-bg-blur bg-orange-300/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start max-w-6xl mx-auto pt-4 lg:pt-8">
                {/* Left Side: Hero Text */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-center lg:text-left pt-2 lg:pt-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm shadow-sm border border-border mb-6">
                    <Sparkles className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">Ancient Wisdom for Modern Souls</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground drop-shadow-sm" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                    Discover Your Path Through Spiritual Wisdom
                  </h1>
                  
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-medium drop-shadow-sm">
                    Join thousands of students who have transformed their lives through astrology, meditation, reiki healing, and tarot reading with expert guidance.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow bg-foreground text-background hover:bg-foreground/90">
                      <Link to="/astrology">Explore Courses</Link>
                    </Button>
                    <BookingModal
                      trigger={
                        <ProtectedActionButton variant="outline" size="lg" className="text-base bg-card/90 backdrop-blur-md border-border text-card-foreground hover:bg-card">
                          Book Consultation
                        </ProtectedActionButton>
                      }
                    />
                  </div>
                </motion.div>

                {/* Right Side: Professional Photo & Credentials */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  className="flex flex-col items-center lg:items-start w-full max-w-md mx-auto lg:mx-0"
                >
                  <div className="w-full">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-6">
                      <div className="photo-frame-inner aspect-[3/4] relative">
                        <img
                          src="https://horizons-cdn.hostinger.com/b4cdca70-749b-45ab-a0be-e91857daa2b0/04bbba2816e022a684497655b895d78e.jpg"
                          alt="Divya Khaneja - Professional Spiritual Guide"
                          className="w-full h-full object-cover object-top transition-all duration-700 group:hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border shadow-lg w-full">
                      <h3 className="text-2xl font-bold mb-2 text-card-foreground">Divya Khaneja</h3>
                      <p className="text-primary font-bold mb-4">World Renowned Astrologer & Spiritual Guide</p>
                      
                      <p className="text-card-foreground/80 text-sm mb-5 leading-relaxed">
                        Empowering individuals globally by blending ancient Vedic traditions with practical modern insight.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {credentials.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-card-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                  A Legacy of Guidance
                </h2>
                <p className="text-lg text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed">
                  With over 15 years of experience in spiritual education, Divya has guided thousands of students on their journey to self-discovery and healing. Her teachings blend ancient Vedic wisdom with practical modern applications.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { icon: Star, label: 'Certified Astrologer', value: '15+ Years' },
                  { icon: Heart, label: 'Reiki Master', value: 'Level 3' },
                  { icon: BookOpen, label: 'Students Taught', value: '3,200+' },
                  { icon: Sparkles, label: 'Course Completion', value: '94.7%' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center bg-card rounded-2xl p-6 shadow-sm border border-border"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold mb-1 text-card-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-card-foreground/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Awards & Recognition Section */}
          <section className="py-24 relative overflow-hidden bg-card/60">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-soft-light"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm mb-4">
                    <Trophy className="w-4 h-4 text-foreground" />
                    <span className="text-xs font-bold text-foreground tracking-wider uppercase">Global Excellence</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                    Awards & Recognition
                  </h2>
                  <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                    Honored globally for preserving ancient traditions while innovating modern spiritual education and counseling.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="shrink-0"
                >
                  <Button asChild variant="outline" className="group bg-card text-card-foreground hover:bg-card/80 border-border">
                    <Link to="/awards">
                      View All Awards
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {featuredAwards.map((award, index) => (
                  <AwardCard key={award.id} award={award} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Consultations Section */}
          <section className="pt-24 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-background pointer-events-none"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                    Holistic Healing Sessions
                  </h2>
                  <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                    Dive deep into specific modalities. Whether you need clarity through Tarot, energy cleansing with Reiki, or a deep dive into your Vedic birth chart.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="shrink-0"
                >
                  <Button asChild variant="outline" className="group bg-card text-card-foreground border-border hover:bg-card/80">
                    <Link to="/consultations">
                      View All Modalities
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {consultationServices.map((service, index) => (
                  <ConsultationCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                  Featured Courses
                </h2>
                <p className="text-lg text-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
                  Begin your spiritual journey with our most popular courses
                </p>
              </motion.div>

              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent className="-ml-4 py-4">
                  {featuredCourses.map((course, index) => (
                    <CarouselItem key={course.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <CourseCard course={course} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex bg-card text-card-foreground border-border" />
                <CarouselNext className="hidden md:flex bg-card text-card-foreground border-border" />
              </Carousel>

              <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline" className="bg-card text-card-foreground border-border hover:bg-card/80">
                  <Link to="/astrology">View All Courses</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
                  Student Testimonials
                </h2>
                <p className="text-lg text-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
                  Hear from students who have transformed their lives through our courses
                </p>
              </motion.div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-12 border border-border shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619879310659-01e83a8e9d6b')] opacity-5 object-cover mix-blend-luminosity"></div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground" style={{ textWrap: 'balance' }}>
                    Ready to Begin Your Journey?
                  </h2>
                  <p className="text-lg text-card-foreground/80 font-medium mb-8 leading-relaxed">
                    Book a personalized consultation to discover which path is right for you
                  </p>
                  <BookingModal
                    trigger={
                      <ProtectedActionButton size="lg" className="text-base bg-primary text-primary-foreground hover:bg-primary/90">
                        Schedule Your Consultation
                      </ProtectedActionButton>
                    }
                  />
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;