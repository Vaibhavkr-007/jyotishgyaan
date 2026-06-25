import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="break-inside-avoid mb-6"
    >
      <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          
          <p className="text-sm leading-relaxed mb-6 text-foreground/90">
            "{testimonial.text}"
          </p>
          
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 rounded-xl">
              <AvatarImage src={testimonial.image} alt={testimonial.name} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                {getInitials(testimonial.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Completed: <span className="text-foreground font-medium">{testimonial.course}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;