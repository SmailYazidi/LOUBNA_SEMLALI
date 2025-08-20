"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Loading from '@/components/Loading';
import Image from "next/image"
import './styles.css';
import {
  Send,
  Star,
  Menu,
  X,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Languages,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Link as LinkIcon,
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
        console.error("Error fetching skills data:", err);
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
        console.error("Error fetching projets data:", err);
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

 

  const getThemeClass = (baseClass, darkVariant, lightVariant) => {
    return `${baseClass} ${isDarkMode ? darkVariant : lightVariant}`;
  };

  if (heroLoading || servicesLoading || photoLoading || educationLoading || aboutLoading || contactLoading || projetsLoading || skillsLoading || usernameLoading) return <Loading/>;
  
  return (
    <>
   
      <div className={`portfolio-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <header className={`header ${isDarkMode ? 'dark-header' : 'light-header'} py-4`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-xl font-bold">
                  <span className={isDarkMode ? 'gradient-text' : 'light-gradient-text'}>
                    {usernameData?.[currentLang]}
                  </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex ml-12 space-x-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`nav-link ${getThemeClass('', 'dark-nav-link', 'light-nav-link')} ${
                        activeSection === item.id ? 'active-nav-link' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center space-x-3">
                {/* Language Selector */}
                <div className="relative">
                  <Button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className={getThemeClass('secondary-btn', 'dark-secondary-btn', 'light-secondary-btn')}
                  >
                    <span>{currentLang.toUpperCase()}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </Button>

                  {isLangMenuOpen && (
                    <div className={`language-menu ${isDarkMode ? 'dark-language-menu' : 'light-language-menu'}`}>
                      {languageOptions.map((option) => (
                        <button
                          key={option.code}
                          onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                          className="w-full text-left px-4 py-2 hover:bg-opacity-10 hover:bg-purple-500 flex items-center"
                        >
                          <span className="mr-2">{option.flag}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <Button
                  onClick={toggleTheme}
                  className={getThemeClass('secondary-btn', 'dark-secondary-btn', 'light-secondary-btn')}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                {/* Search Button */}
                <Button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={getThemeClass('secondary-btn', 'dark-secondary-btn', 'light-secondary-btn')}
                >
                  {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                </Button>

                {/* Hire Me Button */}
                <Button
                  onClick={() => scrollToSection("contact")}
                  className={isDarkMode ? 'gradient-btn' : 'light-gradient-btn'}
                >
                  {t.hireMe}
                </Button>

                {/* Mobile Menu Button */}
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`md:hidden ${getThemeClass('secondary-btn', 'dark-secondary-btn', 'light-secondary-btn')}`}
                >
                  {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className={`mobile-menu ${isDarkMode ? 'dark-mobile-menu' : 'light-mobile-menu'} md:hidden`}>
                <nav className="flex flex-col items-center space-y-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-xl font-medium ${activeSection === item.id ? 'gradient-text' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="mt-6">
                    <Button
                      onClick={() => scrollToSection("contact")}
                      className={isDarkMode ? 'gradient-btn' : 'light-gradient-btn'}
                    >
                      {t.hireMe}
                    </Button>
                  </div>
                </nav>
              </div>
            )}

            {/* Search Overlay */}
            {isSearchOpen && (
              <div className={`search-overlay ${isDarkMode ? 'dark-search-overlay' : 'light-search-overlay'}`}>
                <div className="w-full max-w-2xl px-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={currentLang === "fr" ? "Rechercher..." : currentLang === "en" ? "Search..." : "البحث..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-4 px-6 rounded-lg border-0 text-lg focus:ring-2 focus:outline-none"
                      style={{
                        background: isDarkMode ? 'rgba(26, 16, 61, 0.5)' : 'rgba(255, 253, 252, 0.7)',
                        color: isDarkMode ? '#f9f9fb' : '#1a103d',
                        boxShadow: isDarkMode 
                          ? '0 4px 20px rgba(166, 124, 255, 0.15)' 
                          : '0 4px 20px rgba(200, 162, 200, 0.1)'
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        aria-label="Clear search"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="pt-20">
          {/* Hero Section */}
          {!isHeroDataEmpty && (
            <section id="home" className="min-h-screen flex items-center py-20">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="md:w-1/2 mb-12 md:mb-0 fade-in">
                    {heroData.specialist?.[currentLang] && (
                      <div className="flex items-center mb-6">
                        <div className={`p-2 rounded-full mr-3 ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                          <Star size={16} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
                        </div>
                        <span className={isDarkMode ? 'text-purple-300' : 'text-purple-600'}>
                          {heroData.specialist[currentLang]}
                        </span>
                      </div>
                    )}

                    {heroData.heroTitle?.[currentLang] && (
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        {heroData.heroTitle[currentLang]}
                      </h1>
                    )}

                    {heroData.heroDescription?.[currentLang] && (
                      <p className="text-xl mb-8 opacity-80">
                        {heroData.heroDescription[currentLang]}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={() => (window.location.href = '/cv')}
                        className={isDarkMode ? 'gradient-btn' : 'light-gradient-btn'}
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
                            className={getThemeClass('secondary-btn', 'dark-secondary-btn', 'light-secondary-btn')}
                          >
                            {Icon && <Icon size={18} className="mr-2" />}
                            {button.text?.[currentLang]}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {photoUrl ? (
                    <div className="md:w-1/2 flex justify-center fade-in delay-200">
                      <div className={`profile-image-container ${isDarkMode ? 'dark-profile-glow' : 'light-profile-glow'}`}>
                        <div className="rounded-full overflow-hidden border-4" style={{ 
                          borderColor: isDarkMode ? 'rgba(166, 124, 255, 0.2)' : 'rgba(200, 162, 200, 0.2)',
                          width: '350px',
                          height: '350px'
                        }}>
                          <Image
                            src={photoUrl}
                            alt="Profile photo"
                            width={350}
                            height={350}
                            className="object-cover w-full h-full"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-1/2 flex justify-center fade-in delay-200">
                      <div className={`profile-image-container ${isDarkMode ? 'dark-profile-glow' : 'light-profile-glow'}`}>
                        <div className="rounded-full overflow-hidden border-4" style={{ 
                          borderColor: isDarkMode ? 'rgba(166, 124, 255, 0.2)' : 'rgba(200, 162, 200, 0.2)',
                          width: '350px',
                          height: '350px'
                        }}>
                          <Image
                            src={"https://woxgxzelncuqwury.public.blob.vercel-storage.com/profile_1755462555430_HanSooyoung.png"}
                            alt="Profile photo"
                            width={350}
                            height={350}
                            className="object-cover w-full h-full"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Services Section */}
          {!isServicesEmpty && (
            <section id="services" className="py-20">
              <div className="container mx-auto px-4">
                <h2 className={`section-title text-3xl font-bold text-center ${getThemeClass('', 'dark-title', 'light-title')}`}>
                  {t.servicesTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  {Array.isArray(servicesData?.servicesList) && servicesData.servicesList.length > 0 ? (
                    servicesData.servicesList.map((service, index) => {
                      const title = service.title?.[currentLang] || service.title?.en || service.title?.fr || service.title?.ar;
                      const description = service.description?.[currentLang] || service.description?.en || service.description?.fr || service.description?.ar;

                      if (!title) return null;

                      return (
                        <Card
                          key={index}
                          className={`portfolio-card fade-in delay-${(index % 3) * 100} ${getThemeClass('', 'dark-card', 'light-card')}`}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-2xl font-bold opacity-70">0{index + 1}</span>
                              <ArrowUpRight size={20} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{title}</h3>
                            {description && <p className="opacity-80">{description}</p>}
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <p>No services available</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Experience & Education Section */}
          {!isJourneyDataEmpty && (
            <section id="experience" className="py-20">
              <div className="container mx-auto px-4">
                <h2 className={`section-title text-3xl font-bold text-center ${getThemeClass('', 'dark-title', 'light-title')}`}>
                  {t.journeyTitle}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                  {educationData?.education?.length > 0 && (
                    <div>
                      <h3 className={`text-xl font-semibold mb-8 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <GraduationCap size={24} className="mr-3" />
                        {currentLang === "fr" ? "Formation" : currentLang === "en" ? "Education" : "التعليم"}
                      </h3>
                      <div className="relative">
                        <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-purple-800' : 'bg-purple-200'}`}></div>
                        {educationData?.education && [...educationData.education].reverse().map((event, index) => (
                          <div key={index} className="relative pl-20 pb-10">
                            <div className={`absolute left-6 w-4 h-4 rounded-full -translate-x-1/2 ${isDarkMode 
                              ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' 
                              : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79]'}`}></div>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                              {event.year?.[currentLang]}
                            </p>
                            <h4 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {event.title?.[currentLang]}
                            </h4>
                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                              {event.institution?.[currentLang]}
                            </p>
                            {event.description && (
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
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
                      <h3 className={`text-xl font-semibold mb-8 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Briefcase size={24} className="mr-3" />
                        {currentLang === "fr" ? "Expérience" : currentLang === "en" ? "Experience" : "الخبرة"}
                      </h3>
                      <div className="relative">
                        <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-purple-800' : 'bg-purple-200'}`}></div>
                        {educationData?.experience && [...educationData.experience].reverse().map((event, index) => (
                          <div key={index} className="relative pl-20 pb-10">
                            <div className={`absolute left-6 w-4 h-4 rounded-full -translate-x-1/2 ${isDarkMode 
                              ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' 
                              : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79]'}`}></div>
                            <div className="flex items-center mb-1">
                              <p className={`text-sm mr-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                                {event.year?.[currentLang]}
                              </p>
                              {event.duration && (
                                <Badge className={isDarkMode 
                                  ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
                                  : 'bg-purple-100 text-purple-600 border-purple-200'}>
                                  {event.duration}
                                </Badge>
                              )}
                            </div>
                            <h4 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {event.title?.[currentLang]}
                            </h4>
                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                              {event.institution?.[currentLang]}
                            </p>
                            {event.description && (
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
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

          {/* Skills Section */}
          {!isSkillsDataEmpty && (
            <section id="skills" className="py-20">
              <div className="container mx-auto px-4">
                <h2 className={`section-title text-3xl font-bold text-center ${getThemeClass('', 'dark-title', 'light-title')}`}>
                  {t.skillsTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {skillsData?.skills?.map((category, catIndex) => {
                    const CategoryIcon = getIcon(category.skillicon);

                    return (
                      <div key={catIndex} className={`p-6 rounded-xl ${isDarkMode 
                        ? 'bg-[#1a103d] border border-purple-800/30' 
                        : 'bg-white border border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {CategoryIcon && (
                            <CategoryIcon size={20} className="mr-3" />
                          )}
                          {category.title?.[currentLang]}
                        </h3>

                        {category.items.length > 0 ? (
                          <div className="space-y-4">
                            {category.items.map((skill, skillIndex) => {
                              const SkillIcon = getIcon(skill.icon);

                              return (
                                <div key={skillIndex} className={`p-4 rounded-lg ${isDarkMode 
                                  ? 'bg-[#0b0c1d] border border-purple-900/30' 
                                  : 'bg-gray-50 border border-gray-200'}`}>
                                  <div className="flex items-start">
                                    {SkillIcon && (
                                      <SkillIcon size={18} className={`mt-1 mr-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                                    )}
                                    <div className="flex-1">
                                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {skill.name?.[currentLang]}
                                      </h4>
                                      {skill.examples?.length > 0 && (
                                        <ul className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          {skill.examples.map((ex, exIndex) => (
                                            <li key={exIndex} className="mb-1 last:mb-0">• {ex?.[currentLang]}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                </div>
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
            </section>
          )}

          {/* Projects Section */}
          {!isProjectsEmpty && (
            <section id="projects" className="py-20">
              <div className="container mx-auto px-4">
                <h2 className={`section-title text-3xl font-bold text-center ${getThemeClass('', 'dark-title', 'light-title')}`}>
                  {t.myProjects}
                </h2>

                {projetsLoading ? (
                  <div className="flex justify-center">
                    <Loading />
                  </div>
                ) : projetsData?.projects?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {projetsData.projects.map((project: any) => (
                      <Card
                        key={project._id}
                        className={`portfolio-card ${getThemeClass('', 'dark-card', 'light-card')}`}
                      >
                        <div className="overflow-hidden">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={`${project.title?.[currentLang] || project.title?.fr || project.title?.en || 'Project'}`}
                              width={800}
                              height={450}
                              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-48 flex items-center justify-center ${isDarkMode 
                              ? 'bg-purple-900/20' 
                              : 'bg-purple-100'}`}>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {currentLang === 'fr' ? 'Pas d\'image disponible' :
                                  currentLang === 'en' ? 'No image available' :
                                    'لا توجد صورة متاحة'}
                              </span>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {project.title?.[currentLang] || project.title?.fr || project.title?.en || project.title?.ar}
                          </h3>
                          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {project.description?.[currentLang] || project.description?.fr || project.description?.en || project.description?.ar}
                          </p>

                          {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.techStack.map((tech: string, techIndex: number) => (
                                <Badge
                                  key={techIndex}
                                  className={isDarkMode 
                                    ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
                                    : 'bg-purple-100 text-purple-600 border-purple-200'}
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
                                className={`w-full font-medium ${isDarkMode 
                                  ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-purple-500/30' 
                                  : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79] text-white hover:shadow-lg hover:shadow-pink-300'}`}
                              >
                                <LinkIcon size={16} className="mr-2" />
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
                  <div className="text-center py-12">
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {currentLang === 'fr' ? 'Aucun projet trouvé' :
                        currentLang === 'en' ? 'No projects found' :
                          'لم يتم العثور على مشاريع'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

           {/* About Section */}
      {!isAboutDataEmpty && (
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className={`rounded-2xl p-8 md:p-12 ${isDarkMode 
              ? 'bg-[#1a103d] border border-purple-800/30' 
              : 'bg-white border border-gray-200'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.aboutTitle}
                    <span className={`block h-1 w-16 mt-4 rounded-full ${isDarkMode 
                      ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' 
                      : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79]'}`}></span>
                  </h2>

                  <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {aboutData.aboutDescription?.[currentLang]}
                  </p>

                  {aboutData.personalInfo && (
                    <div className="space-y-4">
                      {aboutData.personalInfo?.map((info, index) => {
                        const IconComponent = getIcon(info.icon);
                        return (
                          <div key={index} className="flex items-start">
                            {IconComponent && (
                              <IconComponent size={20} className={`mt-1 mr-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                            )}
                            <div>
                              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {info.label?.[currentLang]}
                              </p>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {info.value?.[currentLang]}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {aboutData.languages && (
                    <div>
                      <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Languages size={24} className="mr-3" />
                        {aboutData.languages?.title?.[currentLang]}
                      </h3>
                      <div className="space-y-4">
                        {aboutData.languages?.list?.map((lang, index) => {
                          const levelKey = lang.level.toLowerCase();
                          const levelText = aboutData.languages?.levels?.[levelKey]?.[currentLang] || '';

                          return (
                            <div key={index}>
                              <div className="flex justify-between mb-2">
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  {lang.name?.[currentLang]}
                                </span>
                                <span className={isDarkMode ? 'text-purple-300' : 'text-purple-600'}>
                                  {levelText}
                                </span>
                              </div>
                              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode 
                                ? 'bg-purple-900/30' 
                                : 'bg-purple-100'}`}>
                                <div 
                                  className={`h-full rounded-full ${isDarkMode 
                                    ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff]' 
                                    : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79]'}`}
                                  style={{ width: `${(lang.level === 'native' ? 100 : lang.level === 'fluent' ? 90 : lang.level === 'intermediate' ? 70 : 50)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {aboutData.interests && (
                    <div>
                      <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Heart size={24} className="mr-3" />
                        {t.interests}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {aboutData.interests?.map((interest, index) => {
                          const IconComponent = getIcon(interest.icon);
                          return (
                            <Badge
                              key={index}
                              className={`py-2 px-4 ${isDarkMode 
                                ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
                                : 'bg-purple-100 text-purple-600 border-purple-200'}`}
                            >
                              {IconComponent && (
                                <IconComponent size={16} className="mr-2" />
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
          </div>
        </section>
      )}

          {/* Contact Section */}
          {!isContactDataEmpty && (
            <section id="contact" className="py-20">
              <div className="container mx-auto px-4">
                <div className={`rounded-2xl p-8 md:p-12 text-center ${isDarkMode 
                  ? 'bg-[#1a103d] border border-purple-800/30' 
                  : 'bg-white border border-gray-200'}`}>
                  <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contactData.contactTitle?.[currentLang]}
                  </h2>
                  <p className={`text-xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {contactData.contactDescription?.[currentLang]}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactData.contactInfo?.map((info, index) => {
                      const IconComponent = getIcon(info.icon);
                      return (
                        <div key={index} className={`p-6 rounded-xl ${isDarkMode 
                          ? 'bg-[#0b0c1d] border border-purple-900/30' 
                          : 'bg-gray-50 border border-gray-200'}`}>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDarkMode 
                            ? 'bg-purple-900/30 text-purple-300' 
                            : 'bg-purple-100 text-purple-600'}`}>
                            {IconComponent && (
                              <IconComponent size={20} />
                            )}
                          </div>
                          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {info.label?.[currentLang]}
                          </h3>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {info.link ? (
                              <a
                                href={info.link}
                                target={info.link.startsWith("http") ? "_blank" : "_self"}
                                rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
                                className={`hover:underline ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}
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
                    className={`inline-flex items-center px-8 py-4 rounded-full font-medium ${isDarkMode 
                      ? 'bg-gradient-to-r from-[#ff9acb] to-[#a67cff] text-white hover:shadow-lg hover:shadow-purple-500/30' 
                      : 'bg-gradient-to-r from-[#f6a5c0] to-[#b76e79] text-white hover:shadow-lg hover:shadow-pink-300'}`}
                  >
                    <Send size={18} className="mr-2" />
                    {contactData.contactButton?.startProject?.[currentLang]}
                  </a>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className={`py-8 ${isDarkMode 
          ? 'bg-[#0b0c1d] border-t border-purple-900/30' 
          : 'bg-gray-50 border-t border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  © 2025 {usernameData?.[currentLang]}
                </span>
              </div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t.rightsReserved}</p>
            </div>
          </div>
        </footer>
      </div>  
    </>
  );
}