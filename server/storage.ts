import {
  users,
  courses,
  projects,
  news,
  events,
  faculty,
  partnerships,
  testimonials,
  settings,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Project,
  type InsertProject,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Faculty,
  type InsertFaculty,
  type Partnership,
  type InsertPartnership,
  type Testimonial,
  type InsertTestimonial,
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Project operations
  getProjects(filters?: { theme?: string; year?: number; featured?: boolean }): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // News operations
  getNews(filters?: { category?: string; featured?: boolean }): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;

  // Event operations
  getEvents(filters?: { type?: string; upcoming?: boolean }): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Faculty operations
  getFaculty(): Promise<Faculty[]>;
  getFacultyMember(id: number): Promise<Faculty | undefined>;
  createFaculty(facultyMember: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: number, facultyMember: Partial<InsertFaculty>): Promise<Faculty>;
  deleteFaculty(id: number): Promise<void>;

  // Partnership operations
  getPartnerships(): Promise<Partnership[]>;
  getPartnership(id: number): Promise<Partnership | undefined>;
  createPartnership(partnership: InsertPartnership): Promise<Partnership>;
  updatePartnership(id: number, partnership: Partial<InsertPartnership>): Promise<Partnership>;
  deletePartnership(id: number): Promise<void>;

  // Testimonial operations
  getTestimonials(featured?: boolean): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  // Settings operations
  getSettings(category?: string): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
  deleteSetting(key: string): Promise<void>;

  // Search operations
  searchContent(query: string): Promise<{
    projects: Project[];
    news: News[];
    events: Event[];
    courses: Course[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isActive, true))
      .orderBy(courses.semester, courses.title);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Project operations
  async getProjects(filters?: { theme?: string; year?: number; featured?: boolean }): Promise<Project[]> {
    const conditions = [eq(projects.isActive, true)];
    
    if (filters?.theme) {
      conditions.push(eq(projects.theme, filters.theme));
    }
    if (filters?.year) {
      conditions.push(eq(projects.year, filters.year));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(projects.isFeatured, filters.featured));
    }

    return await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(desc(projects.year), projects.title);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // News operations
  async getNews(filters?: { category?: string; featured?: boolean }): Promise<News[]> {
    const conditions = [eq(news.isActive, true)];
    
    if (filters?.category) {
      conditions.push(eq(news.category, filters.category));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(news.isFeatured, filters.featured));
    }

    return await db
      .select()
      .from(news)
      .where(and(...conditions))
      .orderBy(desc(news.publishedAt), desc(news.createdAt));
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(newsItem).returning();
    return newNews;
  }

  async updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News> {
    const [updatedNews] = await db
      .update(news)
      .set({ ...newsItem, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Event operations
  async getEvents(filters?: { type?: string; upcoming?: boolean }): Promise<Event[]> {
    const conditions = [eq(events.isActive, true)];
    
    if (filters?.type) {
      conditions.push(eq(events.type, filters.type));
    }
    if (filters?.upcoming) {
      conditions.push(eq(events.startDate, new Date()));
    }

    return await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(events.startDate);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Faculty operations
  async getFaculty(): Promise<Faculty[]> {
    return await db
      .select()
      .from(faculty)
      .where(eq(faculty.isActive, true))
      .orderBy(faculty.order, faculty.name);
  }

  async getFacultyMember(id: number): Promise<Faculty | undefined> {
    const [facultyMember] = await db.select().from(faculty).where(eq(faculty.id, id));
    return facultyMember;
  }

  async createFaculty(facultyMember: InsertFaculty): Promise<Faculty> {
    const [newFaculty] = await db.insert(faculty).values(facultyMember).returning();
    return newFaculty;
  }

  async updateFaculty(id: number, facultyMember: Partial<InsertFaculty>): Promise<Faculty> {
    const [updatedFaculty] = await db
      .update(faculty)
      .set({ ...facultyMember, updatedAt: new Date() })
      .where(eq(faculty.id, id))
      .returning();
    return updatedFaculty;
  }

  async deleteFaculty(id: number): Promise<void> {
    await db.delete(faculty).where(eq(faculty.id, id));
  }

  // Partnership operations
  async getPartnerships(): Promise<Partnership[]> {
    return await db
      .select()
      .from(partnerships)
      .where(eq(partnerships.isActive, true))
      .orderBy(partnerships.name);
  }

  async getPartnership(id: number): Promise<Partnership | undefined> {
    const [partnership] = await db.select().from(partnerships).where(eq(partnerships.id, id));
    return partnership;
  }

  async createPartnership(partnership: InsertPartnership): Promise<Partnership> {
    const [newPartnership] = await db.insert(partnerships).values(partnership).returning();
    return newPartnership;
  }

  async updatePartnership(id: number, partnership: Partial<InsertPartnership>): Promise<Partnership> {
    const [updatedPartnership] = await db
      .update(partnerships)
      .set({ ...partnership, updatedAt: new Date() })
      .where(eq(partnerships.id, id))
      .returning();
    return updatedPartnership;
  }

  async deletePartnership(id: number): Promise<void> {
    await db.delete(partnerships).where(eq(partnerships.id, id));
  }

  // Testimonial operations
  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    const conditions = [eq(testimonials.isActive, true)];
    
    if (featured !== undefined) {
      conditions.push(eq(testimonials.isFeatured, featured));
    }

    return await db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(desc(testimonials.graduationYear), testimonials.name);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Settings operations
  async getSettings(category?: string): Promise<Setting[]> {
    const conditions = [];
    
    if (category) {
      conditions.push(eq(settings.category, category));
    }

    return await db
      .select()
      .from(settings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(settings.category, settings.key);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const [upsertedSetting] = await db
      .insert(settings)
      .values(setting)
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          ...setting,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSetting;
  }

  async deleteSetting(key: string): Promise<void> {
    await db.delete(settings).where(eq(settings.key, key));
  }

  // Search operations
  async searchContent(query: string): Promise<{
    projects: Project[];
    news: News[];
    events: Event[];
    courses: Course[];
  }> {
    const searchPattern = `%${query}%`;

    const [projectResults, newsResults, eventResults, courseResults] = await Promise.all([
      db.select().from(projects).where(
        and(
          eq(projects.isActive, true),
          or(
            like(projects.title, searchPattern),
            like(projects.description, searchPattern),
            like(projects.keywords, searchPattern)
          )
        )
      ),
      db.select().from(news).where(
        and(
          eq(news.isActive, true),
          or(
            like(news.title, searchPattern),
            like(news.summary, searchPattern),
            like(news.content, searchPattern)
          )
        )
      ),
      db.select().from(events).where(
        and(
          eq(events.isActive, true),
          or(
            like(events.title, searchPattern),
            like(events.description, searchPattern)
          )
        )
      ),
      db.select().from(courses).where(
        and(
          eq(courses.isActive, true),
          or(
            like(courses.title, searchPattern),
            like(courses.description, searchPattern)
          )
        )
      ),
    ]);

    return {
      projects: projectResults,
      news: newsResults,
      events: eventResults,
      courses: courseResults,
    };
  }
}

export const storage = new DatabaseStorage();
