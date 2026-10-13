import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query, 
  where,
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  MicroBizPost, 
  MicroBizCourse, 
  CourseEnrollment,
  MicroBusiness, 
  FinancialRecord, 
  CustomerInquiry, 
  ModerationReport,
  InvoiceDocument,
  MicroBizProfile
} from '../types/microbizTypes';
import { 
  INITIAL_POSTS, 
  INITIAL_COURSES, 
  INITIAL_BUSINESSES, 
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_MODERATION_REPORTS,
  DEFAULT_GUEST_PROFILE
} from '../data/initialMicroBizData';

const STORAGE_KEYS = {
  POSTS: 'microbiz_posts_cache_v2',
  COURSES: 'microbiz_courses_cache_v2',
  ENROLLMENTS: 'microbiz_enrollments_cache_v2',
  BUSINESSES: 'microbiz_businesses_cache_v2',
  FINANCES: 'microbiz_finances_cache_v2',
  INQUIRIES: 'microbiz_inquiries_cache_v2',
  REPORTS: 'microbiz_reports_cache_v2',
  CERTIFICATES: 'microbiz_certificates_cache_v2',
  INVOICES: 'microbiz_invoices_cache_v2'
};

// Safe JSON LocalStorage Helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[MicroBiz] Failed to save to local cache for ${key}`, err);
  }
}

export class MicroBizService {
  // ----------------------------------------------------
  // USER IDENTITY & AUTH RESOLUTION (NO HARDCODED ALEX RIVERA FALLBACK)
  // ----------------------------------------------------
  static isUserAuthenticated(): boolean {
    return !!(auth && auth.currentUser);
  }

  static getCurrentUserId(): string {
    if (auth && auth.currentUser) {
      return auth.currentUser.uid;
    }
    // Isolated guest session per browser tab/session
    let guestId = sessionStorage.getItem('microbiz_session_guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem('microbiz_session_guest_id', guestId);
    }
    return guestId;
  }

  static getCurrentUser(): MicroBizProfile {
    if (auth && auth.currentUser) {
      const u = auth.currentUser;
      return {
        id: u.uid,
        name: u.displayName || u.email?.split('@')[0] || 'Community Learner',
        handle: '@' + (u.email ? u.email.split('@')[0] : u.uid.slice(0, 8)),
        role: 'creator',
        bio: 'Verified community learner & micro-enterprise maker.',
        languages: ['English', 'Tiếng Việt'],
        skills: ['Micro-Business Operations'],
        interests: ['Community Learning'],
        isVerifiedCreator: true,
        coursesCount: 0,
        projectsCount: 0,
        studentsCount: 0,
        followingUserIds: [],
        bookmarkedPostIds: [],
        createdAt: u.metadata?.creationTime || new Date().toISOString()
      };
    }
    return {
      ...DEFAULT_GUEST_PROFILE,
      id: this.getCurrentUserId()
    };
  }

