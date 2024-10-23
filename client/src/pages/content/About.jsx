import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assets } from '../../assets/assets_frontend/assets';

const AboutPage = () => {
  const teamMembers = [
    { name: "Khambampati Subhash", role: "Team Member", avatar: assets.doctor1 },
    { name: "Indra Kiran B", role: "Team Member", avatar: assets.img2 },
    { name: "Ayyappa Swamy Thati", role: "Team Member", avatar: assets.img3 },
    { name: "Sai Sumitha K", role: "Team Member", avatar: assets.img4 },
    { name: "Dr Rahul Krishnan", role: "Mentor", avatar: assets.img5 }
  ];

  const features = [
    "Appointment Booking",
    "Voice Recording",
    "Transcription",
    "Summarization",
    "Structured Output"
  ];

  const industryNeeds = [
    "Efficient patient-doctor communication",
    "Accurate medical record keeping",
    "Time-saving documentation processes",
    "Enhanced accessibility to medical information",
    "Improved patient care through structured data",
    "Effortlessly schedule appointments with the right specialists.",
    "Capture consultations with high-quality audio recording.",
    "Convert spoken words into accurate written text.",
    "Generate concise summaries of medical consultations."
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-12 max-w-5xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Introduction Section */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h1 className="text-5xl font-bold text-center mb-8 text-blue-900">
          About MediScribe
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-2xl mx-auto">
          MediScribe is revolutionizing the healthcare industry by bridging the gap between patients and doctors. 
          From booking appointments to documenting consultations, our innovative platform makes healthcare more accessible and efficient.
        </p>
      </motion.section>

      {/* Mission Section */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Our Mission</h2>
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <CardContent className="p-6">
            <p className="text-lg text-gray-700 mb-4">
              As a final year project from Amrita Vishwa Vidyapeetham's AIE A branch, we are committed to 
              creating a solution that addresses real-world challenges in the medical field.
            </p>
            <p className="text-lg text-gray-700">
              MediScribe streamlines the entire process from appointment booking to consultation 
              documentation, making healthcare more accessible and efficient.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Features Section */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-4">
                  <Badge className="mb-2" variant="secondary">{feature}</Badge>
                  <p className="text-gray-700">{getFeatureDescription(feature)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Industry Impact Section with Seamless Infinite Scroll */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Industry Impact</h2>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg overflow-hidden">
          <CardContent className="p-6 relative">
            <motion.div
              className="flex space-x-10 whitespace-nowrap"
              animate={{ x: [0, -1000] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1500,
                ease: "linear",
              }}
              style={{ willChange: 'transform' }}
            >
              {[...industryNeeds, ...industryNeeds].map((need, index) => (
                <motion.div
                  key={index}
                  className="text-gray-700 text-lg"
                  style={{ paddingRight: '2rem' }}
                >
                  {need}
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Vision & Future Plans */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Our Vision</h2>
        <Tabs defaultValue="vision" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="future">Future Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="vision">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  We envision a future where technology seamlessly integrates with healthcare, 
                  enhancing the quality of patient care and reducing the administrative burden on medical professionals.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="future">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  Our future plans include AI-driven diagnosis assistance, personalized treatment recommendations, and integration with wearable health devices.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Team Section */}
      <motion.section className="mb-16" variants={itemVariants}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-4 text-center">
                  <Avatar className="mx-auto mb-2" style={{ width: '200px', height: '200px' }}>
                    <AvatarImage 
                      src={member.avatar} 
                      alt={member.name} 
                      style={{ width: '200px', height: '200px' }} 
                    />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

const getFeatureDescription = (feature) => {
  switch (feature) {
    case "Appointment Booking":
      return "Effortlessly schedule appointments with the right specialists.";
    case "Voice Recording":
      return "Capture consultations with high-quality audio recording.";
    case "Transcription":
      return "Convert spoken words into accurate written text.";
    case "Summarization":
      return "Generate concise summaries of medical consultations.";
    case "Structured Output":
      return "Organize medical information into standardized, easily accessible formats.";
    default:
      return "";
  }
};

export default AboutPage;
