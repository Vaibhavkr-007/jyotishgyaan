
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileBadge } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CertificateCard = ({ certificate, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full cursor-pointer"
      onClick={() => onClick(certificate)}
    >
      <Card className="h-full flex flex-col overflow-hidden group award-card-wrapper transition-all duration-500 hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden shrink-0 border-b border-border/40">
          <img
            src={certificate.imageUrl}
            alt={certificate.title}
            loading="lazy"
            className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
          
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="award-ribbon border-none font-semibold shadow-md">
              Credential
            </Badge>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center border border-[hsl(var(--award-gold)/0.3)] shadow-lg">
              <FileBadge className="w-5 h-5 text-[hsl(var(--award-gold))]" />
            </div>
            <div className="flex items-center text-sm font-medium text-[hsl(var(--award-gold))] bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-[hsl(var(--award-gold)/0.2)] shadow-sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {certificate.date}
            </div>
          </div>
        </div>
        
        <CardHeader className="pt-6 pb-2">
          <h3 className="text-xl md:text-2xl font-bold leading-tight text-foreground group-hover:text-[hsl(var(--award-gold))] transition-colors" style={{ textWrap: 'balance' }}>
            {certificate.title}
          </h3>
          <p className="text-sm font-medium text-primary mt-2 line-clamp-1">
            {certificate.organization}
          </p>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3">
            {certificate.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CertificateCard;
