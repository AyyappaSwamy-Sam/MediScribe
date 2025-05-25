import React from 'react';
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
    {
      title: "Appointment Booking",
      description: "Effortlessly schedule appointments with the right specialists."
    },
    {
      title: "Voice Recording",
      description: "Capture consultations with high-quality audio recording."
    },
    {
      title: "Transcription",
      description: "Convert spoken words into accurate written text."
    },
    {
      title: "Summarization",
      description: "Generate concise summaries of medical consultations."
    },
    {
      title: "Structured Output",
      description: "Organize medical information into standardized, easily accessible formats."
    }
  ];

  const industryNeeds = [
    "Efficient patient-doctor communication",
    "Accurate medical record keeping",
    "Time-saving documentation processes",
    "Enhanced accessibility to medical information",
    "Improved patient care through structured data"
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
      {/* Introduction */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">
          About MediScribe
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          MediScribe is revolutionizing healthcare by bridging the gap between patients and doctors. 
          Our innovative platform makes healthcare more accessible and efficient.
        </p>
      </section>

      {/* Mission */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Our Mission</h2>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">
              As a final year project from Amrita Vishwa Vidyapeetham's AIE A branch, we are committed to 
              creating a solution that addresses real-world challenges in the medical field.
            </p>
            <p className="text-gray-700">
              MediScribe streamlines the entire process from appointment booking to consultation 
              documentation, making healthcare more accessible and efficient.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:bg-gray-50 transition-colors duration-200">
              <CardContent className="p-4">
                <Badge className="mb-2" variant="secondary">{feature.title}</Badge>
                <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Industry Impact */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Industry Impact</h2>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <ul className="space-y-2">
              {industryNeeds.map((need, index) => (
                <li key={index} className="text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  {need}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Vision & Future */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Our Vision</h2>
        <Tabs defaultValue="vision" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="future">Future Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="vision">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700">
                  We envision a future where technology seamlessly integrates with healthcare, 
                  enhancing the quality of patient care and reducing the administrative burden on medical professionals.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="future">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700">
                  Our future plans include AI-driven diagnosis assistance, personalized treatment recommendations, 
                  and integration with wearable health devices.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-white hover:bg-gray-50 transition-colors duration-200">
              <CardContent className="p-4 text-center">
                <Avatar className="mx-auto mb-4 w-32 h-32">
                  <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;