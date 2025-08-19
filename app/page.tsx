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

// Translation data for Smail Yazidi
const translations = {
  fr: {
    // Header
    home: "Accueil",
    services: "Services",
    experience: "Parcours",
    skills: "Compétences",
    projects: "Projets",
    about: "À Propos",
    contact: "Contact",
    hireMe: "Me Contacter",
     
   viewJourney: "Voir Mon CV",

    // Services
    servicesTitle: "Services",
 

    // Experience & Education Timeline
    journeyTitle: "Parcours Professionnel & Éducatif",


    // Skills
    skillsTitle: "Mes Compétences",
  

    // Projects
    myProjects: "Mes Projets",


 // (You fill in the details)
    // About
    aboutTitle: "À Propos de Moi",
   
interests:"Centres d'Intérêt",
    // Footer
    rightsReserved: "Tous droits réservés",
  },
  en: {
    // Header
    home: "Home",
    services: "Services",
    experience: "Journey",
    skills: "Skills",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    hireMe: "Hire Me",
interests:"Interests",
 viewJourney: "View My CV",

    // Services
    servicesTitle: "Services",
  
    // Experience & Education Timeline
    journeyTitle: "Work Experience & Education Timeline",
 
    // Skills
    skillsTitle: "My Skills",
   

    // Projects
    myProjects: "My Projects",
   
    aboutTitle: "About Me",
    // Footer
    rightsReserved: "All rights reserved",
  },
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

  const [currentLang, setCurrentLang] = useState<"fr" | "en">(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('language');
      return saved !== null ? saved as "fr" | "en" : "fr";
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
  }, [currentLang]);


  // Modify your theme toggle function to persist the setting
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    sessionStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Modify your language change function to persist the setting
  const changeLanguage = (lang: "fr" | "en") => {
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
  // Fetch username
     fetch("/api/username")
       .then((res) => res.json())
      .then((data) => {
      setUsernameData(data || "");
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
  // Fetch contact data
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
    // Fetch education data
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


    // Fetch education data
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


    // Fetch Projets data
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

  // Close language menu when clicking outside
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
  ]

 
  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-500",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
    cardBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    headerBg: isDarkMode ? "bg-[#0a0a0a]/95" : "bg-white/95",
    headerBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    sectionBg: isDarkMode ? "bg-[#111111]" : "bg-gray-50",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    accentGold: "rgb(var(--portfolio-gold))",
    accentGoldHover: "rgb(var(--portfolio-gold-hover))",
    accentGoldForeground: "rgb(var(--portfolio-gold-foreground))",
    accentRed: "var(--portfolio-red)",
    accentRedForeground: "var(--portfolio-red-foreground)",
  }
const isProjectsEmpty = !projetsData || !projetsData.projects?.length;

const isServicesEmpty = !servicesData || !servicesData.servicesList?.length;

const isJourneyDataEmpty =
  !educationData ||
  (!educationData.education?.length && !educationData.experience?.length);
  const isContactDataEmpty =
  !contactData ||
  !(
  
    (contactData.contactDescription?.[currentLang]?.trim() !== "") ||
    (contactData.contactInfo && contactData.contactInfo.length > 0 &&
      contactData.contactInfo.some(info =>
        (info.label?.[currentLang]?.trim() !== "") ||
        (info.value?.trim() !== "")
      )
    ) ||
    (contactData.contactButton?.startProject?.[currentLang]?.trim() !== "")
  );
const isAboutDataEmpty =
  !aboutData ||
  !(
 
    (aboutData.aboutDescription?.[currentLang]?.trim() !== "") ||
    (aboutData.personalInfo && aboutData.personalInfo.length > 0 &&
      aboutData.personalInfo.some(info =>
        (info.label?.[currentLang]?.trim() !== "") ||
        (info.value?.[currentLang]?.trim() !== "")
      )
    ) ||
    (aboutData.languages?.list && aboutData.languages.list.length > 0 &&
      aboutData.languages.list.some(language =>
        (language.name?.[currentLang]?.trim() !== "") ||
        (language.level?.trim() !== "")
      )
    ) ||
    (aboutData.interests && aboutData.interests.length > 0 &&
      aboutData.interests.some(interest =>
        (interest.name?.[currentLang]?.trim() !== "")
      )
    )
  );
const isSkillsDataEmpty =
  !skillsData ||
  !(
  /*   (skillsData.skillsTitle?.[currentLang]?.trim() !== "") || */
    (skillsData.skills && skillsData.skills.length > 0 &&
      skillsData.skills.some(skill =>
        (skill.title?.[currentLang]?.trim() !== "") ||
        (skill.items && skill.items.length > 0 &&
          skill.items.some(item =>
            (item.name?.[currentLang]?.trim() !== "") ||
            (item.examples && item.examples.some(ex => ex[currentLang]?.trim() !== ""))
          )
        )
      )
    )
  );
const isHeroDataEmpty =
  !heroData ||
  !(
    (heroData.specialist?.[currentLang] && heroData.specialist[currentLang].trim() !== "") ||
    (heroData.heroTitle?.[currentLang] && heroData.heroTitle[currentLang].trim() !== "") ||
    (heroData.heroDescription?.[currentLang] && heroData.heroDescription[currentLang].trim() !== "") ||
    (heroData.heroButtons && heroData.heroButtons.length > 0)
  );



const navItems = [
  !isServicesEmpty && { id: "services", label: t.services },
  !isJourneyDataEmpty && { id: "experience", label: t.experience },
  !isSkillsDataEmpty && { id: "skills", label: t.skills },
  !isProjectsEmpty && { id: "projects", label: t.projects },
  !isAboutDataEmpty && { id: "about", label: t.about },
  !isContactDataEmpty && { id: "contact", label: t.contact },
].filter(Boolean); // remove false values


const getIcon = (iconName?: string) => {
  if (!iconName) return null; 
  const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  return LucideIcons[pascalCase] || null; 
};

  if (heroLoading || servicesLoading || photoLoading || educationLoading || aboutLoading || contactLoading || projetsLoading || skillsLoading || usernameLoading) return <Loading/>;
  return (

    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark" : ""} ${themeClasses.bg} ${themeClasses.text}`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.headerBg} backdrop-blur-md border-b ${themeClasses.headerBorder} shadow-sm`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
           <div
  className="flex items-center space-x-3 cursor-pointer"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
{/* <div
  className={`hidden sm:flex w-8 h-8 ${isDarkMode ? "bg-white" : "bg-gray-900"} rounded-full items-center justify-center`}
>
  <span
    className={`${isDarkMode ? "text-black" : "text-white"} font-bold text-lg`}
  >
    L
  </span>
</div> */}

<span className="text-base sm:text-xl font-medium">{usernameData.name}</span>
</div>


            <>
              <style jsx>{`
    .custom-nav-spacing > *:not(:last-child) {
      margin-right: 20px;
    }

    @media (min-width: 1990px) {
      .custom-nav-spacing > *:not(:last-child) {
        margin-right: 48px;
      }
    }
  `}</style>

              {/* Desktop Navigation */}
           <nav className="hidden lg:flex items-center custom-nav-spacing">
  {navItems.map((item) => (
    <button
      key={item.id}
      onClick={() => scrollToSection(item.id)}
      className={`text-sm font-medium transition-colors hover:text-[rgb(var(--portfolio-gold))] ${
        activeSection === item.id
          ? "text-[rgb(var(--portfolio-gold))]"
          : themeClasses.textSecondary
      }`}
    >
      {item.label}
    </button>
  ))}




</nav>

            </>


            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language ser */}
           <div className="relative language-menu">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
    className="p-2 hover:bg-[#d6a904] flex items-center gap-2"
  >
  <span className="text-xs font-medium">{currentLang.toUpperCase()}</span>
<ChevronDown
    className={`w-3 h-3 mb-1 transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`}
  />
  </Button>

  {isLangMenuOpen && (
    <div
      className={`absolute top-full right-0 mt-2 ${themeClasses.dropdownBg} ${themeClasses.dropdownBorder} border rounded-lg shadow-lg py-2 min-w-[140px] z-50`}
    >
      {languageOptions.map((option) => (
        <button
          key={option.code}
          onClick={() => changeLanguage(option.code as "fr" | "en")}
          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 
           hover:bg-[#d6a904] transition-colors
            ${currentLang === option.code
              ? "text-[rgb(var(--portfolio-gold))]"
              : themeClasses.text
            }`}
        >
          <span>{option.flag}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )}
</div>


              {/* Theme Toggle */}
            {/* Theme Toggle */}
<Button
  variant="ghost"
  size="sm"
  onClick={toggleTheme}
  className="p-2  hover:bg-[#d6a904]"
>
  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
</Button>

{/* Search Toggle */}
<Button
  variant="ghost"
  size="sm"
  onClick={() => setIsSearchOpen(!isSearchOpen)}
  className="p-2 hover:bg-[#d6a904]"
>
  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
</Button>



              {/* Hire Me */}
              <Button
                className={`${isDarkMode
                  ? "bg-[#EFBF04] hover:bg-[#d6a904] text-black"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
                  } font-medium px-6 py-2 rounded-full`}
                onClick={() => scrollToSection("contact")}
              >
                {t.hireMe}
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center space-x-2"><Button
  variant="ghost"
  size="sm"
  onClick={toggleTheme}
  className="p-2 hover:bg-[#d6a904]"
>
  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
</Button>
        <div className="relative language-menu">
 <Button
  variant="ghost"
  size="sm"
  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
  className="p-2 hover:bg-[#d6a904] transition-colors flex items-center gap-1"
>  <span className="text-xs font-medium">{currentLang.toUpperCase()}</span>
<ChevronDown
    className={`w-3 h-3 mb-1 transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`}
  />
</Button>


  {isLangMenuOpen && (
    <div
      className={`absolute top-full right-0 mt-2 ${themeClasses.dropdownBg} ${themeClasses.dropdownBorder} border rounded-lg shadow-lg py-2 min-w-[120px] z-50`}
    >
      {languageOptions.map((option) => (
        <button
          key={option.code}
          onClick={() => changeLanguage(option.code as "fr" | "en")}
          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 
            hover:bg-[#d6a904] transition-colors
            ${currentLang === option.code
              ? "text-[rgb(var(--portfolio-gold))]"
              : themeClasses.text
            }`}
        >
          <span className="text-xs">{option.flag}</span>
          <span className="text-xs">{option.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )}
</div>




{/* Search Toggle for Mobile */}
<Button
  variant="ghost"
  size="sm"
  onClick={() => setIsSearchOpen(!isSearchOpen)}
  className="p-2 hover:bg-[#d6a904]"
>
  {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
</Button>


              <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`lg:hidden py-6 border-t ${themeClasses.headerBorder}`}>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-[rgb(var(--portfolio-gold))] ${activeSection === item.id
                      ? `text-[rgb(var(--portfolio-gold))] ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      }`
                      : themeClasses.textSecondary
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="px-4 pt-4">

                  <Button
                    className={`w-full ${isDarkMode
                      ? "bg-[#EFBF04] hover:bg-[#d6a904]text-black"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                      } font-medium py-2 rounded-full`}
                    onClick={() => scrollToSection("contact")}
                  >
                    {t.hireMe}
                  </Button>
                </div>
              </nav>
            </div>
          )}

          {/* Search Input */}
          {isSearchOpen && (
            <div
              className={`relative z-50 top-full left-0 right-0 py-4 px-4 sm:px-6 lg:px-8 ${themeClasses.headerBg} border-t ${themeClasses.headerBorder} shadow-md`}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentLang === "fr" ? "Rechercher..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-3 pr-10 rounded-md ${isDarkMode
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-gray-100 text-gray-900 border border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[rgb(var(--portfolio-gold))]`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>


      {/* Hero Section */}
{!isHeroDataEmpty && (
  <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
          {heroData.specialist?.[currentLang] && (
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Star className="w-5 h-5 text-[rgb(var(--portfolio-gold))] fill-current" />
              <span className={`${themeClasses.textSecondary} text-sm font-medium`}>
                {heroData.specialist[currentLang]}
              </span>
            </div>
          )}

          {heroData.heroTitle?.[currentLang] && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
              {heroData.heroTitle[currentLang]}
            </h1>
          )}

          {heroData.heroDescription?.[currentLang] && (
            <p className={`${themeClasses.textSecondary} text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0`}>
              {heroData.heroDescription[currentLang]}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              className="bg-[#EFBF04] hover:bg-[#d6a904] text-gray-900 font-medium px-8 py-3 rounded-full"
              onClick={() => (window.location.href = '/cv')}
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
                  variant="ghost"
                  onClick={handleClick}
                  className={`${isDarkMode
                    ? "text-white border-gray-700 hover:border-[rgb(184,148,31)] hover:text-[rgb(184,148,31)] hover:bg-transparent"
                    : "text-gray-900 border-gray-300 hover:border-[rgb(184,148,31)] hover:text-[rgb(184,148,31)] hover:bg-transparent"
                  } font-medium px-8 py-3 rounded-full border flex items-center cursor-pointer`}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {button.text?.[currentLang]}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Right Content - Profile Image */}
             {photoUrl ? (
        <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
          <div className={`w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full ${
            isDarkMode 
              ? "bg-gradient-to-br from-gray-800 to-gray-900" 
              : "bg-gradient-to-br from-gray-100 to-gray-200"
          } flex items-center justify-center overflow-hidden border-2 border-[rgb(var(--portfolio-gold))]`}>
       
              <Image
                src={photoUrl}
                alt="Profile photo"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
        
          </div>
        </div>    ) : (
             <></>
            )}
      </div>
    </div>
  </section>
)}

   {/*  services */}

{!isServicesEmpty && (
  <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-7xl">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
        {t.servicesTitle}
        <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.isArray(servicesData?.servicesList) && servicesData.servicesList.length > 0 ? (
          servicesData.servicesList.map((service, index) => {
            // Fallback: try currentLang, else fallback to the other language
            const title = service.title?.[currentLang] || service.title?.[currentLang === 'fr' ? 'en' : 'fr'];
            const description = service.description?.[currentLang] || service.description?.[currentLang === 'fr' ? 'en' : 'fr'];

            // Skip card if both titles are missing
            if (!title) return null;

            return (
              <Card
                key={index}
                className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-6 sm:p-8 hover:border-[rgb(var(--portfolio-gold))] transition-colors group shadow-lg`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <span className={`${themeClasses.textMuted} text-sm text-yellow-500`}>0{index + 1}</span>
                    <ArrowUpRight
                      className={`w-5 h-5 ${themeClasses.textMuted} group-hover:text-[rgb(var(--portfolio-gold))] transition-colors`}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">{title}</h3>
                  {description && <p className={`${themeClasses.textSecondary} text-sm sm:text-base leading-relaxed`}>{description}</p>}
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





{/* Experience & Education Timeline Section */}


{!isJourneyDataEmpty && (
  <section
    id="experience"
    className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}
  >
    <div className="container mx-auto max-w-7xl">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
        {t.journeyTitle}
        <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
      </h2>

      <div className="grid md:grid-cols-2 gap-12 md:gap-8">
        {/* Education Column */}
        { educationData?.education?.length >0  && (
          <div>
            <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
              {currentLang === "fr" ? "Formation" : "Education"}
            </h3>
            <div className="space-y-8 relative">
              {educationData?.education?.map((event, index) => (
                <div key={index} className="relative pl-6">
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute -left-2 top-0 w-4 h-4 rounded-full bg-[rgb(var(--portfolio-gold))]`}
                  ></div>
                  <p className={`${themeClasses.textSecondary} font-medium text-sm mb-1`}>
                    {event.year}
                  </p>
                  <h4 className="text-base sm:text-lg font-medium mb-1">
                    {event.title?.[currentLang]}
                  </h4>
                  <p className={`${themeClasses.textSecondary} text-sm mb-1`}>
                    {event.institution?.[currentLang]}
                  </p>
                  {event.description && (
                    <p className={`${themeClasses.textMuted} text-xs mt-2`}>
                      {event.description?.[currentLang]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Column */}
        { educationData.experience?.length >0 && (
          <div>
            <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
              {currentLang === "fr" ? "Expérience" : "Experience"}
            </h3>
            <div className="space-y-8 relative">
              {educationData?.experience?.map((event, index) => (
                <div key={index} className="relative pl-6">
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute -left-2 top-0 w-4 h-4 rounded-full bg-[rgb(var(--portfolio-gold))]`}
                  ></div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`${themeClasses.textSecondary} font-medium text-sm`}>
                      {event.year}
                    </p>
                    {event.duration && (
                      <Badge className="bg-[rgb(var(--portfolio-gold))] text-[rgb(var(--portfolio-gold-foreground))] text-xs">
                        {event.duration}
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-medium mb-1">
                    {event.title?.[currentLang]}
                  </h4>
                  <p className={`${themeClasses.textSecondary} text-sm mb-1`}>
                    {event.institution?.[currentLang]}
                  </p>
                  {event.description && (
                    <p className={`${themeClasses.textMuted} text-xs mt-2`}>
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
<section id="skills" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
  <div className="container mx-auto max-w-7xl">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
      {t.skillsTitle}
      <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
    </h2>

    <div className="space-y-10 sm:space-y-12">
      {skillsData?.skills?.map((category, catIndex) => {
        const CategoryIcon = getIcon(category.skillicon);

        return (
          <div key={catIndex}>
            <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
              {CategoryIcon && (
                <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
              )}
              {category.title?.[currentLang]}
            </h3>

            {category.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {category.items.map((skill, skillIndex) => {
                  const SkillIcon = getIcon(skill.icon);

                  return (
                    <Card
                      key={skillIndex}
                      className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                    >
                      <CardContent className="p-0 flex flex-col items-center">
                        {SkillIcon && (
                          <SkillIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                        )}
                        <h4 className="font-medium text-base sm:text-lg mb-1">
                          {skill.name?.[currentLang]}
                        </h4>
                        {skill.examples?.length > 0 && (
                          <ul className={`${themeClasses.textMuted} text-xs sm:text-sm list-disc pl-4`}>
                            {skill.examples.map((ex, exIndex) => (
                              <li key={exIndex}>{ex?.[currentLang]}</li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className={`${themeClasses.textMuted} text-sm`}>No skills listed.</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>)}


{/* Projects Section */}
{!isProjectsEmpty && (
<section
  id="projects"
  className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}
>
  <div className="container mx-auto max-w-7xl">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
      {t.myProjects}
      <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
    </h2>

    {projetsLoading ? (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    ) : projetsData?.projects?.length > 0 ? (
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {projetsData.projects.map((project: any) => (
          <Card
            key={project._id}
            className={`${themeClasses.cardBg} ${themeClasses.cardBorder} overflow-hidden transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
          >
            {/* Project Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title?.fr || project.title?.en || 'Project'}`}
                  width={800}
                  height={450}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No image available
                  </span>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
                {project.title?.[currentLang] || project.title?.fr || project.title?.en}
              </h3>
              <p
                className={`${themeClasses.textSecondary} text-sm sm:text-base leading-relaxed mb-4 sm:mb-6`}
              >
                {project.description?.[currentLang] || project.description?.fr || project.description?.en}
              </p>
              
              {/* Tech Stack */}
              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {project.techStack.map((tech: string, techIndex: number) => (
                    <Badge
                      key={techIndex}
                      className={`${
                        isDarkMode
                          ? "bg-gray-800 text-white border-gray-700"
                          : "bg-gray-100 text-gray-900 border-gray-300"
                      } border px-3 py-1 text-xs`}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Project Button */}
              {project.button && (
                <div className="flex gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "border-gray-700 text-white hover:bg-gray-800"
                        : "border-gray-300 text-gray-900 hover:bg-gray-100"
                    } flex items-center gap-2 text-sm sm:text-base`}
                    onClick={() => window.open(project.button.link, "_blank")}
                  >
                    <Link className="w-4 h-4" />
                    {project.button.label?.[currentLang] || 
                     project.button.label?.fr || 
                     project.button.label?.en || 
                     'View Project'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className={`${themeClasses.textSecondary} text-lg`}>
          No projects found
        </p>
      </div>
    )}
  </div>
</section>)}



{/* About Section */}
{!isAboutDataEmpty && (
  <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
            {t.aboutTitle}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
          </h2>

          <p className={`${themeClasses.textSecondary} text-base sm:text-lg leading-relaxed mb-6 sm:mb-8`}>
            {aboutData.aboutDescription?.[currentLang]}
          </p>

          {/* Personal Info */}
          {aboutData.personalInfo && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {aboutData.personalInfo?.map((info, index) => {
                const IconComponent = getIcon(info.icon);
                return (
                  <div key={index} className="flex items-start gap-2">
                    {IconComponent && (
                      <IconComponent className={`w-4 h-4 mt-0.5 text-[rgb(var(--portfolio-gold))]`} />
                    )}
                    <div>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm mb-1`}>
                        {info.label?.[currentLang]}
                      </p>
                      <p className="font-medium text-sm sm:text-base">
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
          {/* Languages */}
          {aboutData.languages && (
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center gap-3">
                <LanguagesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {aboutData.languages?.title?.[currentLang]}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {aboutData.languages?.list?.map((lang, index) => {
                  const levelKey = lang.level.toLowerCase();
                  const levelText = aboutData.languages?.levels?.[levelKey]?.[currentLang] || '';
                  
                  // Determine width based on language level
                  const widthMap = {
                    a1: "20%",
                    a2: "30%",
                    b1: "50%",
                    b2: "70%",
                    c1: "85%",
                    c2: "95%",
                    native: "100%"
                  };
                  
                  const width = widthMap[levelKey] || "50%";

                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <span className="font-medium text-sm sm:text-base capitalize">
                          {lang.name?.[currentLang]}
                        </span>
                        <span className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>
                          {levelText}
                        </span>
                      </div>
                      <div className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} rounded-full h-1`}>
                        <div
                          className="bg-[rgb(var(--portfolio-gold))] h-1 rounded-full transition-all duration-1000"
                          style={{ width }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests */}
          {aboutData.interests && (
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center gap-3">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.interests}
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {aboutData.interests?.map((interest, index) => {
                  const IconComponent = getIcon(interest.icon);
                  return (
                    <Badge
                      key={index}
                      className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"} border px-3 sm:px-4 py-1 sm:py-2 text-sm flex items-center gap-2`}
                    >
                      {IconComponent && (
                        <IconComponent className="w-3 h-3" />
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

{/* Contact Section */}


{!isContactDataEmpty && (
<section id="contact" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}>
  <div className="container mx-auto max-w-4xl text-center">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8">
      {contactData.contactTitle?.[currentLang]}
    </h2>
    <p className={`${themeClasses.textSecondary} text-base sm:text-lg mb-10 sm:mb-12 max-w-2xl mx-auto`}>
      {contactData.contactDescription?.[currentLang]}
    </p>
<div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
  {contactData.contactInfo?.map((info, index) => {
    const IconComponent = getIcon(info.icon);
    return (
      <div key={index} className="text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#EFBF04] hover:bg-[#d6a904] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          {IconComponent && (
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          )}
        </div>
        <h3 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">
          {info.label?.[currentLang]}
        </h3>
        <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>
          {info.link ? (
            <a
              href={info.link}
              target={info.link.startsWith("http") ? "_blank" : "_self"}
              rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
              className="hover:underline"
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
      className="inline-flex items-center bg-[#EFBF04] hover:bg-[#d6a904] text-black font-medium px-8 py-3 rounded-full text-base sm:text-lg transition-colors"
    >
      <Send className={ `w-5 h-5 mr-2`} />
      {contactData.contactButton?.startProject?.[currentLang]}
    </a>
  </div>
</section>)}

      {/* Footer */}
      <footer className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t ${themeClasses.headerBorder}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div
                className={`w-8 h-8 ${isDarkMode ? "bg-white" : "bg-gray-900"} rounded-full flex items-center justify-center`}
              >
            
              </div>
              <span className={themeClasses.textSecondary}>© 2025 {usernameData.name}</span>
            </div>
            <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
