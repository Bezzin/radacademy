import {
  users, courses, lessons, quizzes, progress, enrollments, discussions, certificates,
  type User, type Course, type Lesson, type Quiz, type Progress, type Enrollment, 
  type Discussion, type Certificate, type InsertUser, type InsertCourse, 
  type InsertLesson, type InsertQuiz, type InsertProgress, type InsertEnrollment,
  type InsertDiscussion, type InsertCertificate, type CourseWithProgress,
  type LessonWithProgress, type DiscussionWithAuthor, type Modality, type ModalityCatalog, type ModalityInfo
} from "@shared/schema";
import { readFileSync } from 'fs';
import { join } from 'path';

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Modalities and Courses
  getModalityCatalog(): Promise<ModalityCatalog[]>;
  getModalityInfo(): Promise<ModalityInfo[]>;
  getCoursesByModality(modality: Modality): Promise<CourseWithProgress[]>;
  getCourses(modality?: Modality): Promise<CourseWithProgress[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Lessons
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<LessonWithProgress | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Quizzes
  getQuizzesByLesson(lessonId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Progress
  getProgressByUser(userId: number): Promise<Progress[]>;
  getProgressByCourse(userId: number, courseId: number): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  
  // Enrollments
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Discussions
  getDiscussionsByCourse(courseId: number): Promise<DiscussionWithAuthor[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  
  // Certificates
  getCertificatesByUser(userId: number): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private quizzes: Map<number, Quiz> = new Map();
  private progress: Map<number, Progress> = new Map();
  private enrollments: Map<number, Enrollment> = new Map();
  private discussions: Map<number, Discussion> = new Map();
  private certificates: Map<number, Certificate> = new Map();
  
  private currentUserId = 1;
  private currentCourseId = 1;
  private currentLessonId = 1;
  private currentQuizId = 1;
  private currentProgressId = 1;
  private currentEnrollmentId = 1;
  private currentDiscussionId = 1;
  private currentCertificateId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "drchen",
      email: "dr.chen@radacademy.com",
      password: "password123",
      name: "Dr. Sarah Chen",
      role: "STUDENT",
      avatarUrl: null,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo catalog organized by modality
    const demoCatalog: ModalityCatalog[] = [
      {
        modality: "CT",
        courses: [
          {
            id: this.currentCourseId++,
            title: "CT Fundamentals",
            slug: "ct-fundamentals",
            description: "Master the fundamentals of CT imaging with comprehensive lessons on anatomy, pathology, and interpretation techniques.",
            modality: "CT",
            coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 48,
            totalLessons: 12,
            duration: "8h 30m",
            createdAt: new Date(),
          }
        ]
      },
      {
        modality: "MRI",
        courses: [
          {
            id: this.currentCourseId++,
            title: "Advanced MRI Interpretation",
            slug: "advanced-mri-interpretation",
            description: "Master advanced MRI sequences and pathology identification with detailed case studies and expert guidance.",
            modality: "MRI",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 48,
            totalLessons: 16,
            duration: "12h 15m",
            createdAt: new Date(),
          }
        ]
      },
      {
        modality: "X-Ray",
        courses: [
          {
            id: this.currentCourseId++,
            title: "Chest X-Ray Mastery",
            slug: "chest-xray-mastery",
            description: "Comprehensive chest radiograph interpretation covering normal anatomy, common pathologies, and systematic approach.",
            modality: "X-Ray",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 49,
            totalLessons: 12,
            duration: "6h 15m",
            createdAt: new Date(),
          }
        ]
      },
      {
        modality: "US",
        courses: [
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Gynaecological",
            slug: "us-gyn",
            description: "Coming soon - Comprehensive gynecological ultrasound imaging techniques and interpretation.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Abdominal",
            slug: "us-abdominal",
            description: "Master abdominal ultrasound imaging with detailed exploration of liver, gallbladder, pancreas, kidneys, and abdominal vasculature. Learn systematic scanning techniques, normal anatomy recognition, and pathology identification through comprehensive case studies and hands-on practice sessions.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 45,
            totalLessons: 19,
            duration: "24h 30m",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Men's Health",
            slug: "us-mens-health",
            description: "Coming soon - Specialized ultrasound imaging for men's health applications.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Vascular",
            slug: "us-vascular",
            description: "Coming soon - Comprehensive vascular ultrasound techniques and Doppler imaging.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Musculoskeletal",
            slug: "us-msk",
            description: "Coming soon - Musculoskeletal ultrasound imaging for sports medicine and orthopedics.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Head & Neck",
            slug: "us-head-neck",
            description: "Coming soon - Head and neck ultrasound imaging techniques and applications.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          },
          {
            id: this.currentCourseId++,
            title: "Ultrasound – Obstetric",
            slug: "us-obstetric",
            description: "Coming soon - Comprehensive obstetric ultrasound imaging and fetal assessment.",
            modality: "US",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          }
        ]
      },
      {
        modality: "NM",
        courses: [
          {
            id: this.currentCourseId++,
            title: "Nuclear Medicine Fundamentals",
            slug: "nm-fundamentals",
            description: "Coming soon - Introduction to nuclear medicine imaging techniques and radiopharmaceuticals.",
            modality: "NM",
            coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
            published: true,
            authorId: demoUser.id,
            rating: 0,
            totalLessons: 0,
            duration: "Coming Soon",
            createdAt: new Date(),
          }
        ]
      }
    ];

    // Add all courses to the courses map
    demoCatalog.forEach(modalityGroup => {
      modalityGroup.courses.forEach(course => {
        this.courses.set(course.id, course);
      });
    });

    // Load US Abdominal lessons from JSON file
    let usAbdoLessons: any[] = [];
    try {
      const jsonPath = join(process.cwd(), 'data', 'us_abdo_lessons.json');
      const jsonData = readFileSync(jsonPath, 'utf-8');
      usAbdoLessons = JSON.parse(jsonData);
    } catch (error) {
      console.warn('Could not load US Abdominal lessons data:', error);
    }

    // Find the US Abdominal course ID
    const usAbdominalCourse = Array.from(this.courses.values()).find(course => course.slug === "us-abdominal");
    const usAbdominalCourseId = usAbdominalCourse?.id || 2;

    // Create US Abdominal lessons from scraped data
    usAbdoLessons.forEach((lessonData, index) => {
      const lesson = {
        id: this.currentLessonId++,
        title: lessonData.title,
        slug: `us-abdo-${String(index + 1).padStart(2, '0')}`,
        videoUrl: "", // Empty for now as specified
        duration: "Coming Soon",
        courseId: usAbdominalCourseId,
        order: index + 1,
        transcript: null,
        objectives: [],
        sections: lessonData.sections || [],
        createdAt: new Date(),
      };
      this.lessons.set(lesson.id, lesson);
    });

    // Create demo lessons for CT Fundamentals
    const ctLessons = [
      {
        id: this.currentLessonId++,
        title: "Introduction to CT Technology",
        slug: "introduction-to-ct-technology",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "18:45",
        courseId: 1,
        order: 1,
        transcript: "Welcome to CT Fundamentals. In this lesson, we'll explore the basic principles of computed tomography...",
        objectives: ["Understand CT technology basics", "Learn about image acquisition", "Identify key components"],
        createdAt: new Date(),
      },
      {
        id: this.currentLessonId++,
        title: "Brain Anatomy on CT",
        slug: "brain-anatomy-on-ct",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: "24:30",
        courseId: 1,
        order: 2,
        transcript: "In this lesson, we'll examine brain anatomy as seen on CT scans...",
        objectives: ["Identify brain structures", "Recognize normal anatomy", "Understand imaging planes"],
        createdAt: new Date(),
      },
    ];

    ctLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Create demo quizzes
    const demoQuizzes = [
      {
        id: this.currentQuizId++,
        lessonId: 1,
        question: "Which structure appears hypodense on non-contrast CT brain?",
        choices: ["Bone", "CSF/Ventricles", "Calcification", "Hemorrhage"],
        correctAnswer: 1,
        explanation: "CSF and ventricles appear hypodense (dark) on non-contrast CT scans.",
      },
      {
        id: this.currentQuizId++,
        lessonId: 2,
        question: "What is the normal appearance of gray matter compared to white matter on CT?",
        choices: ["Gray matter is hyperdense", "Gray matter is hypodense", "Both appear identical", "Varies by age"],
        correctAnswer: 0,
        explanation: "Gray matter normally appears slightly hyperdense compared to white matter on CT.",
      },
    ];

    demoQuizzes.forEach(quiz => this.quizzes.set(quiz.id, quiz));

    // Create demo enrollment
    const enrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: demoUser.id,
      courseId: 1,
      enrolledAt: new Date(),
    };
    this.enrollments.set(enrollment.id, enrollment);

    // Create demo progress
    const demoProgress: Progress = {
      id: this.currentProgressId++,
      userId: demoUser.id,
      lessonId: 1,
      courseId: 1,
      completedAt: new Date(),
      watchTime: 1125, // 18:45 in seconds
    };
    this.progress.set(demoProgress.id, demoProgress);

    // Create demo discussions
    const discussions = [
      {
        id: this.currentDiscussionId++,
        courseId: 1,
        authorId: demoUser.id,
        title: "Best practices for identifying subtle intracranial hemorrhage",
        content: "I've been working on improving my sensitivity for detecting small hemorrhages on CT. What window/level settings do you find most effective?",
        parentId: null,
        upvotes: 12,
        createdAt: new Date(),
      },
    ];

    discussions.forEach(discussion => this.discussions.set(discussion.id, discussion));

    // Create demo certificate
    const certificate: Certificate = {
      id: this.currentCertificateId++,
      userId: demoUser.id,
      courseId: 1,
      issueDate: new Date(),
      certificateUrl: "/certificates/ct-fundamentals-dr-chen.pdf",
      quizScore: 95,
    };
    this.certificates.set(certificate.id, certificate);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getModalityCatalog(): Promise<ModalityCatalog[]> {
    const modalities: Modality[] = ["CT", "MRI", "X-Ray", "US", "NM"];
    
    return modalities.map(modality => ({
      modality,
      courses: Array.from(this.courses.values()).filter(course => 
        course.published && course.modality === modality
      )
    }));
  }

  async getModalityInfo(): Promise<ModalityInfo[]> {
    const modalityMap = {
      "CT": { name: "CT Scan", description: "Computed Tomography imaging", icon: "brain" },
      "MRI": { name: "MRI", description: "Magnetic Resonance Imaging", icon: "magnet" },
      "X-Ray": { name: "X-Ray", description: "Radiographic imaging", icon: "radiation" },
      "US": { name: "Ultrasound", description: "Ultrasound imaging", icon: "waves" },
      "NM": { name: "Nuclear Medicine", description: "Nuclear medicine imaging", icon: "atom" }
    };

    return Object.entries(modalityMap).map(([id, info]) => ({
      id: id as Modality,
      name: info.name,
      description: info.description,
      icon: info.icon,
      courseCount: Array.from(this.courses.values()).filter(course => 
        course.published && course.modality === id
      ).length
    }));
  }

  async getCoursesByModality(modality: Modality): Promise<CourseWithProgress[]> {
    return this.getCourses(modality);
  }

  async getCourses(modality?: Modality): Promise<CourseWithProgress[]> {
    const coursesArray = Array.from(this.courses.values()).filter(course => 
      course.published && (!modality || course.modality === modality)
    );

    return coursesArray.map(course => {
      const author = this.users.get(course.authorId!) || { name: "Unknown", avatarUrl: null };
      const courseProgress = Array.from(this.progress.values()).filter(p => p.courseId === course.id);
      const totalLessons = Array.from(this.lessons.values()).filter(l => l.courseId === course.id).length;
      const completedLessons = courseProgress.length;
      
      return {
        ...course,
        totalLessons: course.totalLessons || 0,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        completedLessons,
        author: { name: author.name, avatarUrl: author.avatarUrl },
      };
    });
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(course => course.slug === slug);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const course: Course = {
      ...insertCourse,
      id: this.currentCourseId++,
      createdAt: new Date(),
    };
    this.courses.set(course.id, course);
    return course;
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<LessonWithProgress | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;

    const course = this.courses.get(lesson.courseId!);
    const progressEntry = Array.from(this.progress.values()).find(p => p.lessonId === id);
    
    const courseLessons = Array.from(this.lessons.values())
      .filter(l => l.courseId === lesson.courseId)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = courseLessons.findIndex(l => l.id === id);
    const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : undefined;
    const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;

    return {
      ...lesson,
      completed: !!progressEntry,
      courseTitle: course?.title || "Unknown Course",
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title, slug: nextLesson.slug } : undefined,
      previousLesson: previousLesson ? { id: previousLesson.id, title: previousLesson.title, slug: previousLesson.slug } : undefined,
    };
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.currentLessonId++,
      createdAt: new Date(),
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.lessonId === lessonId);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const quiz: Quiz = {
      ...insertQuiz,
      id: this.currentQuizId++,
    };
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  async getProgressByUser(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }

  async getProgressByCourse(userId: number, courseId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId && p.courseId === courseId);
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const progress: Progress = {
      ...insertProgress,
      id: this.currentProgressId++,
      completedAt: new Date(),
    };
    this.progress.set(progress.id, progress);
    return progress;
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(e => e.userId === userId);
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id: this.currentEnrollmentId++,
      enrolledAt: new Date(),
    };
    this.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async getDiscussionsByCourse(courseId: number): Promise<DiscussionWithAuthor[]> {
    const discussions = Array.from(this.discussions.values())
      .filter(d => d.courseId === courseId && !d.parentId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());

    return discussions.map(discussion => {
      const author = this.users.get(discussion.authorId!) || { name: "Unknown", avatarUrl: null };
      const replies = Array.from(this.discussions.values())
        .filter(d => d.parentId === discussion.id)
        .map(reply => {
          const replyAuthor = this.users.get(reply.authorId!) || { name: "Unknown", avatarUrl: null };
          return {
            ...reply,
            author: { name: replyAuthor.name, avatarUrl: replyAuthor.avatarUrl },
          };
        });

      return {
        ...discussion,
        author: { name: author.name, avatarUrl: author.avatarUrl },
        replies,
      };
    });
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const discussion: Discussion = {
      ...insertDiscussion,
      id: this.currentDiscussionId++,
      createdAt: new Date(),
    };
    this.discussions.set(discussion.id, discussion);
    return discussion;
  }

  async getCertificatesByUser(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(c => c.userId === userId);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const certificate: Certificate = {
      ...insertCertificate,
      id: this.currentCertificateId++,
      issueDate: new Date(),
    };
    this.certificates.set(certificate.id, certificate);
    return certificate;
  }
}

export const storage = new MemStorage();