  // ----------------------------------------------------
  // 1. POSTS & DISCOVERY FEED
  // ----------------------------------------------------
  static async getPosts(): Promise<MicroBizPost[]> {
    try {
      if (db) {
        const postsRef = collection(db, 'microbiz_posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remotePosts: MicroBizPost[] = [];
          snapshot.forEach(docSnap => {
            remotePosts.push({ id: docSnap.id, ...docSnap.data() } as MicroBizPost);
          });
          saveToStorage(STORAGE_KEYS.POSTS, remotePosts);
          return remotePosts;
        }
      }
    } catch (err) {
      console.warn('[MicroBiz] Firestore fetch fallback to local storage:', err);
    }
    return loadFromStorage<MicroBizPost[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }

  static async createPost(post: Omit<MicroBizPost, 'id' | 'createdAt' | 'reactions' | 'comments' | 'sharesCount'>): Promise<MicroBizPost> {
    const isAuth = this.isUserAuthenticated();
    const effectiveAuthorId = isAuth && auth?.currentUser ? auth.currentUser.uid : this.getCurrentUserId();

    const newPost: MicroBizPost = {
      ...post,
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: effectiveAuthorId,
      reactions: { like: 0, love: 0, celebrate: 0, insightful: 0, support: 0 },
      comments: [],
      sharesCount: 0,
      createdAt: new Date().toISOString()
    };

    // Save locally first for instant reactive UX
    const currentPosts = await this.getPosts();
    const updated = [newPost, ...currentPosts];
    saveToStorage(STORAGE_KEYS.POSTS, updated);

    // Sync to Firestore only if authenticated (prevents guests from impersonating or violating rules)
    if (isAuth && db) {
      try {
        const docRef = doc(db, 'microbiz_posts', newPost.id);
        await setDoc(docRef, { ...newPost, timestamp: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore background post sync queued:', err);
      }
    }

    return newPost;
  }

  static async reactToPost(
    postId: string, 
    reactionType: 'like' | 'love' | 'celebrate' | 'insightful' | 'support', 
    userId?: string
  ): Promise<MicroBizPost[]> {
    const effectiveUserId = userId || this.getCurrentUserId();
    const posts = await this.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId) {
        const userReactions = { ...(p.userReactions || {}) };
        const previousReaction = userReactions[effectiveUserId];
        const counts = { ...p.reactions };

        if (previousReaction === reactionType) {
          counts[reactionType] = Math.max(0, counts[reactionType] - 1);
          delete userReactions[effectiveUserId];
        } else {
          if (previousReaction && counts[previousReaction]) {
            counts[previousReaction] = Math.max(0, counts[previousReaction] - 1);
          }
          counts[reactionType] = (counts[reactionType] || 0) + 1;
          userReactions[effectiveUserId] = reactionType;
        }

        return {
          ...p,
          reactions: counts,
          userReactions
        };
      }
      return p;
    });

    saveToStorage(STORAGE_KEYS.POSTS, updated);
    return updated;
  }

