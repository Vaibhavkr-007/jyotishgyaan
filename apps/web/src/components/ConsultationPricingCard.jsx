
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone, Video, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal.jsx';
import ProtectedActionButton from './ProtectedActionButton.jsx';

const iconMap = {
  MessageCircle: MessageCircle,
  Phone: Phone,
  Video: Video
};

const ConsultationPricingCard = ({ option, index = 0 }) => {
  const IconComponent = iconMap[option.icon] || MessageCircle;
  const isRecommended = option.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`h-full flex ${isRecommended ? 'lg:-translate-y-4' : ''}`}
    >
      <Card className={`pricing-card flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isRecommended 
          ? 'border-2 border-primary shadow-lg ring-1 ring-primary/20 scale-105' 
          : 'border border-border/50 hover:-translate-y-1'
      }`}>
        {isRecommended && (
          <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1.5 text-center">
            Recommended
          </div>
        )}
        
        <CardHeader className="pt-8 pb-4 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner ${
            isRecommended ? 'bg-primary text-primary-foreground' : 'bg-secondary/20 text-primary'
          }`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
            {option.type}
          </CardTitle>
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-medium bg-muted/50 w-max mx-auto px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>{option.duration} minutes</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow text-center px-6">
          <div className="my-6">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              ₹{option.price}
            </span>
          </div>
          <p className="text-card-foreground/70 text-sm leading-relaxed max-w-[250px] mx-auto">
            {option.description}
          </p>
        </CardContent>
        
        <CardFooter className="mt-auto pt-6 pb-8 px-6">
          <BookingModal
            prefilledService={option.type}
            prefilledDuration={option.duration}
            prefilledPrice={option.price}
            trigger={
              <ProtectedActionButton 
                className="w-full" 
                size="lg"
                variant={isRecommended ? 'default' : 'outline'}
              >
                Book Now
              </ProtectedActionButton>
            }
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConsultationPricingCard;
