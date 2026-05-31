import React, { useState, useEffect } from "react";
import { Building2, Users, Target, Award, MapPin, Globe, Mail, Phone, Clock, Calendar, TrendingUp, Heart, Zap, Star, ChevronRight, ChevronLeft, Download, Share2, Facebook, Twitter, Linkedin, Youtube, Instagram, FileText, Shield, CheckCircle } from "lucide-react";

function About() {
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    years: 5,
    clients: 150,
    projects: 450,
    team: 25
  });

  const companyHistory = [
    { year: 2019, title: "Foundation", description: "Greggory Foundation Ltd was established with a vision to provide innovative digital solutions", achievements: ["Company registration", "First office opened", "Initial team of 3 members"], icon: Building2, color: "bg-blue-600" },
    { year: 2020, title: "Growth Phase", description: "Expanded services and team, completed first major enterprise project", achievements: ["10 major projects completed", "Team grew to 15 members", "Revenue doubled"], icon: TrendingUp, color: "bg-green-600" },
    { year: 2021, title: "Innovation Hub", description: "Launched R&D division, introduced AI-powered solutions", achievements: ["AI solutions launched", "ISO certification obtained", "International client base"], icon: Zap, color: "bg-purple-600" },
    { year: 2022, title: "Market Expansion", description: "Opened regional offices, expanded to 3 continents", achievements: ["Regional offices opened", "50+ enterprise clients", "Award-winning products"], icon: Globe, color: "bg-orange-600" },
    { year: 2023, title: "Leadership", description: "Became industry leader in digital transformation", achievements: ["Market leader position", "100+ projects delivered", "Strategic partnerships"], icon: Award, color: "bg-pink-600" },
    { year: 2024, title: "Future Forward", description: "Continuing innovation with sustainable technology solutions", achievements: ["Sustainability initiatives", "Next-gen solutions", "Global recognition"], icon: Star, color: "bg-indigo-600" }
  ];

  const teamMembers = [
    { id: 1, name: "Greggory Thompson", role: "Founder & CEO", bio: "Visionary leader with 20+ years experience in technology and business development", skills: ["Leadership", "Strategy", "Innovation"], image: "GT" },
    { id: 2, name: "Sarah Chen", role: "CTO", bio: "Technical expert with expertise in AI, cloud computing, and enterprise architecture", skills: ["Architecture", "AI/ML", "Cloud"], image: "SC" },
    { id: 3, name: "Marcus Johnson", role: "Head of Development", bio: "Full-stack specialist leading our development teams with focus on quality and efficiency", skills: ["Full Stack", "Management", "Quality"], image: "MJ" },
    { id: 4, name: "Emily Rodriguez", role: "Design Director", bio: "Creative director ensuring beautiful and functional user experiences across all products", skills: ["UX Design", "UI Design", "Branding"], image: "ER" },
    { id: 5, name: "David Kim", role: "Head of Operations", bio: "Operations expert ensuring smooth business processes and client satisfaction", skills: ["Operations", "Client Success", "Process"], image: "DK" },
    { id: 6, name: "Lisa Patel", role: "Marketing Director", bio: "Marketing strategist building our brand presence and driving growth", skills: ["Marketing", "Growth", "Branding"], image: "LP" }
  ];

  const values = [
    { icon: Heart, title: "Client-Centric", description: "We prioritize our clients' success and build long-term partnerships", color: "bg-red-500" },
    { icon: Shield, title: "Integrity", description: "We maintain the highest ethical standards in all our business dealings", color: "bg-blue-500" },
    { icon: Zap, title: "Innovation", description: "We continuously push boundaries with cutting-edge solutions", color: "bg-yellow-500" },
    { icon: Users, title: "Collaboration", description: "We believe in the power of teamwork and shared success", color: "bg-green-500" }
  ];

  const achievements = [
    { title: "ISO 9001:2015 Certified", description: "Quality management system certification", icon: CheckCircle, year: "2021" },
    { title: "Best Tech Startup 2023", description: "Awarded by Tech Innovation Awards", icon: Award, year: "2023" },
    { title: "500+ Projects Delivered", description: "Successful project completion milestone", icon: Target, year: "2024" },
    { title: "Client Satisfaction 98%", description: "Consistently high client ratings", icon: Star, year: "2024" }
  ];

  const nextTimeline = () => {
    setCurrentTimelineIndex((prev) => (prev + 1) % companyHistory.length);
  };

  const prevTimeline = () => {
    setCurrentTimelineIndex((prev) => (prev - 1 + companyHistory.length) % companyHistory.length);
  };

  const TimelineCard = ({ item, index, isActive }) => (
    <div className={`relative ${isActive ? 'scale-105' : 'scale-95'} transition-transform duration-300`}>
      <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${item.color} ${isActive ? 'ring-4 ring-opacity-30 ring-blue-400' : ''}`} />
      <div className={`ml-8 p-6 rounded-2xl shadow-lg border-2 ${isActive ? 'bg-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
        <div className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-3 ${item.color}`}>
          {item.year}
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-3 rounded-xl ${item.color}`}>
            <item.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="space-y-2">
          {item.achievements.map((achievement, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {achievement}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TeamCard = ({ member }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`h-32 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center`}>
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-purple-600 border-4 border-white">
          {member.image}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-purple-600 font-medium mb-3">{member.role}</p>
        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
        <div className="flex flex-wrap gap-2">
          {member.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <div className="text-4xl font-bold text-gray-900">{value}</div>
          <div className="text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-100">
      <div className="bg-white shadow-lg p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
              <p className="text-sm text-gray-600">Our story, team, and values</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
              <Download className="h-4 w-4" />
              Download
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'timeline', label: 'History', icon: Calendar },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'values', label: 'Values', icon: Heart }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === section.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Clock} value={`${stats.years}+`} label="Years Experience" color="bg-blue-600" />
              <StatCard icon={Users} value={stats.clients} label="Happy Clients" color="bg-green-600" />
              <StatCard icon={Target} value={stats.projects} label="Projects Completed" color="bg-purple-600" />
              <StatCard icon={Building2} value={stats.team} label="Team Members" color="bg-orange-600" />
            </div>

            {/* Company Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-4">
                  Greggory Foundation Ltd was founded in 2019 with a clear mission: to transform how businesses leverage technology for growth. What started as a small team of passionate technologists has grown into a global leader in digital solutions.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Today, we serve over 150 clients across 3 continents, delivering innovative solutions that drive real business results. Our commitment to excellence, innovation, and client success has made us a trusted partner for enterprises worldwide.
                </p>
                <p className="text-lg text-gray-700">
                  As we look to the future, we remain focused on pushing the boundaries of what's possible with technology, while staying true to our core values of integrity, collaboration, and client-centric innovation.
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-purple-100 rounded-xl">
                      <achievement.icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {achievement.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevTimeline}
                className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <div className="flex-1 px-4">
                <TimelineCard 
                  item={companyHistory[currentTimelineIndex]} 
                  index={currentTimelineIndex} 
                  isActive={true}
                />
              </div>

              <button
                onClick={nextTimeline}
                className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Timeline Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {companyHistory.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTimelineIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTimelineIndex ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Mini Timeline */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Journey</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-purple-200" />
                {companyHistory.map((item, index) => (
                  <div key={index} className="relative pl-12 pb-8 last:pb-0">
                    <div className={`absolute left-2 w-4 h-4 rounded-full ${item.color}`} />
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-2 ${item.color}`}>
                        {item.year}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 mb-8">The talented individuals behind our success</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(member => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'values' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-4 rounded-xl ${value.color}`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-sm text-gray-600">123 Tech Street, Innovation City</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-sm text-gray-600">info@greggoryfoundation.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-sky-500 rounded-lg text-white hover:bg-sky-600">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-blue-700 rounded-lg text-white hover:bg-blue-800">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-red-600 rounded-lg text-white hover:bg-red-700">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-white">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;