"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Loading from '@/components/Loading';
import Image from "next/image"

import {
  Send,
  Star,
  Menu,
  X,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  LanguagesIcon,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Link,
  Search,
} from "lucide-react"
import * as LucideIcons from "lucide-react";

const translations = {
  fr: {
    home: "Accueil",
    services: "Services",
    experience: "Parcours",
    skills: "Compétences",
    projects: "Projets",
    about: "À Propos",
    contact: "Contact",
    hireMe: "Me Contacter",
    viewJourney: "Voir Mon CV",
    servicesTitle: "Services",
    journeyTitle: "Parcours Professionnel & Éducatif",
    skillsTitle: "Mes Compétences",
    myProjects: "Mes Projets",
    aboutTitle: "À Propos de Moi",
    interests: "Centres d'Intérêt",
    rightsReserved: "Tous droits réservés",
  },
  en: {
    home: "Home",
    services: "Services",
    experience: "Journey",
    skills: "Skills",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    hireMe: "Hire Me",
    interests: "Interests",
    viewJourney: "View My CV",
    servicesTitle: "Services",
    journeyTitle: "Work Experience & Education Timeline",
    skillsTitle: "My Skills",
    myProjects: "My Projects",
    aboutTitle: "About Me",
    rightsReserved: "All rights reserved",
  },
  ar: {
    home: "الرئيسية",
    services: "الخدمات",
    experience: "المسيرة المهنية",
    skills: "المهارات",
    projects: "المشاريع",
    about: "عنّي",
    contact: "التواصل",
    hireMe: "وظفني",
    interests: "الاهتمامات",
    viewJourney: "عرض سيرتي الذاتية",
    servicesTitle: "الخدمات",
    journeyTitle: "المسيرة المهنية والتعليمية",
    skillsTitle: "مهاراتي",
    myProjects: "مشاريعي",
    aboutTitle: "نبذة عني",
    rightsReserved: "جميع الحقوق محفوظة",
  }
}

