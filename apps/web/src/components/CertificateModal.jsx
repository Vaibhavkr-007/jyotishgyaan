
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Building2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificateModal = ({ isOpen, onClose, certificate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-card text-card-foreground border-border/40 shadow-2xl rounded-2xl">
        <AnimatePresence>
          {certificate && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col lg:flex-row h-full max-h-[85vh]"
            >
              {/* Image Section */}
              <div className="w-full lg:w-3/5 bg-black/10 dark:bg-black/40 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619879310659-01e83a8e9d6b')] opacity-5 object-cover mix-blend-luminosity"></div>
                <img 
                  src={certificate.imageUrl} 
                  alt={certificate.title} 
                  className="max-w-full max-h-[40vh] lg:max-h-full object-contain drop-shadow-xl relative z-10" 
                />
              </div>
              
              {/* Details Section */}
              <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col justify-center bg-card overflow-y-auto">
                <DialogHeader className="text-left space-y-3 mb-6">
                  <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight" style={{ textWrap: 'balance' }}>
                    {certificate.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">Issuing Organization</p>
                      <p className="text-sm text-foreground/80 font-medium">{certificate.organization}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">Date of Issue</p>
                      <p className="text-sm text-foreground/80 font-medium">{certificate.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                        {certificate.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <DialogDescription className="sr-only">
          Preview of {certificate?.title} from {certificate?.organization}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
