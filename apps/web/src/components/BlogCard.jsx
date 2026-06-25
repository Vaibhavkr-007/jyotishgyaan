import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogCard = ({ article, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const defaultHeaderImage = 'https://images.unsplash.com/photo-1610726103557-e71a0a110a77';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={defaultHeaderImage}
            alt="Traditional Indian spiritual imagery"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-overlay opacity-80"
          />
          <div className="absolute inset-0 vedic-card-overlay pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">
              {article.category}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <CardTitle className="text-xl leading-tight line-clamp-2 text-white drop-shadow-lg" style={{ textWrap: 'balance' }}>
              {article.title}
            </CardTitle>
          </div>
        </div>
        
        <CardHeader className="pt-4 pb-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <CardDescription className="text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </CardDescription>
        </CardContent>
        
        <CardContent className="mt-auto pt-4 border-t border-border/50">
          <Button variant="ghost" className="group/btn p-0 h-auto hover:bg-transparent">
            <span className="text-primary font-medium">Read article</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;