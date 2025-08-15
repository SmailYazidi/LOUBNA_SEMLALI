{
  "specialist": {
    "fr": "Développeur Web Full Stack",
    "en": "Full Stack Web Developer"
  },
  "heroTitle": {
    "fr": "Transformez vos idées en applications web puissantes",
    "en": "Turn Your Ideas into Powerful Web Applications"
  },
  "heroDescription": {
    "fr": "Je suis une personne dynamique et ambitieuse, spécialisée dans le développement web et les applications web. Diplômé en développement web full-stack et formé au Centre Azrou pour le Développement Communautaire, je souhaite mettre mes compétences à profit et intégrer une équipe motivée.",
    "en": "I am a dynamic and ambitious person, specialized in web and web application development. Graduated in full-stack web development and trained at the Azrou Center for Community Development, I aim to put my skills to use and join a motivated team."
  },
  "heroButtons": [
    {
      "text": {
        "fr": "Voir mes projets",
        "en": "View My Projects"
      },
      "link": "/projects",
      "icon": "folder"
    },
    {
      "text": {
        "fr": "Me contacter",
        "en": "Contact Me"
      },
      "link": "/contact",
      "icon": "mail"
    }
  ]
}
{
  servicesList: [
    {
      title: {
        fr: "Développement Web",
        en: "Web Development"
      },
      description: {
        fr: "Conception et développement d'applications web robustes et évolutives, du front-end au back-end.",
        en: "Design and development of robust and scalable web applications, from front-end to back-end."
      }
    },
    {
      title: {
        fr: "Applications Mobiles",
        en: "Mobile Applications"
      },
      description: {
        fr: "Création d'applications mobiles performantes et intuitives pour iOS et Android, avec des expériences utilisateur fluides.",
        en: "Creation of high-performance and intuitive mobile applications for iOS and Android, with smooth user experiences."
      }
    },
    {
      title: {
        fr: "Gestion de Projets Web",
        en: "Web Project Management"
      },
      description: {
        fr: "Coordination et suivi des projets web pour assurer leur réussite, respect des délais et satisfaction client.",
        en: "Coordination and monitoring of web projects to ensure success, timely delivery, and client satisfaction."
      }
    }
  ]
}
db.education.insertOne({
  journeyTitle: {
    fr: "Parcours Professionnel & Éducatif",
    en: "Professional & Educational Journey"
  },
  education: [
    {
      year: "2024 - 2025",
      title: {
        fr: "Développement Web",
        en: "Web Development"
      },
      institution: {
        fr: "Centre Azrou pour le développement communautaire",
        en: "Azrou Center for Community Development"
      },
      description: {
        fr: "Formation en Développement Web.",
        en: "Training in Web Development."
      }
    },
    {
      year: "2022 - 2024",
      title: {
        fr: "Diplôme en Développement Digital Web Full Stack",
        en: "Full Stack Digital Web Development Diploma"
      },
      institution: {
        fr: "Institut Spécialisé de Technologie Appliquée Ifrane (OFPPT)",
        en: "Specialized Institute of Applied Technology Ifrane (OFPPT)"
      },
      description: {
        fr: "Formation complète en développement web full stack.",
        en: "Comprehensive training in full stack web development."
      }
    },
    {
      year: "2021",
      title: {
        fr: "Baccalauréat en Sciences de la Vie et de la Terre",
        en: "Baccalaureate in Life and Earth Sciences"
      },
      institution: {
        fr: "Lycée Qualifiant Sidi El Makhfi",
        en: "Qualifying High School Sidi El Makhfi"
      },
      description: {
        fr: "Diplôme de fin d'études secondaires.",
        en: "High school diploma."
      }
    }
  ],
  experience: [
    {
      year: "10 juin 2025 au 10 juillet 2025",
      title: {
        fr: "Stage en Développement Web",
        en: "Web Development Internship"
      },
      institution: {
        fr: "Al Akhawayn University",
        en: "Al Akhawayn University"
      },
      description: {
        fr: "Stage pratique en développement web.",
        en: "Practical internship in web development."
      }
    },
    {
      year: "11 mars 2024 au 11 avril 2024",
      title: {
        fr: "Stage en Développement Web",
        en: "Web Development Internship"
      },
      institution: {
        fr: "Commune de Sidi Mokhfi",
        en: "Sidi Mokhfi Municipality"
      },
      description: {
        fr: "Application des compétences en développement web et contribution à une équipe dynamique.",
        en: "Application of web development skills and contribution to a dynamic team."
      }
    }
  ]
});



