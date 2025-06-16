import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressSchema, insertDiscussionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (mock - in real app would use session/auth)
  app.get("/api/user", async (req, res) => {
    const user = await storage.getUser(1); // Demo user
    res.json(user);
  });

  // Get modality information
  app.get("/api/modalities/info", async (req, res) => {
    try {
      const modalityInfo = await storage.getModalityInfo();
      res.json(modalityInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modality info" });
    }
  });

  // Get modality catalog
  app.get("/api/modalities/catalog", async (req, res) => {
    try {
      const catalog = await storage.getModalityCatalog();
      res.json(catalog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modality catalog" });
    }
  });

  // Get courses with optional modality filter
  app.get("/api/courses", async (req, res) => {
    const { modality } = req.query;
    const courses = await storage.getCourses(modality as any);
    res.json(courses);
  });

  // Get course by slug
  app.get("/api/courses/slug/:slug", async (req, res) => {
    const course = await storage.getCourseBySlug(req.params.slug);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const lessons = await storage.getLessonsByCourse(course.id);
    res.json({ ...course, lessons });
  });

  // Get lesson by ID
  app.get("/api/lessons/:id", async (req, res) => {
    const lesson = await storage.getLesson(parseInt(req.params.id));
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  });

  // Get quizzes for a lesson
  app.get("/api/lessons/:id/quizzes", async (req, res) => {
    const quizzes = await storage.getQuizzesByLesson(parseInt(req.params.id));
    res.json(quizzes);
  });

  // Submit quiz answer
  app.post("/api/quizzes/:id/submit", async (req, res) => {
    const { answer } = req.body;
    const quiz = await storage.getQuizzesByLesson(parseInt(req.params.id));
    
    if (!quiz.length) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const isCorrect = quiz[0].correctAnswer === answer;
    res.json({ 
      correct: isCorrect, 
      explanation: quiz[0].explanation,
      correctAnswer: quiz[0].correctAnswer 
    });
  });

  // Mark lesson as completed
  app.post("/api/lessons/:id/complete", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const { watchTime } = req.body;
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const progressData = insertProgressSchema.parse({
        userId: 1, // Demo user
        lessonId,
        courseId: lesson.courseId,
        watchTime: watchTime || 0,
      });

      const progress = await storage.createProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Get user progress
  app.get("/api/progress", async (req, res) => {
    const progress = await storage.getProgressByUser(1); // Demo user
    res.json(progress);
  });

  // Get user enrollments
  app.get("/api/enrollments", async (req, res) => {
    const enrollments = await storage.getEnrollmentsByUser(1); // Demo user
    res.json(enrollments);
  });

  // Get discussions for a course
  app.get("/api/courses/:id/discussions", async (req, res) => {
    const discussions = await storage.getDiscussionsByCourse(parseInt(req.params.id));
    res.json(discussions);
  });

  // Create new discussion
  app.post("/api/discussions", async (req, res) => {
    try {
      const discussionData = insertDiscussionSchema.parse({
        ...req.body,
        authorId: 1, // Demo user
      });

      const discussion = await storage.createDiscussion(discussionData);
      res.json(discussion);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Get user certificates
  app.get("/api/certificates", async (req, res) => {
    const certificates = await storage.getCertificatesByUser(1); // Demo user
    res.json(certificates);
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const userId = 1; // Demo user
    const enrollments = await storage.getEnrollmentsByUser(userId);
    const progress = await storage.getProgressByUser(userId);
    const certificates = await storage.getCertificatesByUser(userId);
    
    // Calculate stats
    const coursesInProgress = enrollments.length;
    const completedLessons = progress.length;
    const studyStreak = 12; // Mock streak data
    
    res.json({
      coursesInProgress,
      completedLessons,
      studyStreak,
      averageProgress: coursesInProgress > 0 ? Math.round((completedLessons / (coursesInProgress * 10)) * 100) : 0,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