  static async addComment(postId: string, text: string, author?: MicroBizProfile): Promise<MicroBizPost[]> {
    const effectiveAuthor = author || this.getCurrentUser();
    const posts = await this.getPosts();
    const newComment = {
      id: `c_${Date.now()}`,
      authorId: effectiveAuthor.id,
      authorName: effectiveAuthor.name,
      authorRole: effectiveAuthor.role === 'creator' ? 'Artisan / Creator' : 'Community Member',
      content: text,
      createdAt: 'Just now'
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    saveToStorage(STORAGE_KEYS.POSTS, updated);
    return updated;
  }

  // ----------------------------------------------------
  // 2. COURSES & ENROLLMENT
  // ----------------------------------------------------
  static async getCourses(): Promise<MicroBizCourse[]> {
    try {
      if (db) {
        const coursesRef = collection(db, 'microbiz_courses');
        const snapshot = await getDocs(coursesRef);
        if (!snapshot.empty) {
          const remoteCourses: MicroBizCourse[] = [];
          snapshot.forEach(docSnap => {
            remoteCourses.push({ id: docSnap.id, ...docSnap.data() } as MicroBizCourse);
          });
          saveToStorage(STORAGE_KEYS.COURSES, remoteCourses);
          return remoteCourses;
        }
      }
    } catch (err) {
      console.warn('[MicroBiz] Firestore courses fetch fallback:', err);
    }
    return loadFromStorage<MicroBizCourse[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  static async saveCourse(course: MicroBizCourse): Promise<MicroBizCourse> {
    const isAuth = this.isUserAuthenticated();
    const currentUid = this.getCurrentUserId();
    const currentUser = this.getCurrentUser();

    const finalCourse: MicroBizCourse = {
      ...course,
      creatorId: isAuth && auth?.currentUser ? auth.currentUser.uid : (course.creatorId || currentUid),
      creatorName: isAuth && auth?.currentUser 
        ? (auth.currentUser.displayName || auth.currentUser.email || 'Community Maker') 
        : (course.creatorName || currentUser.name)
    };

    const courses = await this.getCourses();
    const existingIndex = courses.findIndex(c => c.id === finalCourse.id);
    const updated = existingIndex >= 0 ? courses.map((c, i) => i === existingIndex ? finalCourse : c) : [finalCourse, ...courses];
    saveToStorage(STORAGE_KEYS.COURSES, updated);

    if (isAuth && db) {
      try {
        const docRef = doc(db, 'microbiz_courses', finalCourse.id);
        await setDoc(docRef, { ...finalCourse, updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore course sync error:', err);
      }
    }

    return finalCourse;
  }

  static async getEnrollments(userId?: string): Promise<Record<string, CourseEnrollment>> {
    const effectiveUserId = userId || this.getCurrentUserId();
    const key = `${STORAGE_KEYS.ENROLLMENTS}_${effectiveUserId}`;
    return loadFromStorage<Record<string, CourseEnrollment>>(key, {
      'course_bookkeeping_101': {
        id: 'enr_1',
        courseId: 'course_bookkeeping_101',
        userId: effectiveUserId,
        progressPercent: 50,
        completedLessonIds: ['les_1_1'],
        lastActiveLessonId: 'les_1_2',
        isCompleted: false,
        quizScores: { 'les_1_1': 100 }
      }
    });
  }

  static async updateEnrollmentProgress(
    courseId: string, 
    lessonId: string, 
    totalLessonsCount: number, 
    quizScore?: number, 
    userId?: string
  ): Promise<CourseEnrollment> {
    const effectiveUserId = userId || this.getCurrentUserId();
    const enrollments = await this.getEnrollments(effectiveUserId);
    const existing = enrollments[courseId] || {
      id: `enr_${Date.now()}`,
      courseId,
      userId: effectiveUserId,
      progressPercent: 0,
      completedLessonIds: [],
      lastActiveLessonId: lessonId,
      isCompleted: false,
      quizScores: {}
    };

    const completed = Array.from(new Set([...existing.completedLessonIds, lessonId]));
    const progress = Math.min(100, Math.round((completed.length / Math.max(1, totalLessonsCount)) * 100));
    const isNowDone = progress >= 100;

    const quizScores = { ...existing.quizScores };
    if (quizScore !== undefined) {
      quizScores[lessonId] = quizScore;
    }

    const updatedEnrollment: CourseEnrollment = {
      ...existing,
      completedLessonIds: completed,
      lastActiveLessonId: lessonId,
      progressPercent: progress,
      isCompleted: isNowDone,
      completedAt: isNowDone ? (existing.completedAt || new Date().toISOString()) : undefined,
      quizScores,
      certificateId: isNowDone && !existing.certificateId ? `CERT-MB-${Date.now().toString(36).toUpperCase()}` : existing.certificateId
    };

    enrollments[courseId] = updatedEnrollment;
    saveToStorage(`${STORAGE_KEYS.ENROLLMENTS}_${effectiveUserId}`, enrollments);

    // Sync to Firestore if authenticated
    if (this.isUserAuthenticated() && db && auth?.currentUser) {
      try {
        const docRef = doc(db, 'microbiz_enrollments', `${auth.currentUser.uid}_${courseId}`);
        await setDoc(docRef, { ...updatedEnrollment, userId: auth.currentUser.uid, updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore enrollment sync note:', err);
      }
    }

    return updatedEnrollment;
  }

  // ----------------------------------------------------
  // 3. BUSINESSES & STOREFRONTS
  // ----------------------------------------------------
  static async getBusinesses(): Promise<MicroBusiness[]> {
    try {
      if (db) {
        const bizRef = collection(db, 'microbiz_businesses');
        const snapshot = await getDocs(bizRef);
        if (!snapshot.empty) {
          const list: MicroBusiness[] = [];
          snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as MicroBusiness));
          saveToStorage(STORAGE_KEYS.BUSINESSES, list);
          return list;
        }
      }
    } catch (err) {
      console.warn('[MicroBiz] Firestore business fetch fallback:', err);
    }
    return loadFromStorage<MicroBusiness[]>(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  }

  static async saveBusiness(business: MicroBusiness): Promise<MicroBusiness> {
    const isAuth = this.isUserAuthenticated();
    const currentUid = this.getCurrentUserId();

    const finalBusiness: MicroBusiness = {
      ...business,
      ownerId: isAuth && auth?.currentUser ? auth.currentUser.uid : (business.ownerId || currentUid)
    };

    const list = await this.getBusinesses();
    const idx = list.findIndex(b => b.id === finalBusiness.id);
    const updated = idx >= 0 ? list.map((b, i) => i === idx ? finalBusiness : b) : [finalBusiness, ...list];
    saveToStorage(STORAGE_KEYS.BUSINESSES, updated);

    if (isAuth && db) {
      try {
        const docRef = doc(db, 'microbiz_businesses', finalBusiness.id);
        await setDoc(docRef, { ...finalBusiness, updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore business save note:', err);
      }
    }
    return finalBusiness;
  }

  static async sendInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CustomerInquiry> {
    const isAuth = this.isUserAuthenticated();
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'inquiry_received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const inquiries = loadFromStorage<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    saveToStorage(STORAGE_KEYS.INQUIRIES, [newInquiry, ...inquiries]);

    if (isAuth && db) {
      try {
        const docRef = doc(db, 'microbiz_inquiries', newInquiry.id);
        await setDoc(docRef, { ...newInquiry, timestamp: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore inquiry save note:', err);
      }
    }

    return newInquiry;
  }

  static async getInquiries(): Promise<CustomerInquiry[]> {
    return loadFromStorage<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, [
      {
        id: 'inq_demo_1',
        listingId: 'list_bamboo_teaset',
        listingTitle: 'Hand-Carved Bamboo Tea Strainer & Tongs Set',
        businessId: 'biz_treviet',
        customerName: 'Hoang Nam',
        customerContact: 'nam.hoang@eco-cafe.vn',
        message: 'Hello An, we run an organic tea house in District 1 and need 12 sets with laser engraved cafe logo. Can you provide a quotation and lead time?',
        requestedQuantity: 12,
        status: 'quote_sent',
        quotedAmount: 1950000,
        quoteNotes: '10% volume discount applied. Custom logo laser engraving included. Turnaround 4 days.',
        createdAt: '2026-10-10T11:00:00Z',
        updatedAt: '2026-10-10T14:30:00Z'
      }
    ]);
  }

  // ----------------------------------------------------
  // 4. EVERYDAY BOOKKEEPING & FINANCES
  // ----------------------------------------------------
  static async getFinancialRecords(userId?: string): Promise<FinancialRecord[]> {
    const isAuth = this.isUserAuthenticated();

    if (isAuth && auth?.currentUser && db) {
      try {
        const finRef = collection(db, 'microbiz_finances');
        // Query strictly by authenticated userId to satisfy Firestore security rules
        const q = query(finRef, where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const remoteList: FinancialRecord[] = [];
        snapshot.forEach(docSnap => {
          remoteList.push({ id: docSnap.id, ...docSnap.data() } as FinancialRecord);
        });
        
        saveToStorage(`${STORAGE_KEYS.FINANCES}_${auth.currentUser.uid}`, remoteList);
        return remoteList;
      } catch (err) {
        console.warn('[MicroBiz] Authenticated Firestore finances fetch fallback to isolated cache:', err);
        return loadFromStorage<FinancialRecord[]>(`${STORAGE_KEYS.FINANCES}_${auth.currentUser.uid}`, []);
      }
    }

    // Guest user: Isolated sandbox records, never overwriting or exposing authenticated user records
    const effectiveUserId = userId || this.getCurrentUserId();
    return loadFromStorage<FinancialRecord[]>(`${STORAGE_KEYS.FINANCES}_${effectiveUserId}`, INITIAL_FINANCIAL_RECORDS);
  }

  static async addFinancialRecord(record: Omit<FinancialRecord, 'id' | 'createdAt'>): Promise<FinancialRecord> {
    const isAuth = this.isUserAuthenticated();
    const effectiveUserId = isAuth && auth?.currentUser ? auth.currentUser.uid : this.getCurrentUserId();

    const newRecord: FinancialRecord = {
      ...record,
      id: `fin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: effectiveUserId,
      createdAt: new Date().toISOString()
    };

    if (isAuth && auth?.currentUser && db) {
      try {
        const docRef = doc(db, 'microbiz_finances', newRecord.id);
        await setDoc(docRef, { ...newRecord, timestamp: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore finance cloud save note:', err);
      }
      const current = await this.getFinancialRecords(effectiveUserId);
      const updated = [newRecord, ...current.filter(r => r.id !== newRecord.id)];
      saveToStorage(`${STORAGE_KEYS.FINANCES}_${effectiveUserId}`, updated);
      return newRecord;
    }

    // Isolated guest sandbox
    const current = await this.getFinancialRecords(effectiveUserId);
    const updated = [newRecord, ...current.filter(r => r.id !== newRecord.id)];
    saveToStorage(`${STORAGE_KEYS.FINANCES}_${effectiveUserId}`, updated);
    return newRecord;
  }

  static async deleteFinancialRecord(id: string): Promise<FinancialRecord[]> {
    const isAuth = this.isUserAuthenticated();

    if (isAuth && auth?.currentUser && db) {
      try {
        const docRef = doc(db, 'microbiz_finances', id);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('[MicroBiz] Firestore finance delete note:', err);
      }
      const current = await this.getFinancialRecords(auth.currentUser.uid);
      const updated = current.filter(r => r.id !== id);
      saveToStorage(`${STORAGE_KEYS.FINANCES}_${auth.currentUser.uid}`, updated);
      return updated;
    }

    const currentUid = this.getCurrentUserId();
    const current = await this.getFinancialRecords(currentUid);
    const updated = current.filter(r => r.id !== id);
    saveToStorage(`${STORAGE_KEYS.FINANCES}_${currentUid}`, updated);
    return updated;
  }

  // ----------------------------------------------------
  // 5. INVOICES & QUOTATIONS
  // ----------------------------------------------------
  static async getInvoices(): Promise<InvoiceDocument[]> {
    return loadFromStorage<InvoiceDocument[]>(STORAGE_KEYS.INVOICES, [
      {
        id: 'inv_101',
        invoiceNumber: 'INV-2026-001',
        businessName: 'Mầm Xanh Botanical Studio',
        businessContact: 'maker@microbiz.community',
        customerName: 'Green Lotus Yoga Sanctuary',
        customerContact: 'director@greenlotus.vn',
        issueDate: '2026-10-02',
        dueDate: '2026-10-16',
        items: [
          { id: 'item1', description: 'Custom Stamped Lavender Lemongrass Favor Bars (30 pcs)', quantity: 1, unitPrice: 1800000, amount: 1800000 },
          { id: 'item2', description: 'Recycled Kraft Gift Boxes & Botanical Raffia Ties', quantity: 30, unitPrice: 10000, amount: 300000 }
        ],
        subtotal: 2100000,
        discountAmount: 100000,
        taxAmount: 0,
        total: 2000000,
        currency: 'VND',
        notes: 'Thank you for supporting handcrafted local botanicals! 50% deposit received. Balance due upon delivery.',
        status: 'sent'
      }
    ]);
  }

  static async saveInvoice(invoice: InvoiceDocument): Promise<InvoiceDocument> {
    const invoices = await this.getInvoices();
    const idx = invoices.findIndex(i => i.id === invoice.id);
    const updated = idx >= 0 ? invoices.map((inv, i) => i === idx ? invoice : inv) : [invoice, ...invoices];
    saveToStorage(STORAGE_KEYS.INVOICES, updated);
    return invoice;
  }

  // ----------------------------------------------------
  // 6. MODERATION & REPORTS
  // ----------------------------------------------------
  static async getReports(): Promise<ModerationReport[]> {
    return loadFromStorage<ModerationReport[]>(STORAGE_KEYS.REPORTS, INITIAL_MODERATION_REPORTS);
  }

  static async submitReport(report: Omit<ModerationReport, 'id' | 'status' | 'createdAt'>): Promise<ModerationReport> {
    const isAuth = this.isUserAuthenticated();
    const currentUid = this.getCurrentUserId();
    const newReport: ModerationReport = {
      ...report,
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporterUserId: isAuth && auth?.currentUser ? auth.currentUser.uid : currentUid,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const current = await this.getReports();
    const updated = [newReport, ...current];
    saveToStorage(STORAGE_KEYS.REPORTS, updated);

    if (isAuth && db) {
      try {
        const docRef = doc(db, 'microbiz_reports', newReport.id);
        await setDoc(docRef, { ...newReport, timestamp: serverTimestamp() });
      } catch (err) {
        console.warn('[MicroBiz] Firestore moderation report save note:', err);
      }
    }

    return newReport;
  }

  // ----------------------------------------------------
  // 7. CSV EXPORT UTILITY
  // ----------------------------------------------------
  static exportFinancesCsv(records: FinancialRecord[]): string {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Currency', 'Counterparty', 'PaymentMethod', 'Description', 'OcrExtracted'];
    const rows = records.map(r => [
      r.id,
      r.date,
      r.type.toUpperCase(),
      `"${r.category.replace(/"/g, '""')}"`,
      r.amount,
      r.currency,
      `"${r.counterparty.replace(/"/g, '""')}"`,
      r.paymentMethod,
      `"${r.description.replace(/"/g, '""')}"`,
      r.isOcrExtracted ? 'YES' : 'NO'
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}
