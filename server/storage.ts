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
import { eq, desc, and, like, or, gt, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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

// Simple in-memory storage for development
class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private courses = new Map<number, Course>();
  private projects = new Map<number, Project>();
  private news = new Map<number, News>();
  private events = new Map<number, Event>();
  private faculty = new Map<number, Faculty>();
  private partnerships = new Map<number, Partnership>();
  private testimonials = new Map<number, Testimonial>();
  private settings = new Map<string, Setting>();

  private nextId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(user => user.email === userData.email);
    
    if (existingUser) {
      const updatedUser = { ...existingUser, ...userData, updatedAt: new Date() };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        profileImageUrl: userData.profileImageUrl || '',
        role: userData.role || 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isActive);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const newCourse: Course = {
      id: this.nextId++,
      title: course.title,
      titleEn: course.titleEn || null,
      titleAr: course.titleAr || null,
      description: course.description || null,
      descriptionEn: course.descriptionEn || null,
      descriptionAr: course.descriptionAr || null,
      semester: course.semester,
      credits: course.credits,
      objectives: course.objectives || null,
      objectivesEn: course.objectivesEn || null,
      objectivesAr: course.objectivesAr || null,
      prerequisites: course.prerequisites || null,
      prerequisitesEn: course.prerequisitesEn || null,
      prerequisitesAr: course.prerequisitesAr || null,
      evaluation: course.evaluation || null,
      evaluationEn: course.evaluationEn || null,
      evaluationAr: course.evaluationAr || null,
      resources: course.resources || null,
      resourcesEn: course.resourcesEn || null,
      resourcesAr: course.resourcesAr || null,
      instructorId: course.instructorId || null,
      isActive: course.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.set(newCourse.id, newCourse);
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const existing = this.courses.get(id);
    if (!existing) throw new Error('Course not found');
    
    const updatedCourse = { 
      ...existing, 
      ...course, 
      updatedAt: new Date() 
    };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    this.courses.delete(id);
  }

  // Project operations
  async getProjects(filters?: { theme?: string; year?: number; featured?: boolean }): Promise<Project[]> {
    let projects = Array.from(this.projects.values()).filter(project => project.isActive);
    
    if (filters?.theme) {
      projects = projects.filter(project => project.theme === filters.theme);
    }
    if (filters?.year) {
      projects = projects.filter(project => project.year === filters.year);
    }
    if (filters?.featured !== undefined) {
      projects = projects.filter(project => project.isFeatured === filters.featured);
    }
    
    return projects.sort((a, b) => b.year - a.year);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: this.nextId++,
      title: project.title,
      titleEn: project.titleEn || null,
      titleAr: project.titleAr || null,
      description: project.description || null,
      descriptionEn: project.descriptionEn || null,
      descriptionAr: project.descriptionAr || null,
      summary: project.summary || null,
      summaryEn: project.summaryEn || null,
      summaryAr: project.summaryAr || null,
      methodology: project.methodology || null,
      methodologyEn: project.methodologyEn || null,
      methodologyAr: project.methodologyAr || null,
      results: project.results || null,
      resultsEn: project.resultsEn || null,
      resultsAr: project.resultsAr || null,
      theme: project.theme,
      year: project.year,
      students: project.students || null,
      supervisors: project.supervisors || null,
      keywords: project.keywords || null,
      awards: project.awards || null,
      documents: project.documents || null,
      videoUrl: project.videoUrl || null,
      imageUrl: project.imageUrl || null,
      isFeatured: project.isFeatured ?? false,
      isActive: project.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error('Project not found');
    
    const updatedProject = { ...existing, ...project, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // News operations
  async getNews(filters?: { category?: string; featured?: boolean }): Promise<News[]> {
    let news = Array.from(this.news.values()).filter(item => item.isActive);
    
    if (filters?.category) {
      news = news.filter(item => item.category === filters.category);
    }
    if (filters?.featured !== undefined) {
      news = news.filter(item => item.isFeatured === filters.featured);
    }
    
    return news.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const newNews: News = {
      id: this.nextId++,
      title: newsItem.title,
      titleEn: newsItem.titleEn || null,
      titleAr: newsItem.titleAr || null,
      summary: newsItem.summary || null,
      summaryEn: newsItem.summaryEn || null,
      summaryAr: newsItem.summaryAr || null,
      content: newsItem.content || null,
      contentEn: newsItem.contentEn || null,
      contentAr: newsItem.contentAr || null,
      category: newsItem.category,
      imageUrl: newsItem.imageUrl || null,
      authorId: newsItem.authorId || null,
      isFeatured: newsItem.isFeatured ?? false,
      isActive: newsItem.isActive ?? true,
      publishedAt: newsItem.publishedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.news.set(newNews.id, newNews);
    return newNews;
  }

  async updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News> {
    const existing = this.news.get(id);
    if (!existing) throw new Error('News not found');
    
    const updatedNews = { ...existing, ...newsItem, updatedAt: new Date() };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    this.news.delete(id);
  }

  // Event operations
  async getEvents(filters?: { type?: string; upcoming?: boolean }): Promise<Event[]> {
    let events = Array.from(this.events.values()).filter(event => event.isActive);
    
    if (filters?.type) {
      events = events.filter(event => event.type === filters.type);
    }
    if (filters?.upcoming !== undefined) {
      const now = new Date();
      events = events.filter(event => {
        const startDate = event.startDate ? new Date(event.startDate) : new Date();
        return filters.upcoming ? startDate > now : startDate <= now;
      });
    }
    
    return events.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    });
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      id: this.nextId++,
      type: event.type,
      title: event.title,
      titleEn: event.titleEn || null,
      titleAr: event.titleAr || null,
      description: event.description || null,
      descriptionEn: event.descriptionEn || null,
      descriptionAr: event.descriptionAr || null,
      location: event.location || null,
      locationEn: event.locationEn || null,
      locationAr: event.locationAr || null,
      startDate: event.startDate,
      endDate: event.endDate,
      speakers: event.speakers || null,
      registrationUrl: event.registrationUrl || null,
      documentsUrl: event.documentsUrl || null,
      imageUrl: event.imageUrl || null,
      isActive: event.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const existing = this.events.get(id);
    if (!existing) throw new Error('Event not found');
    
    const updatedEvent = { ...existing, ...event, updatedAt: new Date() };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }

  // Faculty operations
  async getFaculty(): Promise<Faculty[]> {
    return Array.from(this.faculty.values())
      .filter(member => member.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getFacultyMember(id: number): Promise<Faculty | undefined> {
    return this.faculty.get(id);
  }

  async createFaculty(facultyMember: InsertFaculty): Promise<Faculty> {
    const newFaculty: Faculty = {
      id: this.nextId++,
      userId: facultyMember.userId || null,
      name: facultyMember.name,
      nameEn: facultyMember.nameEn || null,
      nameAr: facultyMember.nameAr || null,
      title: facultyMember.title,
      titleEn: facultyMember.titleEn || null,
      titleAr: facultyMember.titleAr || null,
      specialization: facultyMember.specialization || null,
      specializationEn: facultyMember.specializationEn || null,
      specializationAr: facultyMember.specializationAr || null,
      bio: facultyMember.bio || null,
      bioEn: facultyMember.bioEn || null,
      bioAr: facultyMember.bioAr || null,
      research: facultyMember.research || null,
      researchEn: facultyMember.researchEn || null,
      researchAr: facultyMember.researchAr || null,
      email: facultyMember.email || null,
      phone: facultyMember.phone || null,
      linkedinUrl: facultyMember.linkedinUrl || null,
      websiteUrl: facultyMember.websiteUrl || null,
      profileImageUrl: facultyMember.profileImageUrl || null,
      order: facultyMember.order || 0,
      isActive: facultyMember.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.faculty.set(newFaculty.id, newFaculty);
    return newFaculty;
  }

  async updateFaculty(id: number, facultyMember: Partial<InsertFaculty>): Promise<Faculty> {
    const existing = this.faculty.get(id);
    if (!existing) throw new Error('Faculty member not found');
    
    const updatedFaculty = { ...existing, ...facultyMember, updatedAt: new Date() };
    this.faculty.set(id, updatedFaculty);
    return updatedFaculty;
  }

  async deleteFaculty(id: number): Promise<void> {
    this.faculty.delete(id);
  }

  // Partnership operations
  async getPartnerships(): Promise<Partnership[]> {
    return Array.from(this.partnerships.values()).filter(partnership => partnership.isActive);
  }

  async getPartnership(id: number): Promise<Partnership | undefined> {
    return this.partnerships.get(id);
  }

  async createPartnership(partnership: InsertPartnership): Promise<Partnership> {
    const newPartnership: Partnership = {
      id: this.nextId++,
      name: partnership.name,
      type: partnership.type,
      description: partnership.description || null,
      descriptionEn: partnership.descriptionEn || null,
      descriptionAr: partnership.descriptionAr || null,
      logoUrl: partnership.logoUrl || null,
      websiteUrl: partnership.websiteUrl || null,
      contactPerson: partnership.contactPerson || null,
      isActive: partnership.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.partnerships.set(newPartnership.id, newPartnership);
    return newPartnership;
  }

  async updatePartnership(id: number, partnership: Partial<InsertPartnership>): Promise<Partnership> {
    const existing = this.partnerships.get(id);
    if (!existing) throw new Error('Partnership not found');
    
    const updatedPartnership = { ...existing, ...partnership, updatedAt: new Date() };
    this.partnerships.set(id, updatedPartnership);
    return updatedPartnership;
  }

  async deletePartnership(id: number): Promise<void> {
    this.partnerships.delete(id);
  }

  // Testimonial operations
  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values()).filter(testimonial => testimonial.isActive);
    
    if (featured !== undefined) {
      testimonials = testimonials.filter(testimonial => testimonial.isFeatured === featured);
    }
    
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      id: this.nextId++,
      ...testimonial,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.testimonials.set(newTestimonial.id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) throw new Error('Testimonial not found');
    
    const updatedTestimonial = { ...existing, ...testimonial, updatedAt: new Date() };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    this.testimonials.delete(id);
  }

  // Settings operations
  async getSettings(category?: string): Promise<Setting[]> {
    let settings = Array.from(this.settings.values());
    
    if (category) {
      settings = settings.filter(setting => setting.category === category);
    }
    
    return settings;
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const existing = this.settings.get(setting.key);
    
    if (existing) {
      const updatedSetting = { ...existing, ...setting, updatedAt: new Date() };
      this.settings.set(setting.key, updatedSetting);
      return updatedSetting;
    } else {
      const newSetting: Setting = {
        id: this.nextId++,
        ...setting,
        updatedAt: new Date(),
      };
      this.settings.set(setting.key, newSetting);
      return newSetting;
    }
  }

  async deleteSetting(key: string): Promise<void> {
    this.settings.delete(key);
  }

  // Search operations
  async searchContent(query: string): Promise<{
    projects: Project[];
    news: News[];
    events: Event[];
    courses: Course[];
  }> {
    const searchTerm = query.toLowerCase();
    
    const projects = Array.from(this.projects.values()).filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm)
    );
    
    const news = Array.from(this.news.values()).filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.content?.toLowerCase().includes(searchTerm)
    );
    
    const events = Array.from(this.events.values()).filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.description?.toLowerCase().includes(searchTerm)
    );
    
    const courses = Array.from(this.courses.values()).filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description?.toLowerCase().includes(searchTerm)
    );
    
    return { projects, news, events, courses };
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
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
      .orderBy(desc(news.createdAt));
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
    if (filters?.upcoming !== undefined) {
      const now = new Date();
      if (filters.upcoming) {
        conditions.push(gt(events.startDate, now));
      } else {
        conditions.push(lte(events.startDate, now));
      }
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
      .orderBy(faculty.order);
  }

  async getFacultyMember(id: number): Promise<Faculty | undefined> {
    const [member] = await db.select().from(faculty).where(eq(faculty.id, id));
    return member;
  }

  async createFaculty(facultyMember: InsertFaculty): Promise<Faculty> {
    const [newMember] = await db.insert(faculty).values(facultyMember).returning();
    return newMember;
  }

  async updateFaculty(id: number, facultyMember: Partial<InsertFaculty>): Promise<Faculty> {
    const [updatedMember] = await db
      .update(faculty)
      .set({ ...facultyMember, updatedAt: new Date() })
      .where(eq(faculty.id, id))
      .returning();
    return updatedMember;
  }

  async deleteFaculty(id: number): Promise<void> {
    await db.delete(faculty).where(eq(faculty.id, id));
  }

  // Partnership operations
  async getPartnerships(): Promise<Partnership[]> {
    return await db
      .select()
      .from(partnerships)
      .where(eq(partnerships.isActive, true));
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
      .orderBy(desc(testimonials.createdAt));
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

    if (conditions.length > 0) {
      return await db.select().from(settings).where(and(...conditions));
    }
    
    return await db.select().from(settings);
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
    const searchTerm = `%${query}%`;
    
    const projects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.isActive, true),
          or(
            like(projects.title, searchTerm),
            like(projects.description || '', searchTerm)
          )
        )
      );

    const news = await db
      .select()
      .from(news)
      .where(
        and(
          eq(news.isActive, true),
          or(
            like(news.title, searchTerm),
            like(news.content || '', searchTerm)
          )
        )
      );

    const events = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.isActive, true),
          or(
            like(events.title, searchTerm),
            like(events.description || '', searchTerm)
          )
        )
      );

    const courses = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.isActive, true),
          or(
            like(courses.title, searchTerm),
            like(courses.description || '', searchTerm)
          )
        )
      );

    return { projects, news, events, courses };
  }
}

// Use memory storage for development if database is not available
let storage: IStorage;

try {
  // Try to use database storage
  storage = new DatabaseStorage();
} catch (error) {
  console.warn('Database connection failed, using memory storage for development');
  storage = new MemoryStorage();
}

export { storage };

