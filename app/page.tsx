"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Loading from "@/components/LoadingAdmin";
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
  ar: {
    // Header
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

    // Services
    servicesTitle: "الخدمات",

    // Experience & Education Timeline
    journeyTitle: "المسيرة المهنية والتعليمية",

    // Skills
    skillsTitle: "مهاراتي",

    // Projects
    myProjects: "مشاريعي",

    aboutTitle: "نبذة عني",
    // Footer
    rightsReserved: "جميع الحقوق محفوظة",
  }
}
const baseMockData = {
  username: { fr: "Jean Dupont", en: "John Doe", ar: "جون دو" },
  hero: { /* ... initial local hero data ... */ },
  services: { servicesList: [] },
  education: { education: [], experience: [] },
  skills: { skills: [] },
  projects: { projects: [] },
  about: { aboutDescription: {}, personalInfo: [], languages: {}, interests: [] },
  contact: { contactTitle: {}, contactDescription: {}, contactInfo: [], contactButton: {} },
  photoUrl: ""
};
/* // Mock data for demo purposes
const mockData = {
  username: { fr: "Jean Dupont", en: "John Doe", ar: "جون دو" },
  hero: {
    specialist: { 
      fr: "Développeur Full Stack", 
      en: "Full Stack Developer", 
      ar: "مطور مكدس كامل" 
    },
    heroTitle: { 
      fr: "Créateur d'expériences digitales", 
      en: "Digital Experience Creator", 
      ar: "مصمم التجارب الرقمية" 
    },
    heroDescription: { 
      fr: "Passionné par le développement web moderne et la création d'interfaces utilisateur exceptionnelles.", 
      en: "Passionate about modern web development and creating exceptional user interfaces.", 
      ar: "شغوف بتطوير الويب الحديث وإنشاء واجهات مستخدم استثنائية." 
    },
    heroButtons: [
      { 
        text: { fr: "Voir Portfolio", en: "View Portfolio", ar: "عرض الأعمال" }, 
        icon: "arrowUpRight", 
        link: "#projects" 
      }
    ]
  },
  services: {
    servicesList: [
      {
        title: { fr: "Développement Web", en: "Web Development", ar: "تطوير الويب" },
        description: { 
          fr: "Création d'applications web modernes et responsives", 
          en: "Building modern and responsive web applications", 
          ar: "إنشاء تطبيقات ويب حديثة ومتجاوبة" 
        }
      },
      {
        title: { fr: "Design UI/UX", en: "UI/UX Design", ar: "تصميم واجهة المستخدم" },
        description: { 
          fr: "Design d'interfaces utilisateur intuitives et esthétiques", 
          en: "Designing intuitive and aesthetic user interfaces", 
          ar: "تصميم واجهات مستخدم بديهية وجمالية" 
        }
      },
      {
        title: { fr: "Consultation", en: "Consultation", ar: "الاستشارة" },
        description: { 
          fr: "Conseil en stratégie digitale et architecture technique", 
          en: "Digital strategy and technical architecture consulting", 
          ar: "استشارات في الإستراتيجية الرقمية والهندسة التقنية" 
        }
      }
    ]
  },
  education: {
    education: [
      {
        year: { fr: "2023", en: "2023", ar: "2023" },
        title: { fr: "Master en Informatique", en: "Master in Computer Science", ar: "ماجستير في علوم الحاسوب" },
        institution: { fr: "Université de Paris", en: "University of Paris", ar: "جامعة باريس" },
        description: { fr: "Spécialisé en développement web", en: "Specialized in web development", ar: "متخصص في تطوير الويب" }
      }
    ],
    experience: [
      {
        year: { fr: "2023 - Présent", en: "2023 - Present", ar: "2023 - الحاضر" },
        title: { fr: "Développeur Senior", en: "Senior Developer", ar: "مطور أول" },
        institution: { fr: "TechCorp", en: "TechCorp", ar: "تيك كورب" },
        duration: "1 an",
        description: { fr: "Développement d'applications web", en: "Web application development", ar: "تطوير تطبيقات الويب" }
      }
    ]
  },
  skills: {
    skills: [
      {
        title: { fr: "Technologies Frontend", en: "Frontend Technologies", ar: "تقنيات الواجهة الأمامية" },
        skillicon: "code",
        items: [
          {
            name: { fr: "React", en: "React", ar: "ريأكت" },
            icon: "react",
            examples: [
              { fr: "Next.js", en: "Next.js", ar: "Next.js" },
              { fr: "TypeScript", en: "TypeScript", ar: "TypeScript" }
            ]
          },
          {
            name: { fr: "CSS/Design", en: "CSS/Design", ar: "CSS/التصميم" },
            icon: "palette",
            examples: [
              { fr: "Tailwind", en: "Tailwind", ar: "Tailwind" },
              { fr: "Figma", en: "Figma", ar: "Figma" }
            ]
          }
        ]
      }
    ]
  },
  projects: {
    projects: [
      {
        _id: "1",
        title: { fr: "Portfolio Personnel", en: "Personal Portfolio", ar: "الموقع الشخصي" },
        description: { 
          fr: "Site web personnel avec design moderne et responsive", 
          en: "Personal website with modern and responsive design", 
          ar: "موقع شخصي بتصميم حديث ومتجاوب" 
        },
        techStack: ["React", "Next.js", "Tailwind CSS"],
        button: {
          label: { fr: "Voir le projet", en: "View Project", ar: "عرض المشروع" },
          link: "https://example.com"
        },
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop"
      }
    ]
  },
  about: {
    aboutDescription: { 
      fr: "Développeur passionné avec 5 ans d'expérience dans le développement web moderne.", 
      en: "Passionate developer with 5 years of experience in modern web development.", 
      ar: "مطور شغوف بخبرة 5 سنوات في تطوير الويب الحديث." 
    },
    personalInfo: [
      {
        icon: "mail",
        label: { fr: "Email", en: "Email", ar: "البريد الإلكتروني" },
        value: { fr: "john@example.com", en: "john@example.com", ar: "john@example.com" }
      },
      {
        icon: "phone",
        label: { fr: "Téléphone", en: "Phone", ar: "الهاتف" },
        value: { fr: "+33 1 23 45 67 89", en: "+33 1 23 45 67 89", ar: "+33 1 23 45 67 89" }
      }
    ],
    languages: {
      title: { fr: "Langues", en: "Languages", ar: "اللغات" },
      list: [
        { name: { fr: "Français", en: "French", ar: "الفرنسية" }, level: "native" },
        { name: { fr: "Anglais", en: "English", ar: "الإنجليزية" }, level: "advanced" },
        { name: { fr: "Arabe", en: "Arabic", ar: "العربية" }, level: "intermediate" }
      ],
      levels: {
        native: { fr: "Natif", en: "Native", ar: "أصلي" },
        advanced: { fr: "Avancé", en: "Advanced", ar: "متقدم" },
        intermediate: { fr: "Intermédiaire", en: "Intermediate", ar: "متوسط" }
      }
    },
    interests: [
      { name: { fr: "Photographie", en: "Photography", ar: "التصوير" }, icon: "camera" },
      { name: { fr: "Voyage", en: "Travel", ar: "السفر" }, icon: "plane" },
      { name: { fr: "Musique", en: "Music", ar: "الموسيقى" }, icon: "music" }
    ]
  },
  contact: {
    contactTitle: { fr: "Contactez-moi", en: "Contact Me", ar: "اتصل بي" },
    contactDescription: { 
      fr: "N'hésitez pas à me contacter pour discuter de votre projet.", 
      en: "Feel free to contact me to discuss your project.", 
      ar: "لا تتردد في الاتصال بي لمناقشة مشروعك." 
    },
    contactInfo: [
      {
        icon: "mail",
        label: { fr: "Email", en: "Email", ar: "البريد الإلكتروني" },
        value: "john@example.com",
        link: "mailto:john@example.com"
      },
      {
        icon: "phone",
        label: { fr: "Téléphone", en: "Phone", ar: "الهاتف" },
        value: "+33 1 23 45 67 89",
        link: "tel:+33123456789"
      }
    ],
    contactButton: {
      startProject: { fr: "Démarrer un projet", en: "Start a Project", ar: "بدء مشروع" },
      link: "mailto:john@example.com"
    }
  }
}; */

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
const [mockData, setMockData] = useState(baseMockData);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

 const [loading, setLoading] = useState(true);

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setIsMessageSent(false);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsMessageSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsSendingMessage(false);
    }
  };

   const [currentLang, setCurrentLang] = useState<"fr" | "en" | "ar">(() => {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('language');
        return saved !== null ? saved as "fr" | "en" | "ar" : "fr";
      }
      return "fr";
    });

  const t = translations[currentLang]
    const [isDarkMode, setIsDarkMode] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : false;
      }
      return false;
    });
  
  
  


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
    // Set RTL direction for Arabic
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Modify your theme toggle function to persist the setting
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    sessionStorage.setItem('darkMode', JSON.stringify(newMode));
  };
 
 // Modify your language change function to persist the setting
  const changeLanguage = (lang: "fr" | "en" | "ar") => {
    setCurrentLang(lang);
    setIsLangMenuOpen(false);
    sessionStorage.setItem('language', lang);
  };





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
    const fetchAllData = async () => {
      try {
        const endpoints = {
          photo: "/api/photo",
          hero: "/api/hero",
          username: "/api/username",
          about: "/api/about_me",
          contact: "/api/contact",
          services: "/api/services",
          education: "/api/education",
          skills: "/api/skills",
          projects: "/api/projets"
        };

        // Fetch all endpoints in parallel
        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            try {
              const res = await fetch(url);
              if (!res.ok) throw new Error(`${url} failed`);
              const data = await res.json();
              return { key, data };
            } catch (err) {
              console.error(`Error fetching ${key}:`, err);
              return { key, data: null }; // fallback
            }
          })
        );

        // Build new mockData from base + API
        let updatedData = { ...baseMockData };

        results.forEach(({ key, data }) => {
          if (!data) return; // skip failed fetches
          switch (key) {
            case "photo":
              updatedData = { ...updatedData, photoUrl: data.url };
              break;
            case "hero":
              updatedData = { ...updatedData, hero: data };
              break;
            case "username":
              updatedData = { ...updatedData, username: data };
              break;
            case "about":
              updatedData = { ...updatedData, about: data };
              break;
            case "contact":
              updatedData = { ...updatedData, contact: data };
              break;
            case "services":
              updatedData = { ...updatedData, services: data };
              break;
            case "education":
              updatedData = { ...updatedData, education: data };
              break;
            case "skills":
              updatedData = { ...updatedData, skills: data };
              break;
            case "projects":
              updatedData = { ...updatedData, projects: data };
              break;
            default:
              break;
          }
        });

        setMockData(updatedData);
      } catch (err) {
        console.error("Error fetching all data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);




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

  const navItems = [
 
    { id: "experience", label: t.experience },
    { id: "skills", label: t.skills },
    { id: "projects", label: t.projects },
    { id: "about", label: t.about },
       { id: "services", label: t.services },
    { id: "contact", label: t.contact },
  ];

  const getIcon = (iconName?: string) => {
    if (!iconName) return null; 
    const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    return LucideIcons[pascalCase] || null; 
  };

  // Theme classes
 const themeClasses = {
  background: isDarkMode ? 'bg-black' : 'bg-[#f5f5dc]',
  surface: isDarkMode ? 'bg-black/40' : 'bg-white/40',
  surfaceSolid: isDarkMode ? 'bg-black' : 'bg-white',
  text: isDarkMode ? 'text-white' : 'text-gray-900',
  textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
accent: isDarkMode ? 'text-[#00BFFF]' : 'text-[#0A2647]',
accentBg: isDarkMode ? 'bg-[#3A6EA5]' : 'bg-[#0A2647]',
accentBorder: isDarkMode ? 'border-[#3A6EA5]' : 'border-[#0A2647]',

  glass: 'backdrop-blur-lg border border-white/10',
  glassDark: isDarkMode 
    ? 'bg-black/40 backdrop-blur-lg border border-white/10' 
    : 'bg-white/40 backdrop-blur-lg border border-black/10',
  shadow: 'shadow-xl',
};

  if (loading) return <Loading/>;
  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.background} ${themeClasses.text} ${currentLang === 'ar' ? 'font-arabic' : ''}`} style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 ${themeClasses.glassDark} ${themeClasses.shadow} transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0">

<div className={`${themeClasses.glassDark} ${isDarkMode ? 'text-white' : 'text-[#0A2647]'} border border-white/20 min-w-[30px] w-10 h-10  hover:${themeClasses.accent} rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center text-2xl font-bold sm:hidden`}>
  {/* Show first English letter, uppercased */}
  <span>
    { (mockData.username[currentLang].replace(/[^A-Za-z]/g, '').charAt(0) || 'L').toUpperCase() }
  </span>
</div>

  {/* Full username for larger screens */}
  <div className={`hidden sm:block  ${themeClasses.accent}  `}>
    <span>{mockData.username[currentLang].toUpperCase()}</span>
  </div>
</div>


            {/* Desktop Navigation */}
            <nav className="hidden xl:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    activeSection === item.id
                      ? `${themeClasses.accentBg} text-white ${themeClasses.shadow}`
                      : `${themeClasses.text} hover:${themeClasses.accent}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden xl:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative language-menu">
                <Button
                  variant="outline"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 hover:scale-105`}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isLangMenuOpen && (
                  <div className={`absolute top-full right-0 mt-2 ${themeClasses.glassDark} rounded-2xl ${themeClasses.shadow} border border-white/10 min-w-[150px] z-50 transition-all duration-300 animate-in slide-in-from-top-2`}>
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                        className={`w-full px-4 py-3 text-left hover:${themeClasses.accentBg} hover:text-white rounded-2xl transition-all duration-300 flex items-center space-x-3`}
                      >
                        <span className="text-lg">{option.flag}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Search Toggle */}
              <Button
                variant="outline"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              {/* Hire Me Button */}
              <Button
                onClick={() => scrollToSection("contact")}
                className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl px-6 py-2 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}
              >
                {t.hireMe}
              </Button>
            </div>
{/* Mobile & Tablet Controls */}
<div className="xl:hidden flex items-center space-x-2 sm:space-x-2 md:space-x-3">
  {/* Theme Toggle */}
  <Button
    variant="outline"
    onClick={toggleTheme}
    className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
  >
    {isDarkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
  </Button>

  {/* Language Menu */}
  <div className="relative language-menu">
    <Button
      variant="outline"
      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
      className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
    >
      <span className="text-xs sm:text-sm">{currentLang.toUpperCase()}</span>
      <ChevronDown
        className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${isLangMenuOpen ? 'rotate-180' : ''} transition-transform duration-300`}
      />
    </Button>

    {isLangMenuOpen && (
      <div
        className={`absolute top-full right-0 mt-1 sm:mt-2 ${themeClasses.glassDark} rounded-xl sm:rounded-2xl ${themeClasses.shadow} border border-white/10 min-w-[100px] sm:min-w-[120px] z-50`}
      >
        {languageOptions.map((option) => (
          <button
            key={option.code}
            onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
            className={`w-full px-2 py-1 sm:px-3 sm:py-2 text-left hover:${themeClasses.accentBg} hover:text-white rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm`}
          >
            <span>{option.flag}</span>
            <span>{option.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Search Button */}
  <Button
    variant="outline"
    onClick={() => setIsSearchOpen(!isSearchOpen)}
    className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
  >
    {isSearchOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Search className="h-4 w-4 sm:h-5 sm:w-5" />}
  </Button>

  {/* Menu Toggle */}
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className={`${themeClasses.text} hover:${themeClasses.accent} transition-colors duration-300`}
  >
    {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
  </button>
</div>


          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`xl:hidden ${themeClasses.glassDark} rounded-2xl mb-4 p-4 ${themeClasses.shadow} transition-all duration-300 animate-in slide-in-from-top-2`}>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                      activeSection === item.id
                        ? `${themeClasses.accentBg} text-white`
                        : `${themeClasses.text} hover:${themeClasses.accentBg} hover:text-white`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-2">
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className={`w-full ${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl`}
                  >
                    {t.hireMe}
                  </Button>
                </div>
              </nav>
            </div>
          )}

          {/* Search Bar */}
          {isSearchOpen && (
            <div className={`${themeClasses.glassDark} rounded-2xl mb-4 p-4 ${themeClasses.shadow} transition-all duration-300 animate-in slide-in-from-top-2`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentLang === "fr" ? "Rechercher..." : currentLang === "en" ? "Search..." : "البحث..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 ${themeClasses.glassDark} border border-white/20 rounded-2xl ${themeClasses.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A2647] transition-all duration-300`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors duration-300`}
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
      <section id="home" className={`pt-32 pb-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-1000">
              {mockData.hero.specialist?.[currentLang] && (
                <div className={`inline-flex items-center space-x-2 ${themeClasses.glassDark} px-4 py-2 rounded-2xl ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
                  <Star className={`h-5 w-5 ${themeClasses.accent}`} />
                  <span className={`${themeClasses.textMuted} font-medium`}>
                    {mockData.hero.specialist[currentLang]}
                  </span>
                </div>
              )}

              {mockData.hero.heroTitle?.[currentLang] && (
                <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${themeClasses.text} transition-all duration-500`}>
                  {mockData.hero.heroTitle[currentLang]}
                </h1>
              )}

              {mockData.hero.heroDescription?.[currentLang] && (
                <p className={`text-lg md:text-xl ${themeClasses.textMuted} max-w-2xl leading-relaxed font-sans`}>
                  {mockData.hero.heroDescription[currentLang]}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => scrollToSection("experience")}
                  className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl px-8 py-3 ${themeClasses.shadow} transition-all duration-300 hover:scale-105 text-lg`}
                >
                  {t.viewJourney}
                </Button>

                {mockData.hero.heroButtons?.map((button, index) => {
                  const Icon = getIcon(button.icon);
                  const handleClick = () => {
                    if (button.link) scrollToSection(button.link.replace('#', ''));
                  };
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={handleClick}
                      className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} hover:${themeClasses.accentBg} hover:text-white rounded-2xl px-8 py-3 transition-all duration-300 hover:scale-105 text-lg`}
                    >
                      {Icon && <Icon className="mr-2 h-5 w-5" />}
                      {button.text?.[currentLang]}
                    </Button>
                  );
                })}
              </div>
            </div>

        <div className="flex justify-center lg:justify-end animate-in slide-in-from-right duration-1000">
  <div className={`relative ${themeClasses.glassDark} rounded-2xl p-4 sm:p-6 md:p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
    <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-2xl overflow-hidden">
      <Image
        src={mockData.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
        alt="Profile photo"
        width={400}
        height={400}
        priority
        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-[#0A2647]/20 to-transparent`}></div>
    </div>
  </div>
</div>

          </div>
        </div>
      </section>

    {/* Skills Section */}
      <section id="skills" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.skillsTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="space-y-12">
            {mockData.skills.skills.map((category, catIndex) => {
              const CategoryIcon = getIcon(category.skillicon);

              return (
                <div key={catIndex} className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
                  <h3 className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}>
                    {CategoryIcon && (
                      <CategoryIcon className={`mr-3 h-6 w-6 ${themeClasses.accent}`} />
                    )}
                    {category.title?.[currentLang]}
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((skill, skillIndex) => {
                      const SkillIcon = getIcon(skill.icon);

                      return (
                        <Card
                          key={skillIndex}
                          className={`${themeClasses.glassDark} border-white/10 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                        >
                          <CardContent className="p-6">
                            {SkillIcon && (
                              <SkillIcon className={`h-8 w-8 ${themeClasses.accent} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                            )}
                            <h4 className={`text-lg font-semibold mb-3 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}>
                              {skill.name?.[currentLang]}
                            </h4>
                            {skill.examples?.length > 0 && (
                              <ul className={`space-y-1 ${themeClasses.textMuted} text-sm`}>
                                {skill.examples.map((ex, exIndex) => (
                                  <li key={exIndex} className="flex items-center">
                                    <span className={`w-2 h-2 ${themeClasses.accentBg} rounded-full mr-2`}></span>
                                    {ex?.[currentLang]}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.journeyTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
              <h3 className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}>
                <GraduationCap className={`mr-3 h-6 w-6 ${themeClasses.accent}`} />
                {currentLang === "fr" ? "Formation" : currentLang === "en" ? "Education" : "التعليم"}
              </h3>
              <div className="space-y-8">
                {mockData.education.education.map((event, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-[#0A2647]/30">
                    <div className={`absolute -left-2 top-0 w-4 h-4 ${themeClasses.accentBg} rounded-full`}></div>
                    <div className={`absolute -left-1 top-1 w-2 h-2 bg-white rounded-full`}></div>
                    <p className={`text-sm ${themeClasses.accent} font-semibold mb-2`}>
                      {event.year?.[currentLang]}
                    </p>
                    <h4 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>
                      {event.title?.[currentLang]}
                    </h4>
                    <p className={`${themeClasses.textMuted} mb-2`}>
                      {event.institution?.[currentLang]}
                    </p>
                    {event.description && (
                      <p className={`${themeClasses.textMuted} text-sm`}>
                        {event.description?.[currentLang]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
              <h3 className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}>
                <Briefcase className={`mr-3 h-6 w-6 ${themeClasses.accent}`} />
                {currentLang === "fr" ? "Expérience" : currentLang === "en" ? "Experience" : "الخبرة"}
              </h3>
              <div className="space-y-8">
                {mockData.education.experience.map((event, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-[#0A2647]/30">
                    <div className={`absolute -left-2 top-0 w-4 h-4 ${themeClasses.accentBg} rounded-full`}></div>
                    <div className={`absolute -left-1 top-1 w-2 h-2 bg-white rounded-full`}></div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className={`text-sm ${themeClasses.accent} font-semibold`}>
                        {event.year?.[currentLang]}
                      </p>
                      {event.duration && (
                        <Badge className={`${themeClasses.accentBg} text-white text-xs`}>
                          {event.duration}
                        </Badge>
                      )}
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>
                      {event.title?.[currentLang]}
                    </h4>
                    <p className={`${themeClasses.textMuted} mb-2`}>
                      {event.institution?.[currentLang]}
                    </p>
                    {event.description && (
                      <p className={`${themeClasses.textMuted} text-sm`}>
                        {event.description?.[currentLang]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.myProjects}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {mockData.projects.projects.map((project: any) => (
              <Card
                key={project._id}
                className={`${themeClasses.glassDark} border-white/10 rounded-2xl overflow-hidden ${themeClasses.shadow} transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title?.[currentLang] || 'Project'}
                    width={800}
                    height={450}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>

                <CardContent className="p-8">
                  <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}>
                    {project.title?.[currentLang]}
                  </h3>
                  <p className={`${themeClasses.textMuted} mb-6 leading-relaxed`}>
                    {project.description?.[currentLang]}
                  </p>

                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech: string, techIndex: number) => (
                        <Badge
                          key={techIndex}
                          className={`${themeClasses.glassDark} ${themeClasses.textMuted} border border-white/20 hover:${themeClasses.accentBg} hover:text-white transition-all duration-300`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {project.button && (
                    <div>
                      <Button
                        onClick={() => window.open(project.button.link, "_blank")}
                        className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl transition-all duration-300 hover:scale-105`}
                      >
                        <Link className="mr-2 h-4 w-4" />
                        {project.button.label?.[currentLang] || 'View Project'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
    {t.aboutTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
             <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${themeClasses.text}`}>
                {mockData.username?.[currentLang]}
          
              </h2> 

              <p className={`${themeClasses.textMuted} text-lg leading-relaxed mb-8`}>
                {mockData.about.aboutDescription?.[currentLang]}
              </p>

              <div className="space-y-6">
                {mockData.about.personalInfo?.map((info, index) => {
                  const IconComponent = getIcon(info.icon);
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      {IconComponent && (
                        <div className={`${themeClasses.accentBg} p-3 rounded-2xl`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className={`font-medium ${themeClasses.text}`}>
                          {info.label?.[currentLang]}
                        </p>
                        <p className={`${themeClasses.textMuted}`}>
                          {info.value?.[currentLang]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-8">
              {/* Languages */}
              <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
                <h3 className={`text-2xl font-semibold mb-6 ${themeClasses.text} flex items-center`}>
                  <LanguagesIcon className={`mr-3 h-6 w-6 ${themeClasses.accent}`} />
                  {mockData.about.languages?.title?.[currentLang]}
                </h3>
                <div className="space-y-4">
                  {mockData.about.languages?.list?.map((lang, index) => {
                    const levelKey = lang.level.toLowerCase();
                    const levelText = mockData.about.languages?.levels?.[levelKey]?.[currentLang] || '';
                    const levelPercentage = levelKey === 'native' ? 100 : levelKey === 'advanced' ? 85 : 70;

                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${themeClasses.text}`}>
                            {lang.name?.[currentLang]}
                          </span>
                          <span className={`text-sm ${themeClasses.textMuted}`}>
                            {levelText}
                          </span>
                        </div>
                        <div className={`h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${themeClasses.accentBg} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${levelPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
                <h3 className={`text-2xl font-semibold mb-6 ${themeClasses.text} flex items-center`}>
                  <Heart className={`mr-3 h-6 w-6 ${themeClasses.accent}`} />
                  {t.interests}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {mockData.about.interests?.map((interest, index) => {
                    const IconComponent = getIcon(interest.icon);
                    return (
                      <Badge
                        key={index}
                        className={`${themeClasses.glassDark} ${themeClasses.text} border border-white/20 px-4 py-2 rounded-2xl hover:${themeClasses.accentBg} hover:text-white transition-all duration-300 hover:scale-105`}
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
            </div>
          </div>
        </div>
      </section>
    {/* Services Section */}
      <section id="services" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.servicesTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.services.servicesList.map((service, index) => {
              const title = service.title?.[currentLang];
              const description = service.description?.[currentLang];

              return (
                <Card
                  key={index}
                  className={`${themeClasses.glassDark} border-white/10 rounded-2xl ${themeClasses.shadow} transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-6xl font-bold ${themeClasses.accent} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}>
                        0{index + 1}
                      </span>
                      <ArrowUpRight className={`h-6 w-6 ${themeClasses.accent} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}>
                      {title}
                    </h3>
                    {description && (
                      <p className={`${themeClasses.textMuted} leading-relaxed`}>
                        {description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
   {/* Contact Section */}
<section id="contact" className={`py-20 ${themeClasses.background}`}>
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${themeClasses.text}`}>
      {mockData.contact.contactTitle?.[currentLang]}
    </h2>
    <p className={`text-lg ${themeClasses.textMuted} mb-12 max-w-2xl mx-auto`}>
      {mockData.contact.contactDescription?.[currentLang]}
    </p>

    {/* Contact Info Cards */}
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {mockData.contact.contactInfo?.map((info, index) => {
        const IconComponent = getIcon(info.icon);
        return (
          <div
            key={index}
            className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105 group`}
          >
            <div
              className={`${themeClasses.accentBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
            </div>
            <h3
              className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}
            >
              {info.label?.[currentLang]}
            </h3>
            <p className={`${themeClasses.textMuted}`}>
              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : "_self"}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
                  className={`hover:${themeClasses.accent} transition-colors duration-300`}
                >
                  {typeof info.value === "object"
                    ? info.value[currentLang]
                    : info.value}
                </a>
              ) : typeof info.value === "object" ? (
                info.value[currentLang]
              ) : (
                info.value
              )}
            </p>
          </div>
        );
      })}
    </div>   {/* Button */}
    <a
      href={mockData.contact.contactButton?.link || "#contact-form"}
      className={`inline-flex items-center ${themeClasses.accentBg} hover:opacity-90 text-white px-8 py-4 rounded-2xl ${themeClasses.shadow} transition-all duration-300 hover:scale-105 text-lg font-semibold`}
    >
      <Send className="mr-3 h-5 w-5" />
      {mockData.contact.contactButton?.startProject?.[currentLang]}
    </a>

 <br /><br /><br />
  {/* Contact Form */}
  
  <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 hover:scale-105`}>
  <h3 className={`text-2xl font-bold mb-8 text-center ${themeClasses.text}`}> 
    {currentLang === "en"
      ? "Contact Me"
      : currentLang === "fr"
      ? "Contactez-moi"
      : "اتصل بي"}
  </h3>
<form
  id="contact-form"
  className="space-y-6 text-left relative"
  onSubmit={handleSubmit}
>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Your name"
        : currentLang === "fr"
        ? "Votre nom"
        : "اسمك"
    }
    className={`w-full px-4 py-3 rounded-xl ${themeClasses.surface} ${themeClasses.text} border border-gray-500/20 focus:outline-none focus:ring-2 focus:${themeClasses.accentBorder}`}
    required
  />

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Your email"
        : currentLang === "fr"
        ? "Votre email"
        : "بريدك الإلكتروني"
    }
    className={`w-full px-4 py-3 rounded-xl ${themeClasses.surface} ${themeClasses.text} border border-gray-500/20 focus:outline-none focus:ring-2 focus:${themeClasses.accentBorder}`}
    required
  />

  <textarea
    name="message"
    rows={5}
    value={formData.message}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Write your message..."
        : currentLang === "fr"
        ? "Écrivez votre message..."
        : "اكتب رسالتك..."
    }
    className={`w-full px-4 py-3 rounded-xl ${themeClasses.surface} ${themeClasses.text} border border-gray-500/20 focus:outline-none focus:ring-2 focus:${themeClasses.accentBorder}`}
    required
  ></textarea>

  <button
    type="submit"
    disabled={isSendingMessage}
    className={`w-full flex justify-center items-center gap-2 ${themeClasses.accentBg} hover:opacity-90 text-white px-8 py-4 rounded-2xl ${themeClasses.shadow} transition-all duration-300 text-lg font-semibold`}
  >
    {isSendingMessage && (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
        ></path>
      </svg>
    )}
    {isSendingMessage
      ? currentLang === "en"
        ? "Sending..."
        : currentLang === "fr"
        ? "Envoi..."
        : "جارٍ الإرسال..."
      : currentLang === "en"
      ? "Send Message"
      : currentLang === "fr"
      ? "Envoyer le message"
      : "إرسال الرسالة"}
  </button>

  {isMessageSent && (
    <p className="text-green-600 font-semibold mt-2 bg-green-100 p-2 rounded border border-green-300">
      {currentLang === "en"
        ? "Message sent successfully!"
        : currentLang === "fr"
        ? "Message envoyé avec succès !"
        : "تم إرسال الرسالة بنجاح!"}
    </p>
  )}
</form>

</div>

 
  </div>
</section>

      {/* Footer */}
      <footer className={`${themeClasses.glassDark} border-t border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className={`text-2xl font-bold ${themeClasses.accent}`}>
                © 2025 {mockData.username?.[currentLang]}
              </span>
            </div>
            <p className={`${themeClasses.textMuted}`}>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}