
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContactPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Message sent successfully', {
        description: 'We will get back to you within 24 hours.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Divya Khaneja - Get in Touch</title>
        <meta name="description" content="Have questions about our courses or services? Contact Divya Khaneja for personalized guidance on your spiritual journey." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Get in Touch
                </h1>
                <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                  Have questions about our courses or need guidance on your spiritual journey? We are here to help.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="border-border/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-2xl text-card-foreground">Send a Message</CardTitle>
                        <CardDescription className="text-card-foreground/70">
                          Fill out the form below and we will respond within 24 hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Your full name"
                                className={errors.name ? 'border-destructive' : ''}
                              />
                              {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                className={errors.email ? 'border-destructive' : ''}
                              />
                              {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              value={formData.subject}
                              onChange={(e) => handleChange('subject', e.target.value)}
                              placeholder="What is this regarding?"
                              className={errors.subject ? 'border-destructive' : ''}
                            />
                            {errors.subject && (
                              <p className="text-sm text-destructive">{errors.subject}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleChange('message', e.target.value)}
                              placeholder="Tell us how we can help you..."
                              rows={6}
                              className={errors.message ? 'border-destructive' : ''}
                            />
                            {errors.message && (
                              <p className="text-sm text-destructive">{errors.message}</p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto text-primary-foreground bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              'Sending...'
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-border/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-card-foreground">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-1 text-card-foreground">Email</p>
                            <p className="text-sm text-card-foreground/70">divya@spiritualjourney.com</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-1 text-card-foreground">Phone</p>
                            <p className="text-sm text-card-foreground/70">+1 (555) 789-0123</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-1 text-card-foreground">Location</p>
                            <p className="text-sm text-card-foreground/70">Los Angeles, California</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="border-border/50 bg-card/60 shadow-md">
                      <CardContent className="pt-6">
                        <p className="text-sm font-medium leading-relaxed text-card-foreground">
                          For immediate assistance or to schedule a consultation, please use our booking system or call during business hours: Monday - Friday, 9:00 AM - 6:00 PM PST.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
