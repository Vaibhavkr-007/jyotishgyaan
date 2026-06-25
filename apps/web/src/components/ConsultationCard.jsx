
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Sparkles, Star, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal.jsx';
import ProtectedActionButton from './ProtectedActionButton.jsx';

const iconMap = {
  Sparkles: Sparkles,
  Star: Star,
  Zap: Zap,
  Heart: Heart
};

const ConsultationCard = ({ service, index = 0 }) => {
  const IconComponent = iconMap[service.icon] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group consultation-card-wrapper border-border/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-card">
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
          />
          <div className="absolute inset-0 vedic-card-overlay pointer-events-none"></div>
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-md border-primary/20 shadow-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
              {service.duration}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-sm">
              <IconComponent className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
        
        <CardHeader className="pt-5 pb-3">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl lg:text-2xl leading-tight text-foreground" style={{ textWrap: 'balance' }}>
                {service.name}
              </CardTitle>
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              {service.price}
            </span>
          </div>
          <CardDescription className="text-sm lg:text-base leading-relaxed text-muted-foreground line-clamp-3">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-3 mt-2">
            <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">What's Included</p>
            <ul className="space-y-2.5">
              {service.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto pt-6 border-t border-border/30">
          <BookingModal
            prefilledService={service.name}
            prefilledDuration={parseInt(service.duration)}
            prefilledPrice={service.price.replace(/[^0-9]/g, '')}
            trigger={
              <ProtectedActionButton className="w-full group/btn" size="lg">
                <span>Book Consultation</span>
                <Sparkles className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </ProtectedActionButton>
            }
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConsultationCard;
