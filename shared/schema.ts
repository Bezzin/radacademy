import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("STUDENT"), // ADMIN | STUDENT | INSTRUCTOR
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  specialty: text("specialty").notNull(), // CT | MRI | X-Ray
  coverImage: text("cover_image").notNull(),
  published: boolean("published").default(false),
  authorId: integer("author_id").references(() => users.id),
  rating: integer("rating").default(0),
  totalLessons: integer("total_lessons").default(0),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: text("duration").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  order: integer("order").notNull(),
  transcript: text("transcript"),
  objectives: text("objectives").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  question: text("question").notNull(),
  choices: text("choices").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  courseId: integer("course_id").references(() => courses.id),
  completedAt: timestamp("completed_at").defaultNow(),
  watchTime: integer("watch_time").default(0), // in seconds
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  authorId: integer("author_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id").references(() => discussions.id),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  issueDate: timestamp("issue_date").defaultNow(),
  certificateUrl: text("certificate_url"),
  quizScore: integer("quiz_score"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  completedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  createdAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issueDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Discussion = typeof discussions.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

// Extended types for API responses
export type CourseWithProgress = Course & {
  progress?: number;
  totalLessons: number;
  completedLessons: number;
  author: Pick<User, 'name' | 'avatarUrl'>;
};

export type LessonWithProgress = Lesson & {
  completed: boolean;
  courseTitle: string;
  nextLesson?: Pick<Lesson, 'id' | 'title' | 'slug'>;
  previousLesson?: Pick<Lesson, 'id' | 'title' | 'slug'>;
};

export type DiscussionWithAuthor = Discussion & {
  author: Pick<User, 'name' | 'avatarUrl'>;
  replies?: DiscussionWithAuthor[];
};
