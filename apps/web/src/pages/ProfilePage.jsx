
import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {

  ArrowLeft,

  Save,

  User,

  Loader2,

  Camera,

  Trash2,

  MapPin,

  Phone,

  Calendar,

  Clock,

  Briefcase,

  Heart,

  Globe

} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { API_URL } from "@/config/api";

const PB_URL =
  import.meta.env.VITE_POCKETBASE_URL ||
  "http://127.0.0.1:8090";

const ProfilePage = () => {

  const {

    currentUser,

    fetchProfile,

    updateProfile

  } = useAuth();

  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [profilePictureFile, setProfilePictureFile] =
    useState(null);

  const [profilePicturePreview, setProfilePicturePreview] =
    useState(null);

  const [formData, setFormData] =
    useState({

      name: "",

      phone: "",

      gender: "",

      maritalStatus: "",

      occupation: "",

      dateOfBirth: "",

      timeOfBirth: "",

      placeOfBirth: "",

      address: "",

      city: "",

      state: "",

      country: "",

      timezone: "",

      bio: ""

    });

  /*
  --------------------------------------------------------
  Profile Completion
  --------------------------------------------------------
  */

  const completionItems = [

    {
      label: "Profile Picture",
      complete:
        !!(
          profilePicturePreview ||
          currentUser?.profile_picture
        )
    },

    {
      label: "Full Name",
      complete: !!formData.name
    },

    {
      label: "Email",
      complete: !!currentUser?.email
    },

    {
      label: "Phone",
      complete: !!formData.phone
    },

    {
      label: "Gender",
      complete: !!formData.gender
    },

    {
      label: "Date of Birth",
      complete: !!formData.dateOfBirth
    },

    {
      label: "Time of Birth",
      complete: !!formData.timeOfBirth
    },

    {
      label: "Place of Birth",
      complete: !!formData.placeOfBirth
    },

    {
      label: "Country",
      complete: !!formData.country
    },

    {
      label: "State",
      complete: !!formData.state
    },

    {
      label: "City",
      complete: !!formData.city
    },

    {
      label: "Bio",
      complete: !!formData.bio
    }

  ];

  const completed =
    completionItems.filter(
      i => i.complete
    ).length;

  const completion =
    Math.round(
      completed /
      completionItems.length *
      100
    );

  /*
  --------------------------------------------------------
  Handlers
  --------------------------------------------------------
  */

  const handleChange = e => {

    setFormData(prev => ({

      ...prev,

      [e.target.name]:
        e.target.value

    }));

  };

  const handleProfilePictureChange = e => {

    const file =
      e.target.files[0];

    if (!file) return;

    setProfilePictureFile(file);

    setProfilePicturePreview(

      URL.createObjectURL(file)

    );

  };

  const removeProfilePicture = async () => {

    try {

      const token =
        localStorage.getItem(
          "customerToken"
        );

      const response =
        await fetch(

          `${API_URL}/profile/picture`,

          {

            method: "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

      const data =
        await response.json();

      if (!response.ok)
        throw new Error(
          data.message
        );

      setProfilePicturePreview(null);

      setProfilePictureFile(null);

      await fetchProfile();

      toast.success(
        "Profile picture removed."
      );

    }

    catch (err) {

      toast.error(err.message);

    }

  };

  const handleSubmit = async e => {

    e.preventDefault();

    setIsSubmitting(true);

    try {

      const fd =
        new FormData();

      Object.entries(formData)
        .forEach(([k, v]) => {

          fd.append(
            k,
            v ?? ""
          );

        });

      if (profilePictureFile) {

        fd.append(

          "profile_picture",

          profilePictureFile

        );

      }

      await updateProfile(fd);

      await fetchProfile();

      setProfilePictureFile(null);

      toast.success(

        "Profile updated."

      );

    }

    catch (err) {

      toast.error(

        err.message

      );

    }

    finally {

      setIsSubmitting(false);

    }

  };

  /*
  --------------------------------------------------------
  Load profile
  --------------------------------------------------------
  */

  useEffect(() => {

    fetchProfile();

  }, []);

  useEffect(() => {

    if (!currentUser) return;

    setFormData({

      name:
        currentUser.name || "",

      phone:
        currentUser.phone || "",

      gender:
        currentUser.gender || "",

      maritalStatus:
        currentUser.maritalStatus || "",

      occupation:
        currentUser.occupation || "",

      dateOfBirth:
        currentUser.dateOfBirth || "",

      timeOfBirth:
        currentUser.timeOfBirth || "",

      placeOfBirth:
        currentUser.placeOfBirth || "",

      address:
        currentUser.address || "",

      city:
        currentUser.city || "",

      state:
        currentUser.state || "",

      country:
        currentUser.country || "",

      timezone:
        currentUser.timezone || "",

      bio:
        currentUser.bio || ""

    });

  }, [currentUser]);




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
                  <CardTitle className="flex items-center gap-2">

                    <User className="w-5 h-5 text-primary" />

                    Personal Information

                  </CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar placeholder section */}
                    {/* =======================================================
    Profile Header
======================================================= */}

                    <div className="rounded-xl border bg-card p-8">

                      <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT */}

                        <div className="flex flex-col items-center">

                          <div
                            className="
                    relative
                    w-40
                    h-40
                    rounded-full
                    overflow-hidden
                    border-4
                    border-primary
                    shadow-lg
                "
                          >

                            <img
                              src={
                                profilePicturePreview ||

                                (
                                  currentUser?.profile_picture

                                    ?

                                    `${PB_URL}/api/files/users/${currentUser.id}/${currentUser.profile_picture}`

                                    :

                                    "/default-profile.png"
                                )
                              }
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                fileInputRef.current.click()
                              }
                              className="
                        absolute
                        bottom-2
                        right-2
                        rounded-full
                        p-2
                        bg-primary
                        text-white
                        shadow-xl
                    "
                            >
                              <Camera className="w-5 h-5" />
                            </button>

                          </div>

                          <input
                            hidden
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                          />

                          <div className="flex gap-2 mt-5">

                            <Button

                              type="button"

                              variant="outline"

                              onClick={() =>
                                fileInputRef.current.click()
                              }

                            >

                              Change

                            </Button>

                            <Button

                              type="button"

                              variant="destructive"

                              onClick={removeProfilePicture}

                            >

                              <Trash2 className="w-4 h-4 mr-2" />

                              Remove

                            </Button>

                          </div>

                          <p className="text-xs text-muted-foreground mt-4 text-center">

                            JPG, PNG

                            <br />

                            Maximum 5 MB

                          </p>

                        </div>

                        {/* RIGHT */}

                        <div className="flex-1">

                          <h2 className="text-3xl font-bold">

                            {formData.name || "Your Name"}

                          </h2>

                          <p className="text-muted-foreground mt-1">

                            {currentUser?.email}

                          </p>

                          <div className="grid md:grid-cols-2 gap-3 mt-8">

                            <div className="flex items-center gap-2 text-sm">

                              <Phone className="w-4 h-4" />

                              {formData.phone || "Phone not added"}

                            </div>

                            <div className="flex items-center gap-2 text-sm">

                              <Briefcase className="w-4 h-4" />

                              {formData.occupation || "Occupation"}

                            </div>

                            <div className="flex items-center gap-2 text-sm">

                              <Heart className="w-4 h-4" />

                              {formData.maritalStatus || "Marital Status"}

                            </div>

                            <div className="flex items-center gap-2 text-sm">

                              <Globe className="w-4 h-4" />

                              {formData.country || "Country"}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* =======================================================
    Profile Completion
