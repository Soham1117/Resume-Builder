import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";

interface DemoStep {
  id: string;
  title: string;
  content: string;
  targetSection?: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface DemoContextType {
  isDemoUser: boolean;
  isDemoActive: boolean;
  currentStep: number;
  totalSteps: number;
  demoSteps: DemoStep[];
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipDemo: () => void;
  goToStep: (step: number) => void;
  hasCompletedDemo: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const demoSteps: DemoStep[] = [
  {
    id: "welcome",
    title: "Welcome to your Resume Builder! 🎉",
    content: `Hi Test User, let's take a quick tour of your resume and see how to make it even better.

Your resume currently has:
✅ Personal Information
✅ 2 Work Experiences  
✅ 3 Projects
✅ 2 Education Entries
✅ 4 Skill Categories
✅ 3 Certifications

Let's explore each section and see how our AI can help improve your resume!`,
    position: "top",
  },
  {
    id: "personal-info",
    title: "Personal Information Section 📍",
    content: `Here's your current info:
• Name: Test User
• Email: test.user@example.com
• Phone: (555) 123-4567
• Location: San Francisco, CA
• LinkedIn: testuser-linkedin
• Portfolio: testuser-portfolio.com

💡 Tip: Make sure your contact information is professional and up-to-date. Your portfolio link is especially important for tech roles!`,
    targetSection: "personal",
    position: "right",
  },
  {
    id: "experience",
    title: "Work Experience Section 💼",
    content: `You have 2 great experiences:

1. Frontend Developer at TechCorp Inc. (Jan 2023 - Present)
   • Built responsive web apps with React.js & TypeScript
   • Improved user engagement by 25%
   • Reduced load times by 40%
   • Mentored junior developers

2. Junior Developer at StartupXYZ (Jun 2022 - Dec 2022)
   • Full-stack development with Node.js & Express.js
   • Database work with MongoDB & MySQL
   • Agile development processes

💡 AI Analysis Tip: Your experience shows great progression! The AI can help you tailor these bullet points for specific job descriptions.`,
    targetSection: "experience",
    position: "right",
  },
  {
    id: "projects",
    title: "Projects Section 🚀",
    content: `Your impressive projects:

1. E-commerce Platform
   • Full-stack with React, Node.js, MongoDB, Stripe
   • User authentication & payment integration
   • Responsive design across all devices

2. Task Management App
   • React, TypeScript, Firebase
   • Real-time collaboration features
   • Drag-and-drop functionality

3. Weather Dashboard
   • React, OpenWeather API, Chart.js
   • 7-day forecasts & location alerts
   • Interactive data visualization

💡 Pro Tip: Your projects demonstrate full-stack capabilities! The AI can suggest which projects to highlight for different job types.`,
    targetSection: "projects",
    position: "right",
  },
  {
    id: "education",
    title: "Education Section 🎓",
    content: `Your educational background:
• Bachelor of Science in Computer Science
  University of California, Berkeley (2018-2022)
  GPA: 3.8/4.0

• Associate Degree in Web Development
  Community College of San Francisco (2016-2018)
  GPA: 3.9/4.0

💡 Note: Your strong GPA and relevant degree combination is excellent!`,
    targetSection: "education",
    position: "right",
  },
  {
    id: "skills",
    title: "Skills Section 🛠️",
    content: `Your skills are well-organized:

Programming Languages: JavaScript, TypeScript, Python, Java
Frontend Technologies: React.js, Vue.js, HTML5, CSS3, Sass/SCSS
Backend Technologies: Node.js, Express.js, Django, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL, Redis
Tools & Technologies: Git, Docker, AWS, Firebase, Jenkins

💡 AI Matching: The AI can analyze job descriptions and suggest which skills to emphasize for specific positions!`,
    targetSection: "skills",
    position: "right",
  },
  {
    id: "certifications",
    title: "Certifications Section 🏆",
    content: `Your professional certifications:
• AWS Certified Developer Associate (2023)
• MongoDB Certified Developer (2023)
• React Developer Certification (2022)

💡 These certifications show continuous learning and expertise!`,
    targetSection: "certifications",
    position: "right",
  },
  {
    id: "preview",
    title: "Resume Preview 👀",
    content: `See how your resume looks in real-time! The preview updates automatically as you make changes.

Key features:
• Professional formatting
• Clean, modern design
• Easy-to-read layout
• Mobile-responsive

🎯 Try making a small change and watch the preview update instantly!`,
    position: "left",
  },
  {
    id: "pdf-generation",
    title: "PDF Generation 📄",
    content: `Generate a professional PDF version of your resume:

1. Click "Generate PDF" button
2. Your LaTeX-formatted resume is processed
3. Download your professional PDF
4. Ready to send to employers!

💡 The PDF maintains perfect formatting and is print-ready!`,
    position: "top",
  },
  {
    id: "job-analysis",
    title: "AI Job Analysis 🤖",
    content: `This is where the magic happens! Try our AI analysis:

1. Paste a job description
2. AI analyzes your resume against the job requirements
3. Get personalized suggestions for:
   • Which skills to emphasize
   • How to rephrase experiences
   • Which projects to highlight
   • Overall resume optimization

💡 Example: Try analyzing your resume against a "Senior Frontend Developer" position to see how the AI suggests improvements!`,
    targetSection: "job-analysis",
    position: "top",
  },
  {
    id: "final-tips",
    title: "Final Tips & Next Steps 🎯",
    content: `🎯 Final Tips

• Update your resume regularly with new experiences
• Use the AI analysis for each job application
• Keep your skills section current
• Add new projects as you complete them
• Generate fresh PDFs for each application

Ready to create your perfect resume? Start by exploring any section or try the AI job analysis feature!

Happy resume building! 🚀`,
    position: "top",
  },
];

interface DemoProviderProps {
  children: ReactNode;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedDemo, setHasCompletedDemo] = useState(false);

  // Check if current user is the test user
  const isDemoUser = user?.username === "testuser";

  // Check if demo has been completed before
  useEffect(() => {
    if (isDemoUser) {
      const demoCompleted = localStorage.getItem("demoCompleted");
      if (demoCompleted === "true") {
        setHasCompletedDemo(true);
      }
    }
  }, [isDemoUser]);

  // Note: Demo is now started manually via the welcome message
  // Auto-start demo for test user if not completed before
  // useEffect(() => {
  //   if (isDemoUser && !hasCompletedDemo && !isDemoActive) {
  //     // Small delay to ensure the page is fully loaded
  //     const timer = setTimeout(() => {
  //       setIsDemoActive(true);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isDemoUser, hasCompletedDemo, isDemoActive]);

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentStep(0);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Demo completed
      setIsDemoActive(false);
      setHasCompletedDemo(true);
      localStorage.setItem("demoCompleted", "true");
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipDemo = () => {
    setIsDemoActive(false);
    setHasCompletedDemo(true);
    localStorage.setItem("demoCompleted", "true");
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < demoSteps.length) {
      setCurrentStep(step);
    }
  };

  const value: DemoContextType = {
    isDemoUser,
    isDemoActive,
    currentStep,
    totalSteps: demoSteps.length,
    demoSteps,
    startDemo,
    stopDemo,
    nextStep,
    previousStep,
    skipDemo,
    goToStep,
    hasCompletedDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};
