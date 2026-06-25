
import React from 'react';
import { motion } from 'framer-motion';
import { consultationPricingOptions } from '@/data/consultationsData.js';
import ConsultationPricingCard from './ConsultationPricingCard.jsx';

const ConsultationPricingSection = ({ className = '', title = 'Choose Your Consultation Type', description = 'Select the consultation format that best suits your needs and schedule.' }) => {
  return (
    <section className={`py-20 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ textWrap: 'balance' }}>
            {title}
          </h2>
          <p className="text-lg text-foreground/80 font-medium leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {consultationPricingOptions.map((option, index) => (
            <ConsultationPricingCard key={option.id} option={option} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultationPricingSection;