======================================================= */}

                    <Card>

                      <CardHeader>

                        <CardTitle>

                          Profile Completion

                        </CardTitle>

                        <CardDescription>

                          Complete your profile for better astrology recommendations.

                        </CardDescription>

                      </CardHeader>

                      <CardContent>

                        <div className="flex justify-between mb-2">

                          <span>

                            {completion}% Complete

                          </span>

                          <span>

                            {completed} / {completionItems.length}

                          </span>

                        </div>

                        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">

                          <motion.div

                            initial={{
                              width: 0
                            }}

                            animate={{
                              width: `${completion}%`
                            }}

                            transition={{
                              duration: 0.7
                            }}

                            className="
                    h-full
                    bg-primary
                "

                          />

                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mt-6">

                          {

                            completionItems.map(item => (

                              <div

                                key={item.label}

                                className="flex items-center gap-3"

                              >

                                <div

                                  className={

                                    item.complete

                                      ?

                                      "text-green-600"

                                      :

                                      "text-red-500"

                                  }

                                >

                                  {

                                    item.complete

                                      ?

                                      "✓"

                                      :

                                      "✗"

                                  }

                                </div>

                                <span>

                                  {item.label}

                                </span>

                              </div>

                            ))

                          }

                        </div>

                      </CardContent>

                    </Card>

                    {/* ==========================================================
                        PERSONAL INFORMATION
                    ========================================================== */}

                    <Card>

                      <CardHeader>

                        <CardTitle>

                          Personal Information

                        </CardTitle>

                        <CardDescription>

                          Your basic personal details.

                        </CardDescription>

                      </CardHeader>

                      <CardContent>

                        <div className="grid md:grid-cols-2 gap-6">

                          <div>

                            <Label>

                              Full Name

                            </Label>

                            <Input

                              name="name"

                              value={formData.name}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              Email

                            </Label>

                            <Input

                              disabled

                              value={currentUser?.email || ""}

                            />

                          </div>

                          <div>

                            <Label>

                              Phone

                            </Label>

                            <Input

                              name="phone"

                              value={formData.phone}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              Occupation

                            </Label>

                            <Input

                              name="occupation"

                              value={formData.occupation}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              Gender

                            </Label>

                            <select

                              name="gender"

                              value={formData.gender}

                              onChange={handleChange}

                              className="w-full rounded-md border p-2"

                            >

                              <option value="">Select</option>

                              <option>Male</option>

                              <option>Female</option>

                              <option>Other</option>

                              <option>Prefer not to say</option>

                            </select>

                          </div>

                          <div>

                            <Label>

                              Marital Status

                            </Label>

                            <select

                              name="maritalStatus"

                              value={formData.maritalStatus}

                              onChange={handleChange}

                              className="w-full rounded-md border p-2"

                            >

                              <option value="">Select</option>

                              <option>Single</option>

                              <option>Married</option>

                              <option>Divorced</option>

                              <option>Widowed</option>

                            </select>

                          </div>

                        </div>

                      </CardContent>

                    </Card>


                    {/* ==========================================================
                        BIRTH INFORMATION
                    ========================================================== */}

                    <Card>

                      <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                          <Calendar className="w-5 h-5 text-primary" />

                          Birth Information

                        </CardTitle>

                        <CardDescription>

                          Used for astrology calculations.

                        </CardDescription>

                      </CardHeader>

                      <CardContent>

                        <div className="grid md:grid-cols-2 gap-6">

                          <div>

                            <Label>

                              Date of Birth

                            </Label>

                            <Input

                              type="date"

                              name="dateOfBirth"

                              value={formData.dateOfBirth}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              Time of Birth

                            </Label>

                            <Input

                              type="time"

                              name="timeOfBirth"

                              value={formData.timeOfBirth}

                              onChange={handleChange}

                            />

                          </div>

                          <div className="md:col-span-2">

                            <Label>

                              Place of Birth

                            </Label>

                            <Input

                              name="placeOfBirth"

                              placeholder="Delhi, India"

                              value={formData.placeOfBirth}

                              onChange={handleChange}

                            />

                          </div>

                        </div>

                      </CardContent>

                    </Card>


                    {/* ==========================================================
                        ADDRESS INFORMATION
                    ========================================================== */}

                    <Card>

                      <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                          <MapPin className="w-5 h-5 text-primary" />

                          Address Information

                        </CardTitle>

                        <CardDescription>

                          Current residence.

                        </CardDescription>

                      </CardHeader>

                      <CardContent>

                        <div className="grid md:grid-cols-2 gap-6">

                          <div>

                            <Label>

                              Country

                            </Label>

                            <Input

                              name="country"

                              value={formData.country}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              State

                            </Label>

                            <Input

                              name="state"

                              value={formData.state}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              City

                            </Label>

                            <Input

                              name="city"

                              value={formData.city}

                              onChange={handleChange}

                            />

                          </div>

                          <div>

                            <Label>

                              Timezone

                            </Label>

                            <Input

                              name="timezone"

                              value={formData.timezone}

                              onChange={handleChange}

                            />

                          </div>

                          <div className="md:col-span-2">

                            <Label>

                              Current Address

                            </Label>

                            <textarea

                              name="address"

                              value={formData.address}

                              onChange={handleChange}

                              className="
                                            w-full
                                            rounded-md
                                            border
                                            p-3
                                            min-h-[90px]
                                        "

                            />

                          </div>

                        </div>

                      </CardContent>

                    </Card>


                    {/* ==========================================================
                        ABOUT YOU
                    ========================================================== */}

                    <Card>

                      <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                          <Briefcase className="w-5 h-5 text-primary" />

                          About You

                        </CardTitle>

                        <CardDescription>

                          Tell visitors a little about yourself.

                        </CardDescription>

                      </CardHeader>

                      <CardContent>

                        <textarea

                          name="bio"

                          value={formData.bio}

                          onChange={handleChange}

                          placeholder="Write something about yourself..."

                          className="
                                    w-full
                                    rounded-md
                                    border
                                    p-4
                                    min-h-[150px]
                                "

                        />

                      </CardContent>

                    </Card>

                    {/* ==========================================================
                        ACTION BAR
                    ========================================================== */}

                    <div
                      className="
                            sticky
                            bottom-0
                            bg-background/95
                            backdrop-blur
                            border-t
                            py-6
                            mt-10
                        "
                    >

                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <div>

                          <p className="font-semibold">

                            Keep your profile updated

                          </p>

                          <p className="text-sm text-muted-foreground">

                            A complete profile helps provide more accurate astrology insights and improves your consultation experience.

                          </p>

                        </div>

                        <div className="flex gap-3">

                          <Button
                            asChild
                            variant="outline"
                          >

                            <Link to="/dashboard">

                              Cancel

                            </Link>

                          </Button>

                          <Button

                            type="submit"

                            disabled={isSubmitting}

                            className="
                                        min-w-[170px]
                                        bg-primary
                                        hover:bg-primary/90
                                    "

                          >

                            {

                              isSubmitting

                                ?

                                <>

                                  <Loader2
                                    className="
                                                    mr-2
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                "
                                  />

                                  Saving...

                                </>

                                :

                                <>

                                  <Save
                                    className="
                                                    mr-2
                                                    h-4
                                                    w-4
                                                "
                                  />

                                  Save Changes

                                </>

                            }

                          </Button>

                        </div>

                      </div>

                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main >
      </div >
    </>
  );
};

export default ProfilePage;
