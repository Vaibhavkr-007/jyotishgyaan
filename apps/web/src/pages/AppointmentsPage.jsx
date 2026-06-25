
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AppointmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Appointment History - Jyotish Gyan</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background/50">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Appointment History</h1>
              <p className="text-muted-foreground">Review your past sessions, notes, and guidance received.</p>
            </motion.div>

            <Card className="bg-card border-border/40 shadow-sm border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">No history available</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Your completed appointment records will appear here.</p>
                <Button asChild variant="outline">
                  <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AppointmentsPage;
