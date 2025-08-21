 Dark Mode: A black base with #0A2647 accents. Light Mode: A beige base (#f5f5dc) with white surfaces and #0A2647 accents. Both modes should have smooth transitions when switching between them. Implement a backdrop blur effect on cards and sections for a "glass" effect. Use rounded corners (2xl) for all cards and buttons. Add a subtle shadow for depth in both modes. Accents: Use #0A2647 for primary accents, and apply this accent color to borders, text, and background highlights.
 
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

    // Fetch skills data
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
  }, [])   useEffect(() => {
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

    // Fetch skills data
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
    <div>
      <header>
        <div>
          <div>
            <div>
              <span>{usernameData?.[currentLang]}</span>
            </div>

            <>


              <nav>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </>

            <div>
              <div>
                <Button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown
                  />
                </Button>

                {isLangMenuOpen && (
                  <div
                  >
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                      >
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun /> : <Moon />}
              </Button>

              <Button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X /> : <Search />}
              </Button>

              <Button
                onClick={() => scrollToSection("contact")}
              >
                {t.hireMe}
              </Button>
            </div>

            <div>
              <Button
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun /> : <Moon />}
              </Button>

              <div>
                <Button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown
                  />
                </Button>

                {isLangMenuOpen && (
                  <div
                  >
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
                      >
                        <span>{option.flag}</span>
                        <span>{option.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X /> : <Search />}
              </Button>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div>
              <nav>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
                <div>
                  <Button
                    onClick={() => scrollToSection("contact")}
                  >
                    {t.hireMe}
                  </Button>
                </div>
              </nav>
            </div>
          )}

          {isSearchOpen && (
            <div
            >
              <div>
                <input
                  type="text"
                  placeholder={currentLang === "fr" ? "Rechercher..." : currentLang === "en" ? "Search..." : "البحث..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
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

      {!isHeroDataEmpty && (
        <section id="home">
          <div>
            <div>
              <div>
                {heroData.specialist?.[currentLang] && (
                  <div>
                    <Star />
                    <span>
                      {heroData.specialist[currentLang]}
                    </span>
                  </div>
                )}

                {heroData.heroTitle?.[currentLang] && (
                  <h1>
                    {heroData.heroTitle[currentLang]}
                  </h1>
                )}

                {heroData.heroDescription?.[currentLang] && (
                  <p>
                    {heroData.heroDescription[currentLang]}
                  </p>
                )}

                <div>
                  <Button
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
                        onClick={handleClick}
                      >
                        {Icon && <Icon />}
                        {button.text?.[currentLang]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {photoUrl ? (
                <div>
                  <div>
                    <Image
                      src={photoUrl}
                      alt="Profile photo"
                      width={400}
                      height={400}
                      priority
                    />
                  </div>
                </div>) : (
                <div>
                  <div>
                    <Image
                      src={"https://woxgxzelncuqwury.public.blob.vercel-storage.com/profile_1755462555430_HanSooyoung.png"}
                      alt="Profile photo"
                      width={400}
                      height={400}
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!isServicesEmpty && (
        <section id="services">
          <div>
            <h2>
              {t.servicesTitle}
              <span></span>
            </h2>

            <div>
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
                    >
                      <CardContent>
                        <div>
                          <span>0{index + 1}</span>
                          <ArrowUpRight
                          />
                        </div>
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
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

      {!isJourneyDataEmpty && (
        <section
          id="experience"
        >
          <div>
            <h2>
              {t.journeyTitle}
              <span></span>
            </h2>

            <div>
              {educationData?.education?.length > 0 && (
                <div>
                  <h3>
                    <GraduationCap />
                    {currentLang === "fr" ? "Formation" : currentLang === "en" ? "Education" : "التعليم"}
                  </h3>
                  <div>
                    {educationData?.education && [...educationData.education].reverse().map((event, index) => (
                      <div key={index}>
                        <div
                        ></div>
                        <div
                        ></div>
                        <p>
                          {event.year?.[currentLang]}
                        </p>
                        <h4>
                          {event.title?.[currentLang]}
                        </h4>
                        <p>
                          {event.institution?.[currentLang]}
                        </p>
                        {event.description && (
                          <p>
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
                  <h3>
                    <Briefcase />
                    {currentLang === "fr" ? "Expérience" : currentLang === "en" ? "Experience" : "الخبرة"}
                  </h3>
                  <div>
                    {educationData?.experience && [...educationData.experience].reverse().map((event, index) => (
                      <div key={index}>
                        <div
                        ></div>
                        <div
                        ></div>
                        <div>
                          <p>
                            {event.year?.[currentLang]}
                          </p>
                          {event.duration && (
                            <Badge>
                              {event.duration}
                            </Badge>
                          )}
                        </div>
                        <h4>
                          {event.title?.[currentLang]}
                        </h4>
                        <p>
                          {event.institution?.[currentLang]}
                        </p>
                        {event.description && (
                          <p>
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

      {!isSkillsDataEmpty && (
        <section id="skills">
          <div>
            <h2>
              {t.skillsTitle}
              <span></span>
            </h2>

            <div>
              {skillsData?.skills?.map((category, catIndex) => {
                const CategoryIcon = getIcon(category.skillicon);

                return (
                  <div key={catIndex}>
                    <h3>
                      {CategoryIcon && (
                        <CategoryIcon />
                      )}
                      {category.title?.[currentLang]}
                    </h3>

                    {category.items.length > 0 ? (
                      <div>
                        {category.items.map((skill, skillIndex) => {
                          const SkillIcon = getIcon(skill.icon);

                          return (
                            <Card
                              key={skillIndex}
                            >
                              <CardContent>
                                {SkillIcon && (
                                  <SkillIcon />
                                )}
                                <h4>
                                  {skill.name?.[currentLang]}
                                </h4>
                                {skill.examples?.length > 0 && (
                                  <ul>
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
                      <p>No skills listed.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>)}

      {!isProjectsEmpty && (
        <section
          id="projects"
        >
          <div>
            <h2>
              {t.myProjects}
              <span></span>
            </h2>

            {projetsLoading ? (
              <div>
                <Loading />
              </div>
            ) : projetsData?.projects?.length > 0 ? (
              <div>
                {projetsData.projects.map((project: any) => (
                  <Card
                    key={project._id}
                  >
                    <div>
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={`${project.title?.[currentLang] || project.title?.fr || project.title?.en || 'Project'}`}
                          width={800}
                          height={450}
                        />
                      ) : (
                        <div>
                          <span>
                            {currentLang === 'fr' ? 'Pas d\'image disponible' :
                              currentLang === 'en' ? 'No image available' :
                                'لا توجد صورة متاحة'}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent>
                      <h3>
                        {project.title?.[currentLang] || project.title?.fr || project.title?.en || project.title?.ar}
                      </h3>
                      <p
                      >
                        {project.description?.[currentLang] || project.description?.fr || project.description?.en || project.description?.ar}
                      </p>

                      {project.techStack?.length > 0 && (
                        <div>
                          {project.techStack.map((tech: string, techIndex: number) => (
                            <Badge
                              key={techIndex}
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
                          >
                            <Link />
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
              <div>
                <p>
                  {currentLang === 'fr' ? 'Aucun projet trouvé' :
                    currentLang === 'en' ? 'No projects found' :
                      'لم يتم العثور على مشاريع'}
                </p>
              </div>
            )}
          </div>
        </section>)}

      {!isAboutDataEmpty && (
        <section id="about">
          <div>
            <div>
              <div>
                <h2>
                  {t.aboutTitle}
                  <span></span>
                </h2>

                <p>
                  {aboutData.aboutDescription?.[currentLang]}
                </p>

                {aboutData.personalInfo && (
                  <div>
                    {aboutData.personalInfo?.map((info, index) => {
                      const IconComponent = getIcon(info.icon);
                      return (
                        <div key={index}>
                          {IconComponent && (
                            <IconComponent />
                          )}
                          <div>
                            <p>
                              {info.label?.[currentLang]}
                            </p>
                            <p>
                              {info.value?.[currentLang]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                {aboutData.languages && (
                  <div>
                    <h3>
                      <LanguagesIcon />
                      {aboutData.languages?.title?.[currentLang]}
                    </h3>
                    <div>
                      {aboutData.languages?.list?.map((lang, index) => {
                        const levelKey = lang.level.toLowerCase();
                        const levelText = aboutData.languages?.levels?.[levelKey]?.[currentLang] || '';

                        return (
                          <div key={index}>
                            <div>
                              <span>
                                {lang.name?.[currentLang]}
                              </span>
                              <span>
                                {levelText}
                              </span>
                            </div>
                            <div>
                              <div
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
                    <h3>
                      <Heart />
                      {t.interests}
                    </h3>
                    <div>
                      {aboutData.interests?.map((interest, index) => {
                        const IconComponent = getIcon(interest.icon);
                        return (
                          <Badge
                            key={index}
                          >
                            {IconComponent && (
                              <IconComponent />
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

      {!isContactDataEmpty && (
        <section id="contact">
          <div>
            <h2>
              {contactData.contactTitle?.[currentLang]}
            </h2>
            <p>
              {contactData.contactDescription?.[currentLang]}
            </p>
            <div>
              {contactData.contactInfo?.map((info, index) => {
                const IconComponent = getIcon(info.icon);
                return (
                  <div key={index}>
                    <div>
                      {IconComponent && (
                        <IconComponent />
                      )}
                    </div>
                    <h3>
                      {info.label?.[currentLang]}
                    </h3>
                    <p>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith("http") ? "_blank" : "_self"}
                          rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
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
            >
              <Send />
              {contactData.contactButton?.startProject?.[currentLang]}
            </a>
          </div>
        </section>)}

      <footer>
        <div>
          <div>
            <div>
              <span>© 2025 {usernameData?.[currentLang]}</span>
            </div>
            <p>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}