export default function Portfolio() {
  const [heroData, setHeroData] = useState<any>(null);
  const [educationData, setEducationData] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [aboutData, setAboutData] = useState<any>(null);
  const [photoLoading, setPhotoLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactData, setContactData] = useState<any>(null);
  const [projetsLoading, setProjetsLoading] = useState(true);
  const [projetsData, setProjetsData] = useState<any>(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [usernameData, setUsernameData] = useState<any>(null);
  const [educationLoading, setEducationLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('darkMode');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const [currentLang, setCurrentLang] = useState<"fr" | "en" | "ar">(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('language');
      return saved !== null ? saved as "fr" | "en" | "ar" : "fr";
    }
    return "fr";
  });

  const t = translations[currentLang]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }
  
  useEffect(() => {
    sessionStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    sessionStorage.setItem('language', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    sessionStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const changeLanguage = (lang: "fr" | "en" | "ar") => {
    setCurrentLang(lang);
    setIsLangMenuOpen(false);
    sessionStorage.setItem('language', lang);
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch('/api/photo');
        if (!res.ok) throw new Error('Failed to fetch photo');
        const data = await res.json();
        setPhotoUrl(data.url);
      } catch (err: any) {
        console.error('Error fetching photo:', err);
      } finally {
        setPhotoLoading(false);
      }
    };
    fetchPhoto();
  }, []);

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data);
        setHeroLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hero data:", err);
        setHeroLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/username")
      .then((res) => res.json())
      .then((data) => {
        setUsernameData(data || { fr: "", en: "", ar: "" });
        setUsernameLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching username data:", err);
        setUsernameLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/about_me")
      .then((res) => res.json())
      .then((data) => {
        setAboutData(data);
        setAboutLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching about data:", err);
        setAboutLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setContactData(data);
        setContactLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contact data:", err);
        setContactLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServicesData(data);
        setServicesLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services data:", err);
        setServicesLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        setEducationData(data);
        setEducationLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education data:", err);
        setEducationLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkillsData(data);
        setSkillsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education data:", err);
        setSkillsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/projets")
      .then((res) => res.json())
      .then((data) => {
        setProjetsData(data);
        setProjetsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Projets data:", err);
        setProjetsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "experience", "skills", "projects", "about", "contact"]
      const scrollPosition = window.scrollY + 110

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".language-menu")) {
        setIsLangMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const languageOptions = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ]

  const isProjectsEmpty = !projetsData || !projetsData.projects?.length;
  const isServicesEmpty = !servicesData || !servicesData.servicesList?.length;
  const isJourneyDataEmpty = !educationData || (!educationData.education?.length && !educationData.experience?.length);
  const isContactDataEmpty = !contactData || !((contactData.contactDescription?.[currentLang]?.trim() !== "") || (contactData.contactInfo && contactData.contactInfo.length > 0 && contactData.contactInfo.some(info => (info.label?.[currentLang]?.trim() !== "") || (info.value?.trim() !== ""))) || (contactData.contactButton?.startProject?.[currentLang]?.trim() !== ""));
  const isAboutDataEmpty = !aboutData || !((aboutData.aboutDescription?.[currentLang]?.trim() !== "") || (aboutData.personalInfo && aboutData.personalInfo.length > 0 && aboutData.personalInfo.some(info => (info.label?.[currentLang]?.trim() !== "") || (info.value?.[currentLang]?.trim() !== ""))) || (aboutData.languages?.list && aboutData.languages.list.length > 0 && aboutData.languages.list.some(language => (language.name?.[currentLang]?.trim() !== "") || (language.level?.trim() !== ""))) || (aboutData.interests && aboutData.interests.length > 0 && aboutData.interests.some(interest => (interest.name?.[currentLang]?.trim() !== ""))));
  const isSkillsDataEmpty = !skillsData || !((skillsData.skills && skillsData.skills.length > 0 && skillsData.skills.some(skill => (skill.title?.[currentLang]?.trim() !== "") || (skill.items && skill.items.length > 0 && skill.items.some(item => (item.name?.[currentLang]?.trim() !== "") || (item.examples && item.examples.some(ex => ex[currentLang]?.trim() !== "")))))));
  const isHeroDataEmpty = !heroData || !((heroData.specialist?.[currentLang] && heroData.specialist[currentLang].trim() !== "") || (heroData.heroTitle?.[currentLang] && heroData.heroTitle[currentLang].trim() !== "") || (heroData.heroDescription?.[currentLang] && heroData.heroDescription[currentLang].trim() !== "") || (heroData.heroButtons && heroData.heroButtons.length > 0));

  const navItems = [
    !isServicesEmpty && { id: "services", label: t.services },
    !isJourneyDataEmpty && { id: "experience", label: t.experience },
    !isSkillsDataEmpty && { id: "skills", label: t.skills },
    !isProjectsEmpty && { id: "projects", label: t.projects },
    !isAboutDataEmpty && { id: "about", label: t.about },
    !isContactDataEmpty && { id: "contact", label: t.contact },
  ].filter(Boolean);

  const getIcon = (iconName?: string) => {
    if (!iconName) return null; 
    const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    return LucideIcons[pascalCase] || null; 
  };

  if (heroLoading || servicesLoading || photoLoading || educationLoading || aboutLoading || contactLoading || projetsLoading || skillsLoading || usernameLoading) return <Loading/>;
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 
      'bg-gradient-to-br from-[#0b0c1d] to-[#1a103d] text-white' : 
      'bg-gradient-to-br from-[#ffd6e7] to-[#ffc2d6] text-gray-800'}`}>
      
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${isDarkMode ? 
        'bg-[#0b0c1d]/90 backdrop-blur-sm' : 
        'bg-[#ffd6e7]/90 backdrop-blur-sm'} shadow-md`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`font-bold text-xl ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] bg-clip-text text-transparent' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] bg-clip-text text-transparent'}`}>
                <span>{usernameData?.[currentLang]}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center custom-nav-spacing">
              <nav className="flex space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`font-medium transition-all duration-300 hover:scale-105 ${activeSection === item.id ? 
                      (isDarkMode ? 'text-[#ff9acb]' : 'text-[#ff6b9c]') : 
                      'text-inherit'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative language-menu">
                <Button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`rounded-full ${isDarkMode ? 
                    'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                    'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>

                {isLangMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 
                    'bg-[#1a103d] border border-[#2a205d]' : 
                    'bg-white border border-[#ffe4ec]'} py-1 z-50`}>
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                        className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 
                          'hover:bg-[#2a205d] text-white' : 
                          'hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-colors duration-200`}
                      >
                        <span className="mr-2">{option.flag}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 
                  'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                  'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <Button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`rounded-full ${isDarkMode ? 
                  'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                  'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </Button>

              <Button
                onClick={() => scrollToSection("contact")}
                className={`rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                  'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-[#ff9acb]/30' : 
                  'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] text-white hover:shadow-lg hover:shadow-[#ff6b9c]/30'}`}
              >
                {t.hireMe}
              </Button>
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <Button
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 
                  'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                  'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <div className="relative language-menu">
                <Button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`rounded-full ${isDarkMode ? 
                    'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                    'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>

                {isLangMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 
                    'bg-[#1a103d] border border-[#2a205d]' : 
                    'bg-white border border-[#ffe4ec]'} py-1 z-50`}>
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                        className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 
                          'hover:bg-[#2a205d] text-white' : 
                          'hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-colors duration-200`}
                      >
                        <span className="mr-2">{option.flag}</span>
                        <span>{option.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`rounded-full ${isDarkMode ? 
                  'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                  'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </Button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-2 rounded-full ${isDarkMode ? 
                  'bg-[#1a103d] hover:bg-[#2a205d] text-white' : 
                  'bg-white hover:bg-[#ffe4ec] text-[#ff6b9c]'} transition-all duration-300`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className={`md:hidden mt-4 py-4 ${isDarkMode ? 
              'bg-[#1a103d]' : 
              'bg-white'} rounded-lg shadow-lg`}>
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 text-left font-medium transition-all duration-300 ${activeSection === item.id ? 
                      (isDarkMode ? 'text-[#ff9acb]' : 'text-[#ff6b9c]') : 
                      'text-inherit'}`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="px-4 pt-2">
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className={`w-full rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                      'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-[#ff9acb]/30' : 
                      'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] text-white hover:shadow-lg hover:shadow-[#ff6b9c]/30'}`}
                  >
                    {t.hireMe}
                  </Button>
                </div>
              </nav>
            </div>
          )}

          {isSearchOpen && (
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 
              'bg-[#1a103d]' : 
              'bg-white'} shadow-lg`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentLang === "fr" ? "Rechercher..." : currentLang === "en" ? "Search..." : "البحث..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-2 px-4 pr-10 rounded-full ${isDarkMode ? 
                    'bg-[#0b0c1d] text-white border border-[#2a205d] focus:border-[#ff9acb]' : 
                    'bg-[#ffe4ec] text-[#ff6b9c] border border-[#ffc2d6] focus:border-[#ff6b9c]'} focus:outline-none transition-colors duration-300`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X size={18} className={isDarkMode ? "text-gray-400" : "text-[#ff6b9c]"} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      {!isHeroDataEmpty && (
        <section id="home" className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-1/2 space-y-6">
                {heroData.specialist?.[currentLang] && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${isDarkMode ? 
                    'bg-[#1a103d] text-[#ff9acb]' : 
                    'bg-white text-[#ff6b9c]'} font-medium`}>
                    <Star className="mr-2 h-4 w-4" />
                    <span>
                      {heroData.specialist[currentLang]}
                    </span>
                  </div>
                )}

                {heroData.heroTitle?.[currentLang] && (
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDarkMode ? 
                    'text-white' : 
                    'text-[#ff4d7a]'}`}>
                    {heroData.heroTitle[currentLang]}
                  </h1>
                )}

                {heroData.heroDescription?.[currentLang] && (
                  <p className={`text-lg ${isDarkMode ? 
                    'text-gray-300' : 
                    'text-gray-700'}`}>
                    {heroData.heroDescription[currentLang]}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => (window.location.href = '/cv')}
                    className={`rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                      'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-[#ff9acb]/30' : 
                      'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] text-white hover:shadow-lg hover:shadow-[#ff6b9c]/30'}`}
                  >
                    {t.viewJourney}
                  </Button>

                  {heroData.heroButtons?.map((button, index) => {
                    const Icon = getIcon(button.icon);
                    const handleClick = () => {
                      if (button.link) window.location.href = button.link;
                    };
                    return (
                      <Button
                        key={index}
                        onClick={handleClick}
                        className={`rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                          'bg-[#1a103d] text-white border border-[#2a205d] hover:bg-[#2a205d]' : 
                          'bg-white text-[#ff6b9c] border border-[#ffc2d6] hover:bg-[#ffe4ec]'}`}
                      >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {button.text?.[currentLang]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {photoUrl ? (
                <div className="md:w-1/2 flex justify-center">
                  <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden ${isDarkMode ? 
                    'ring-4 ring-[#ff9acb] shadow-lg shadow-[#ff9acb]/30' : 
                    'ring-4 ring-[#ff6b9c] shadow-lg shadow-[#ff6b9c]/30'} transition-all duration-500`}>
                    <Image
                      src={photoUrl}
                      alt="Profile photo"
                      width={400}
                      height={400}
                      priority
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>) : (
                <div className="md:w-1/2 flex justify-center">
                  <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden ${isDarkMode ? 
                    'ring-4 ring-[#ff9acb] shadow-lg shadow-[#ff9acb]/30' : 
                    'ring-4 ring-[#ff6b9c] shadow-lg shadow-[#ff6b9c]/30'} transition-all duration-500`}>
                    <Image
                      src={"https://woxgxzelncuqwury.public.blob.vercel-storage.com/profile_1755462555430_HanSooyoung.png"}
                      alt="Profile photo"
                      width={400}
                      height={400}
                      priority
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

   
      {/* Skills Section */}
      {!isSkillsDataEmpty && (
        <section id="skills" className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDarkMode ? 
              'text-white' : 
              'text-[#ff4d7a]'}`}>
              {t.skillsTitle}
              <span className={`block w-20 h-1 mx-auto mt-4 ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {skillsData?.skills?.map((category, catIndex) => {
                const CategoryIcon = getIcon(category.skillicon);

                return (
                  <div key={catIndex} className={`p-6 rounded-2xl ${isDarkMode ? 
                    'bg-[#1a103d]' : 
                    'bg-white'} shadow-lg`}>
                    <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 
                      'text-white' : 
                      'text-[#ff4d7a]'}`}>
                      {CategoryIcon && (
                        <CategoryIcon className="mr-3" />
                      )}
                      {category.title?.[currentLang]}
                    </h3>

                    {category.items.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {category.items.map((skill, skillIndex) => {
                          const SkillIcon = getIcon(skill.icon);

                          return (
                            <Card
                              key={skillIndex}
                              className={`transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                                ' border-[#2a205d]' : 
                                'bg-[#ffe4ec] border-[#ffc2d6]'} border`}
                            >
                              <CardContent className="p-4 flex flex-col items-center text-center">
                                {SkillIcon && (
                                  <SkillIcon className={`h-8 w-8 mb-2 ${isDarkMode ? 
                                    'text-[#ff9acb]' : 
                                    'text-[#ff6b9c]'}`} />
                                )}
                                <h4 className={`font-medium ${isDarkMode ? 
                                  'text-white' : 
                                  'text-gray-800'}`}>
                                  {skill.name?.[currentLang]}
                                </h4>
                                {skill.examples?.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {skill.examples.map((ex, exIndex) => (
                                      <li key={exIndex} className={`text-xs ${isDarkMode ? 
                                        'text-gray-400' : 
                                        'text-gray-600'}`}>{ex?.[currentLang]}</li>
                                    ))}
                                  </ul>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No skills listed.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>)}

      {/* Experience & Education Section */}
      {!isJourneyDataEmpty && (
        <section
          id="experience"
          className={`py-20 px-4 ${isDarkMode ? 
            'bg-[#0f1029]' : 
            'bg-[#ffecf1]'}`}
        >
          <div className="container mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDarkMode ? 
              'text-white' : 
              'text-[#ff4d7a]'}`}>
              {t.journeyTitle}
              <span className={`block w-20 h-1 mx-auto mt-4 ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}></span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {educationData?.education?.length > 0 && (
                <div>
                  <h3 className={`text-2xl font-semibold mb-8 flex items-center ${isDarkMode ? 
                    'text-white' : 
                    'text-[#ff4d7a]'}`}>
                    <GraduationCap className="mr-3" />
                    {currentLang === "fr" ? "Formation" : currentLang === "en" ? "Education" : "التعليم"}
                  </h3>
                  <div className="relative">
                    <div className={`absolute left-5 top-0 h-full w-0.5 ${isDarkMode ? 
                      'bg-[#2a205d]' : 
                      'bg-[#ffc2d6]'}`}></div>
                    {educationData?.education && [...educationData.education].reverse().map((event, index) => (
                      <div key={index} className="relative mb-10 pl-16">
                        <div
                          className={`absolute left-5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ${isDarkMode ? 
                            'bg-[#ff9acb] ring-4 ring-[#ff9acb]/20' : 
                            'bg-[#ff6b9c] ring-4 ring-[#ff6b9c]/20'}`}
                        ></div>
                        <div
                          className={`absolute left-11 top-3 h-0.5 w-6 ${isDarkMode ? 
                            'bg-[#2a205d]' : 
                            'bg-[#ffc2d6]'}`}
                        ></div>
                        <p className={`text-sm font-medium mb-1 ${isDarkMode ? 
                          'text-[#ff9acb]' : 
                          'text-[#ff6b9c]'}`}>
                          {event.year?.[currentLang]}
                        </p>
                        <h4 className={`text-xl font-semibold mb-1 ${isDarkMode ? 
                          'text-white' : 
                          'text-gray-800'}`}>
                          {event.title?.[currentLang]}
                        </h4>
                        <p className={`font-medium mb-2 ${isDarkMode ? 
                          'text-gray-400' : 
                          'text-gray-600'}`}>
                          {event.institution?.[currentLang]}
                        </p>
                        {event.description && (
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {event.description?.[currentLang]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {educationData.experience?.length > 0 && (
                <div>
                  <h3 className={`text-2xl font-semibold mb-8 flex items-center ${isDarkMode ? 
                    'text-white' : 
                    'text-[#ff4d7a]'}`}>
                    <Briefcase className="mr-3" />
                    {currentLang === "fr" ? "Expérience" : currentLang === "en" ? "Experience" : "الخبرة"}
                  </h3>
                  <div className="relative">
                    <div className={`absolute left-5 top-0 h-full w-0.5 ${isDarkMode ? 
                      'bg-[#2a205d]' : 
                      'bg-[#ffc2d6]'}`}></div>
                    {educationData?.experience && [...educationData.experience].reverse().map((event, index) => (
                      <div key={index} className="relative mb-10 pl-16">
                        <div
                          className={`absolute left-5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ${isDarkMode ? 
                            'bg-[#ff9acb] ring-4 ring-[#ff9acb]/20' : 
                            'bg-[#ff6b9c] ring-4 ring-[#ff6b9c]/20'}`}
                        ></div>
                        <div
                          className={`absolute left-11 top-3 h-0.5 w-6 ${isDarkMode ? 
                            'bg-[#2a205d]' : 
                            'bg-[#ffc2d6]'}`}
                        ></div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium ${isDarkMode ? 
                            'text-[#ff9acb]' : 
                            'text-[#ff6b9c]'}`}>
                            {event.year?.[currentLang]}
                          </p>
                          {event.duration && (
                            <Badge className={isDarkMode ? 
                              'bg-[#2a205d] text-[#ff9acb]' : 
                              'bg-[#ffe4ec] text-[#ff6b9c]'}>
                              {event.duration}
                            </Badge>
                          )}
                        </div>
                        <h4 className={`text-xl font-semibold mb-1 ${isDarkMode ? 
                          'text-white' : 
                          'text-gray-800'}`}>
                          {event.title?.[currentLang]}
                        </h4>
                        <p className={`font-medium mb-2 ${isDarkMode ? 
                          'text-gray-400' : 
                          'text-gray-600'}`}>
                          {event.institution?.[currentLang]}
                        </p>
                        {event.description && (
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {event.description?.[currentLang]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {!isProjectsEmpty && (
        <section
          id="projects"
          className={`py-20 px-4 ${isDarkMode ? 
            'bg-[#0f1029]' : 
            'bg-[#ffecf1]'}`}
        >
          <div className="container mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDarkMode ? 
              'text-white' : 
              'text-[#ff4d7a]'}`}>
              {t.myProjects}
              <span className={`block w-20 h-1 mx-auto mt-4 ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}></span>
            </h2>

            {projetsLoading ? (
              <div className="flex justify-center">
                <Loading />
              </div>
            ) : projetsData?.projects?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projetsData.projects.map((project: any) => (
                  <Card
                    key={project._id}
                    className={`group overflow-hidden transition-all duration-500 hover:scale-105 ${isDarkMode ? 
                      'bg-[#1a103d] border-[#2a205d]' : 
                      'bg-white border-[#ffe4ec]'} shadow-lg`}
                  >
                    <div className="overflow-hidden">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={`${project.title?.[currentLang] || project.title?.fr || project.title?.en || 'Project'}`}
                          width={800}
                          height={450}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-48 flex items-center justify-center ${isDarkMode ? 
                          '' : 
                          'bg-[#ffe4ec]'}`}>
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                            {currentLang === 'fr' ? 'Pas d\'image disponible' :
                              currentLang === 'en' ? 'No image available' :
                                'لا توجد صورة متاحة'}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 
                        'text-white' : 
                        'text-[#ff4d7a]'}`}>
                        {project.title?.[currentLang] || project.title?.fr || project.title?.en || project.title?.ar}
                      </h3>
                      <p
                        className={`mb-4 ${isDarkMode ? 
                          'text-gray-300' : 
                          'text-gray-700'}`}
                      >
                        {project.description?.[currentLang] || project.description?.fr || project.description?.en || project.description?.ar}
                      </p>

                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech: string, techIndex: number) => (
                            <Badge
                              key={techIndex}
                              className={isDarkMode ? 
                                'bg-[#2a205d] text-[#ff9acb]' : 
                                'bg-[#ffe4ec] text-[#ff6b9c]'}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.button && (
                        <div className="mt-4">
                          <Button
                            onClick={() => window.open(project.button.link, "_blank")}
                            className={`w-full rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                              'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-[#ff9acb]/30' : 
                              'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] text-white hover:shadow-lg hover:shadow-[#ff6b9c]/30'}`}
                          >
                            <Link className="mr-2 h-4 w-4" />
                            {project.button.label?.[currentLang] ||
                              project.button.label?.fr ||
                              project.button.label?.en ||
                              project.button.label?.ar ||
                              (currentLang === 'fr' ? 'Voir le projet' :
                                currentLang === 'en' ? 'View Project' :
                                  'عرض المشروع')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {currentLang === 'fr' ? 'Aucun projet trouvé' :
                    currentLang === 'en' ? 'No projects found' :
                      'لم يتم العثور على مشاريع'}
                </p>
              </div>
            )}
          </div>
        </section>)}

      {/* About Section */}
      {!isAboutDataEmpty && (
        <section id="about" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDarkMode ? 
                  'text-white' : 
                  'text-[#ff4d7a]'}`}>
                  {t.aboutTitle}
                  <span className={`block w-20 h-1 mt-4 ${isDarkMode ? 
                    'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                    'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}></span>
                </h2>

                <p className={`text-lg mb-8 ${isDarkMode ? 
                  'text-gray-300' : 
                  'text-gray-700'}`}>
                  {aboutData.aboutDescription?.[currentLang]}
                </p>

                {aboutData.personalInfo && (
                  <div className="space-y-4">
                    {aboutData.personalInfo?.map((info, index) => {
                      const IconComponent = getIcon(info.icon);
                      return (
                        <div key={index} className="flex items-start">
                          {IconComponent && (
                            <IconComponent className={`h-5 w-5 mt-1 mr-4 ${isDarkMode ? 
                              'text-[#ff9acb]' : 
                              'text-[#ff6b9c]'}`} />
                          )}
                          <div>
                            <p className={`font-medium ${isDarkMode ? 
                              'text-gray-400' : 
                              'text-gray-600'}`}>
                              {info.label?.[currentLang]}
                            </p>
                            <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                              {info.value?.[currentLang]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-10">
                {aboutData.languages && (
                  <div className={`p-6 rounded-2xl ${isDarkMode ? 
                    'bg-[#1a103d]' : 
                    'bg-white'} shadow-lg`}>
                    <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 
                      'text-white' : 
                      'text-[#ff4d7a]'}`}>
                      <LanguagesIcon className="mr-3" />
                      {aboutData.languages?.title?.[currentLang]}
                    </h3>
                    <div className="space-y-4">
                      {aboutData.languages?.list?.map((lang, index) => {
                        const levelKey = lang.level.toLowerCase();
                        const levelText = aboutData.languages?.levels?.[levelKey]?.[currentLang] || '';

                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                                {lang.name?.[currentLang]}
                              </span>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {levelText}
                              </span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 
                              '' : 
                              'bg-[#ffe4ec]'}`}>
                              <div 
                                className={`h-full rounded-full ${isDarkMode ? 
                                  'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                                  'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}
                                style={{ width: `${(['native', 'fluent', 'c2'].includes(levelKey) ? 100 : 
                                                ['advanced', 'c1'].includes(levelKey) ? 80 :
                                                ['intermediate', 'b1', 'b2'].includes(levelKey) ? 60 :
                                                ['beginner', 'a1', 'a2'].includes(levelKey) ? 40 : 20)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {aboutData.interests && (
                  <div className={`p-6 rounded-2xl ${isDarkMode ? 
                    'bg-[#1a103d]' : 
                    'bg-white'} shadow-lg`}>
                    <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 
                      'text-white' : 
                      'text-[#ff4d7a]'}`}>
                      <Heart className="mr-3" />
                      {t.interests}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {aboutData.interests?.map((interest, index) => {
                        const IconComponent = getIcon(interest.icon);
                        return (
                          <Badge
                            key={index}
                            className={`py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                              ' text-[#ff9acb] hover:bg-[#2a205d]' : 
                              'bg-[#ffe4ec] text-[#ff6b9c] hover:bg-[#ffc2d6]'}`}
                          >
                            {IconComponent && (
                              <IconComponent className="mr-2 h-4 w-4" />
                            )}
                            {interest.name?.[currentLang]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
   {/* Services Section */}
      {!isServicesEmpty && (
        <section id="services" className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDarkMode ? 
              'text-white' : 
              'text-[#ff4d7a]'}`}>
              {t.servicesTitle}
              <span className={`block w-20 h-1 mx-auto mt-4 ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a]'}`}></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(servicesData?.servicesList) && servicesData.servicesList.length > 0 ? (
                servicesData.servicesList.map((service, index) => {
                  const title = service.title?.[currentLang] ||
                    service.title?.[currentLang === 'fr' ? 'en' : currentLang === 'en' ? 'ar' : 'fr'] ||
                    service.title?.[currentLang === 'ar' ? 'fr' : 'en'];
                  const description = service.description?.[currentLang] ||
                    service.description?.[currentLang === 'fr' ? 'en' : currentLang === 'en' ? 'ar' : 'fr'] ||
                    service.description?.[currentLang === 'ar' ? 'fr' : 'en'];

                  if (!title) return null;

                  return (
                    <Card
                      key={index}
                      className={`group transition-all duration-500 hover:scale-105 ${isDarkMode ? 
                        'bg-[#1a103d] border-[#2a205d] hover:border-[#ff9acb]' : 
                        'bg-white border-[#ffe4ec] hover:border-[#ff6b9c]'} overflow-hidden`}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-2xl font-bold ${isDarkMode ? 
                            'text-[#ff9acb]' : 
                            'text-[#ff6b9c]'}`}>0{index + 1}</span>
                          <ArrowUpRight className={`transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isDarkMode ? 
                            'text-[#a67cff]' : 
                            'text-[#ff4d7a]'}`}
                          />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 
                          'text-white' : 
                          'text-[#ff4d7a]'}`}>{title}</h3>
                        {description && <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{description}</p>}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center col-span-full">No services available</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {!isContactDataEmpty && (
        <section id="contact" className={`py-20 px-4 ${isDarkMode ? 
          'bg-[#0f1029]' : 
          'bg-[#ffecf1]'}`}>
          <div className="container mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 
              'text-white' : 
              'text-[#ff4d7a]'}`}>
              {contactData.contactTitle?.[currentLang]}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto mb-12 ${isDarkMode ? 
              'text-gray-300' : 
              'text-gray-700'}`}>
              {contactData.contactDescription?.[currentLang]}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {contactData.contactInfo?.map((info, index) => {
                const IconComponent = getIcon(info.icon);
                return (
                  <div key={index} className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                    'bg-[#1a103d]' : 
                    'bg-white'} shadow-lg`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDarkMode ? 
                      ' text-[#ff9acb]' : 
                      'bg-[#ffe4ec] text-[#ff6b9c]'}`}>
                      {IconComponent && (
                        <IconComponent className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 
                      'text-white' : 
                      'text-gray-800'}`}>
                      {info.label?.[currentLang]}
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith("http") ? "_blank" : "_self"}
                          rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
                          className={`hover:underline ${isDarkMode ? 
                            'text-[#ff9acb]' : 
                            'text-[#ff6b9c]'}`}
                        >
                          {typeof info.value === "object"
                            ? info.value[currentLang]
                            : info.value}
                        </a>
                      ) : (
                        typeof info.value === "object"
                          ? info.value[currentLang]
                          : info.value
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            <a
              href={contactData.contactButton?.link || "#contact-form"}
              className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-[#ff9acb]/30' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] text-white hover:shadow-lg hover:shadow-[#ff6b9c]/30'}`}
            >
              <Send className="mr-2 h-5 w-5" />
              {contactData.contactButton?.startProject?.[currentLang]}
            </a>
          </div>
        </section>)}

      {/* Footer */}
      <footer className={`py-8 px-4 ${isDarkMode ? 
        'bg-[#0b0c1d]' : 
        'bg-[#ffd6e7]'}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className={`font-bold ${isDarkMode ? 
                'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] bg-clip-text text-transparent' : 
                'bg-gradient-to-r from-[#ff6b9c] to-[#ff4d7a] bg-clip-text text-transparent'}`}>
                © 2025 {usernameData?.[currentLang]}
              </span>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', 'Poppins', sans-serif;
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#0b0c1d' : '#ffd6e7'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 
            'linear-gradient(to bottom, #ff9acb, #a67cff)' : 
            'linear-gradient(to bottom, #ff6b9c, #ff4d7a)'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 
            'linear-gradient(to bottom, #ff7eb9, #9b5fff)' : 
            'linear-gradient(to bottom, #ff5a8c, #ff3d70)'};
        }
        
        /* Animation for section reveal */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        section {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        /* Gradient text animation */
        .gradient-text {
          background: ${isDarkMode ? 
            'linear-gradient(45deg, #ff9acb, #a67cff, #9cecfb)' : 
            'linear-gradient(45deg, #ff6b9c, #ff4d7a, #ff8eb4)'};
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Custom navigation spacing */
        .custom-nav-spacing > *:not(:last-child) {
          margin-right: 20px;
        }

        @media (min-width: 1990px) {
          .custom-nav-spacing > *:not(:last-child) {
            margin-right: 48px;
          }
        }
      `}</style>
    </div>
  )
}