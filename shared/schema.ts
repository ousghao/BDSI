import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  serial,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"), // student, faculty, admin, editor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content tables
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  semester: integer("semester").notNull(),
  credits: integer("credits").notNull(),
  objectives: text("objectives"),
  objectivesEn: text("objectives_en"),
  objectivesAr: text("objectives_ar"),
  prerequisites: text("prerequisites"),
  prerequisitesEn: text("prerequisites_en"),
  prerequisitesAr: text("prerequisites_ar"),
  evaluation: text("evaluation"),
  evaluationEn: text("evaluation_en"),
  evaluationAr: text("evaluation_ar"),
  resources: text("resources"),
  resourcesEn: text("resources_en"),
  resourcesAr: text("resources_ar"),
  instructorId: varchar("instructor_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  summary: text("summary"),
  summaryEn: text("summary_en"),
  summaryAr: text("summary_ar"),
  methodology: text("methodology"),
  methodologyEn: text("methodology_en"),
  methodologyAr: text("methodology_ar"),
  results: text("results"),
  resultsEn: text("results_en"),
  resultsAr: text("results_ar"),
  theme: varchar("theme").notNull(), // IA/ML, Data Engineering, NLP, Computer Vision, IoT
  year: integer("year").notNull(),
  students: text("students"), // JSON array of student names
  supervisors: text("supervisors"), // JSON array of supervisor names
  keywords: text("keywords"), // JSON array
  awards: text("awards"), // JSON array
  documents: text("documents"), // JSON array of document URLs
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  summary: text("summary"),
  summaryEn: text("summary_en"),
  summaryAr: text("summary_ar"),
  content: text("content"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  category: varchar("category").notNull(), // event, research, success_story, announcement
  imageUrl: varchar("image_url"),
  authorId: varchar("author_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  type: varchar("type").notNull(), // seminar, defense, workshop, meetup
  location: text("location"),
  locationEn: text("location_en"),
  locationAr: text("location_ar"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  speakers: text("speakers"), // JSON array
  registrationUrl: varchar("registration_url"),
  documentsUrl: varchar("documents_url"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  nameAr: text("name_ar"),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleAr: text("title_ar"),
  specialization: text("specialization"),
  specializationEn: text("specialization_en"),
  specializationAr: text("specialization_ar"),
  bio: text("bio"),
  bioEn: text("bio_en"),
  bioAr: text("bio_ar"),
  research: text("research"),
  researchEn: text("research_en"),
  researchAr: text("research_ar"),
  email: varchar("email"),
  phone: varchar("phone"),
  linkedinUrl: varchar("linkedin_url"),
  websiteUrl: varchar("website_url"),
  profileImageUrl: varchar("profile_image_url"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnerships = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  nameAr: text("name_ar"),
  type: varchar("type").notNull(), // company, laboratory, institution
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  logoUrl: varchar("logo_url"),
  websiteUrl: varchar("website_url"),
  contactEmail: varchar("contact_email"),
  contactPerson: text("contact_person"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  roleEn: text("role_en"),
  roleAr: text("role_ar"),
  content: text("content").notNull(),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  company: text("company"),
  imageUrl: varchar("image_url"),
  graduationYear: integer("graduation_year"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  valueEn: text("value_en"),
  valueAr: text("value_ar"),
  type: varchar("type").default("text"), // text, number, boolean, json
  category: varchar("category").default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

// Admissions table
export const admissions = pgTable("admissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  nationalId: varchar("national_id").notNull(),
  dob: date("dob").notNull(),
  address: text("address").notNull(),
  priorDegree: varchar("prior_degree").notNull(), // bac, licence, master, equivalent
  gpaOrScore: varchar("gpa_or_score"),
  programTrack: varchar("program_track"),
  pdfUrl: varchar("pdf_url").notNull(),
  status: varchar("status").default("submitted"), // submitted, under_review, accepted, rejected
  notesAdmin: text("notes_admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  organization: text("organization"),
  reason: varchar("reason").notNull(), // admission, program, partnership, etc.
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, read, replied, archived
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacultySchema = createInsertSchema(faculty).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnershipSchema = createInsertSchema(partnerships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  updatedAt: true,
});

export const insertAdmissionSchema = createInsertSchema(admissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = z.infer<typeof insertPartnershipSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type Admission = typeof admissions.$inferSelect;
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
