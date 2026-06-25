
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(currentUser.id, formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Profile - Jyotish Gyan</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background/50">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border-border/40 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar placeholder section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                        {currentUser?.name?.charAt(0).toUpperCase() || <User />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground mb-2">Profile Picture</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => toast.info('Image upload coming soon.')}>
                          Change Picture
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          value={currentUser?.email || ''} 
                          disabled 
                          className="bg-muted text-muted-foreground cursor-not-allowed" 
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input 
                          id="phone" name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Short Bio (Optional)</Label>
                      <textarea 
                        id="bio" name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us a little about your spiritual journey..."
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <Button asChild variant="ghost">
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
