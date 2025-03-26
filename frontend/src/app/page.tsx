/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from 'react';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaLightbulb, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiMongodb, 
  SiExpress, 
  SiNodedotjs, 
  SiJsonwebtokens,
  SiPrisma,
  SiOpenai
} from 'react-icons/si';

// Add this custom hook before your Home component
function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 20);
      setHidden(currentScroll > lastScroll && currentScroll > 80);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return { scrolled, hidden };
}

export default function Home() {
  const { scrolled, hidden } = useScrollPosition();

  // Add this function inside your component
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust this value based on your navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const teamMembers = [
    {
      name: "Praveen BV",
      dept: "B.E CSE (Cyber Security)",
      regNo: "212222100036",
      role: "Full Stack Developer",
      email: "bvpraveenvignesh2005@gmail.com",
      linkedin: "https://www.linkedin.com/in/praveen-bv-918830250/",
      github: "https://github.com/Praveen22042005"
    },
    {
      name: "Lokesh Rahul VV",
      dept: "B.E CSE (Cyber Security)",
      regNo: "212222100024",
      role: "Full Stack Developer",
      email: "lokeshrahulvl11@gmail.com",
      linkedin: "https://www.linkedin.com/in/lokesh-rahul-066ab7277/",
      github: "https://github.com/lokeshrahulv"
    },
    {
      name: "Vasanthamukilan M",
      dept: "B.TECH - AI and Data Science",
      regNo: "212222230167",
      role: "UI/UX Designer",
      email: "vasanthamukilan75@gmail.com",
      linkedin: "https://www.linkedin.com/in/vasanthamukilan-m-11644b279/",
      github: "https://github.com/Vasanthamukilan"
    },
    {
      name: "Raja R",
      dept: "B.E CSE (Cyber Security)",
      regNo: "212222100041",
      role: "Research & Development",
      email: "raja.rrasu@gmail.com",
      linkedin: "https://www.linkedin.com/in/raja-r-819299323/",
      github: "https://github.com/Raja8334"
    }
  ];

  const features = [
    {
      icon: <FaLightbulb />,
      title: "AI-Powered Matching",
      description: "Our platform uses advanced algorithms to match startups with potential investors based on industry, funding requirements, and growth potential."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Investment",
      description: "End-to-end encrypted communication and secure payment gateways ensure safe transactions between investors and entrepreneurs."
    },
    {
      icon: <FaChartLine />,
      title: "Growth Analytics",
      description: "Track startup performance, investment returns, and key metrics through comprehensive analytics dashboards."
    }
  ];

  const problemSolutions = [
    {
      number: "01",
      title: "Funding Access",
      description: "Breaking down barriers between entrepreneurs and investors through a streamlined, technology-driven platform."
    },
    {
      number: "02",
      title: "Investment Management",
      description: "Providing tools for investors to manage their portfolio and track startup performance in real-time."
    },
    {
      number: "03",
      title: "Growth Support",
      description: "Offering resources, mentorship connections, and analytics to help startups scale effectively."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed w-full transition-all duration-300 z-50
        ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}
        ${hidden ? '-translate-y-full' : 'translate-y-0'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="StartNet Logo" 
                width={32} 
                height={32}
                className={`w-8 h-8 transition-transform duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}
              />
              <span className={`text-2xl font-bold transition-all duration-300 
                ${scrolled ? 'text-foreground' : 'text-foreground'}
              `}>
                StartNet
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('about')} 
                className={`hidden md:block transition-colors duration-300
                  ${scrolled ? 'text-secondaryText hover:text-foreground' : 'text-foreground/90 hover:text-foreground'}
                `}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className={`hidden md:block transition-colors duration-300
                  ${scrolled ? 'text-secondaryText hover:text-foreground' : 'text-foreground/90 hover:text-foreground'}
                `}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className={`hidden md:block transition-colors duration-300
                  ${scrolled ? 'text-secondaryText hover:text-foreground' : 'text-foreground/90 hover:text-foreground'}
                `}
              >
                Team
              </button>
              <div className={`h-6 w-px hidden md:block transition-colors duration-300
                ${scrolled ? 'bg-gray-200' : 'bg-gray-300'}
              `}></div>
              <Link 
                href="/auth/signin" 
                className={`px-4 py-2 transition-colors duration-300
                  ${scrolled ? 'text-secondaryText hover:text-foreground' : 'text-foreground/90 hover:text-foreground'}
                `}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className={`px-5 py-2 rounded-full bg-foreground text-white 
                  transition-all duration-300 transform
                  ${scrolled ? 'shadow-md hover:shadow-lg' : 'shadow-lg hover:shadow-xl'}
                  hover:bg-opacity-90 hover:scale-105
                `}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Grid Background & Animations */}
      <main className="relative pt-32 pb-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Grid Background Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.png')] bg-repeat opacity-20 animate-fadeIn"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-6 animate-slideInLeft transition-all duration-1000">
              <h1 className="text-5xl text-foreground sm:text-6xl font-bold mb-6 leading-tight transition-opacity duration-1000">
                Transforming Startup Investments <br />
                with AI
              </h1>
              <p className="text-lg sm:text-xl text-secondaryText max-w-2xl mb-12 leading-relaxed transition-opacity duration-1000">
                We harness the power of AI to connect visionary entrepreneurs with forward-thinking investors, paving the way for a revolution in startup growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="group px-8 py-4 rounded-full bg-foreground text-white hover:bg-opacity-90 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:translate-y-[-2px] duration-200">
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link href="#about" className="px-8 py-4 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-white transition-all text-lg font-semibold">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-[360px] w-[700px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl border border-gray-100 group">  
              {/* Grid Background with Fade */}
  <div 
    className="absolute inset-0 bg-[url('/grid.png')] bg-repeat opacity-20 mix-blend-soft-light"
    style={{
      maskImage: 'linear-gradient(to bottom, black, transparent)',
      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
    }}
  />
  
  {/* Glow Effects */}
  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/10 rounded-full blur-3xl"></div>
  <div className="absolute -top-20 -left-20 w-60 h-60 bg-foreground/5 rounded-full blur-3xl"></div>
  
  {/* Dashboard Image */}
  <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
    <Image
      src="/dashboard.png"
      alt="StartNet Dashboard"
      width={1897}
      height={966}
      className="object-cover h-full w-full"
      priority
    />
  </div>
</div>
          </div>
        </div>
      </main>

      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-foreground/10 rounded-full text-foreground text-sm font-medium mb-4">
              Our Mission
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">The Problem We're Solving</h2>
            <p className="text-lg text-secondaryText">
              Through our experience, we've observed that traditional startup funding is complex so we're simplifying this process through our technology platform, making investment opportunities available to both entrepreneurs and investors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {problemSolutions.map((solution, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-bl-full"></div>
                <div className="w-16 h-16 bg-foreground/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors">
                  <span className="text-2xl font-bold text-foreground">{solution.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{solution.title}</h3>
                <p className="text-secondaryText leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      


      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-foreground/10 rounded-full text-foreground text-sm font-medium mb-4">
              Features
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">Platform Features</h2>
            <p className="text-lg text-secondaryText">
              We've developed a comprehensive suite of tools to help startups raise capital, manage investments, and track growth metrics in one unified platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] duration-300 border border-gray-100 relative">
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-secondaryText leading-relaxed">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link href="#" className="text-foreground font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-foreground to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-3xl mx-auto">
            Our solution addresses real-world challenges in startup funding and aims to contribute to building a trillion-dollar economy.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">Creating Entrepreneurs</h3>
              <p className="text-gray-300">We're breaking down barriers to help aspiring entrepreneurs turn their ideas into successful businesses.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">Enabling Growth</h3>
              <p className="text-gray-300">Our platform provides the tools and connections needed for sustainable business growth.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">Driving Innovation</h3>
              <p className="text-gray-300">We're fostering innovation across key sectors to support economic development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-foreground/10 rounded-full text-foreground text-sm font-medium mb-4">
              Our Team
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">The Minds Behind StartNet</h2>
            <p className="text-lg text-secondaryText">
              We're a team of passionate students from Saveetha Engineering College, working together to bridge the gap between entrepreneurs and investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:translate-y-[-5px] duration-300 border border-gray-100 group">
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <Image
                      src={`/team/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/default-profile.png`;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-foreground">{member.name}</h3>
                  <div className="w-12 h-1 bg-foreground/20 mx-auto my-3"></div>
                  <p className="text-secondaryText text-sm mb-1">{member.dept}</p>
                  <p className="text-secondaryText text-sm mb-2">{member.regNo}</p>
                  <p className="text-foreground text-sm font-semibold">{member.role}</p>
                </div>
                <div className="flex justify-center space-x-6">
                  <a 
                    href={`mailto:${member.email}`} 
                    title={member.email}
                    className="text-secondaryText hover:text-foreground transition-colors"
                  >
                    <FaEnvelope className="w-6 h-6" />
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-secondaryText hover:text-foreground transition-colors"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-secondaryText hover:text-foreground transition-colors"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Tech Stack Section */}
<section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 bg-foreground/10 rounded-full text-foreground text-sm font-medium mb-4">
              Our Technology Stack
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">Built with Modern Technologies</h2>
            <p className="text-lg text-secondaryText">
              We've carefully chosen our tech stack to ensure scalability, security, and exceptional performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frontend */}
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-foreground mb-6">Frontend Technologies</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <SiNextdotjs className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Next.js 14</p>
                    <p className="text-sm text-secondaryText">React Framework</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiTypescript className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">TypeScript</p>
                    <p className="text-sm text-secondaryText">Type Safety</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiTailwindcss className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Tailwind CSS</p>
                    <p className="text-sm text-secondaryText">Styling Framework</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-foreground mb-6">Backend Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <SiNodedotjs className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Node.js</p>
                    <p className="text-sm text-secondaryText">Runtime Environment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiExpress className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Express.js</p>
                    <p className="text-sm text-secondaryText">Backend Framework</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiMongodb className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">MongoDB</p>
                    <p className="text-sm text-secondaryText">Database</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI & Security */}
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-foreground mb-6">AI & Security</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <SiOpenai className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Azure OpenAI</p>
                    <p className="text-sm text-secondaryText">AI Integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiJsonwebtokens className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">JWT Authentication</p>
                    <p className="text-sm text-secondaryText">Security</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SiPrisma className="w-6 h-6 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Prisma</p>
                    <p className="text-sm text-secondaryText">ORM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Tools & Libraries */}
          <div className="mt-12 pt-12 border-t border-gray-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-8">Additional Tools & Libraries</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  React Hook Form
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  Zod Validation
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  Axios
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  React Query
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  Shadcn UI
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full text-secondaryText text-sm">
                  React Hot Toast
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="StartNet Logo" width={40} height={40} className="w-10 h-10" />
                <span className="text-2xl font-bold">StartNet</span>
              </div>
              <p className="text-gray-300 mb-6">
                Empowering entrepreneurs through innovative solutions and smart connections.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaEnvelope className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-gray-400">Email:</span>
                  <a href="mailto:bvpraveenvignesh2005@gmail.com" className="text-gray-300 hover:text-white transition-colors">bvpraveenvignesh2005@gmail.com</a>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gray-400">Phone:</span>
                  <a href="tel:+916379061046" className="text-gray-300 hover:text-white transition-colors">+91 6379061046</a>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-gray-300">Saveetha Engineering College, Chennai, Tamil Nadu</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center md:flex md:justify-between md:text-left">
            <p className="text-gray-400">© 2025 StartNet. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-400">2025 | Saveetha Engineering College</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}