db.skills.insertOne({
  "skillsTitle": {
    "fr": "Mes Compétences",
    "en": "My Skills"
  },
  "skills": [
    {
      "skillicon": "Code",
      "title": {
        "fr": "Langages de Programmation",
        "en": "Programming Languages"
      },
      "items": [
        { "name": { "fr": "Langage Backend", "en": "Backend Language" }, "examples": ["PHP", "Python"], "icon": "Server", "comment": "inserone" },
        { "name": { "fr": "Langage de Scripting", "en": "Scripting Language" }, "examples": ["JavaScript", "Node.js"], "icon": "FileText", "comment": "inserone" },
        { "name": { "fr": "Environnement d'exécution Backend", "en": "Backend Runtime" }, "examples": [], "icon": "Cpu", "comment": "inserone" }
      ]
    },
    {
      "skillicon": "Layers",
      "title": {
        "fr": "Frameworks et Bibliothèques",
        "en": "Frameworks & Libraries"
      },
      "items": [
        { "name": { "fr": "Framework PHP", "en": "PHP Framework" }, "examples": ["Laravel"], "icon": "Layers", "comment": "inserone" },
        { "name": { "fr": "Framework Frontend", "en": "Frontend Framework" }, "examples": ["React.js"], "icon": "Monitor", "comment": "inserone" },
        { "name": { "fr": "Framework CSS", "en": "CSS Framework" }, "examples": ["Bootstrap"], "icon": "Paintbrush", "comment": "inserone" }
      ]
    },
    {
      "skillicon": "Database",
      "title": {
        "fr": "Bases de Données",
        "en": "Databases"
      },
      "items": [
        { "name": { "fr": "Base de Données Relationnelle", "en": "Relational Database" }, "examples": ["MySQL"], "icon": "Database", "comment": "inserone" },
        { "name": { "fr": "Base de Données NoSQL", "en": "NoSQL Database" }, "examples": ["MongoDB"], "icon": "Database", "comment": "inserone" }
      ]
    },
    {
      "skillicon": "Settings",
      "title": {
        "fr": "Autres Compétences Techniques",
        "en": "Other Technical Skills"
      },
      "items": [
        { "name": { "fr": "Analyse Technique", "en": "Technical Analysis" }, "examples": [], "icon": "Activity", "comment": "inserone" },
        { "name": { "fr": "Compréhension des systèmes et des besoins", "en": "Understanding Systems and Needs" }, "examples": [], "icon": "Eye", "comment": "inserone" },
        { "name": { "fr": "Développement d'Applications Web", "en": "Web Application Development" }, "examples": ["Building functional web apps"], "icon": "Code", "comment": "inserone" },
        { "name": { "fr": "Gestion de Projet Web", "en": "Web Project Management" }, "examples": ["Organizing and leading web projects"], "icon": "Clipboard", "comment": "inserone" },
        { "name": { "fr": "Contrôle de Version", "en": "Version Control: Git" }, "examples": ["Managing code versions"], "icon": "GitBranch", "comment": "inserone" }
      ]
    },
    {
      "skillicon": "UserCheck",
      "title": {
        "fr": "Compétences Non Techniques",
        "en": "Soft Skills"
      },
      "items": [
        { "name": { "fr": "Travail d'Équipe", "en": "Teamwork" }, "examples": ["Working well with others"], "icon": "Users", "comment": "inserone" },
        { "name": { "fr": "Communication Efficace", "en": "Effective Communication" }, "examples": ["Sharing ideas clearly"], "icon": "MessageCircle", "comment": "inserone" },
        { "name": { "fr": "Résolution de Problèmes", "en": "Problem Solving" }, "examples": ["Finding smart solutions"], "icon": "HelpCircle", "comment": "inserone" },
        { "name": { "fr": "Gestion du Temps", "en": "Time Management" }, "examples": ["Using time wisely"], "icon": "Clock", "comment": "inserone" },
        { "name": { "fr": "Adaptabilité", "en": "Adaptability" }, "examples": ["Adjusting to change"], "icon": "RefreshCcw", "comment": "inserone" },
        { "name": { "fr": "Esprit Critique", "en": "Critical Thinking" }, "examples": ["Analyzing and reasoning"], "icon": "Zap", "comment": "inserone" },
        { "name": { "fr": "Créativité", "en": "Creativity" }, "examples": ["Thinking outside the box"], "icon": "Star", "comment": "inserone" },
        { "name": { "fr": "Initiative", "en": "Initiative" }, "examples": ["Taking action independently"], "icon": "CornerUpRight", "comment": "inserone" }
      ]
    }
  ]
});
