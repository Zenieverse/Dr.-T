import { 
  GatherEvent, 
  BudgetItem, 
  TimelineTask, 
  VendorRecord, 
  GuestRecord, 
  TeamRoleAssignment,
  AIEventPlan,
  EventType,
  Currency
} from '../types';
import { 
  STARTER_EVENT, 
  SECOND_STARTER_EVENT, 
  STARTER_BUDGET_ITEMS, 
  STARTER_TIMELINE_TASKS, 
  STARTER_VENDORS, 
  STARTER_GUESTS, 
  STARTER_TEAM_ROLES, 
  STARTER_AI_PLAN 
} from '../initialData';
import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_KEY_PREFIX = 'gather_and_glow_v1_';

const inMemoryStore = new Map<string, string>();

const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        return window.localStorage.getItem(key);
      }
    } catch {
      // fallback
    }
    return inMemoryStore.get(key) || null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // fallback
    }
    inMemoryStore.set(key, value);
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // fallback
    }
    inMemoryStore.delete(key);
  }
};

export interface FullEventPackage {
  event: GatherEvent;
  budget: BudgetItem[];
  tasks: TimelineTask[];
  vendors: VendorRecord[];
  guests: GuestRecord[];
  teamRoles: TeamRoleAssignment[];
  aiPlan?: AIEventPlan;
}

export class GatherGlowService {
  private static getStorageKey(subKey: string): string {
    const userId = auth?.currentUser?.uid || 'guest';
    return `${STORAGE_KEY_PREFIX}${userId}_${subKey}`;
  }

  // ----------------------------------------------------
  // EVENT CRUD
  // ----------------------------------------------------

  static async loadAllEvents(): Promise<GatherEvent[]> {
    try {
      if (auth.currentUser) {
        // Authenticated Firestore query
        const q = query(
          collection(db, 'gather_and_glow_events'),
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const events: GatherEvent[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            events.push({
              id: docSnap.id,
              ...data
            } as GatherEvent);
          });
          return events;
        }
      }
    } catch (e) {
      console.warn('[GatherGlow] Firestore fetch failed, using local storage fallback:', e);
    }

    // LocalStorage Fallback
    const local = safeStorage.getItem(this.getStorageKey('events'));
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('[GatherGlow] Failed to parse local events:', err);
      }
    }

    // Default Seed Events
    const initialEvents = [STARTER_EVENT, SECOND_STARTER_EVENT];
    this.saveEventsLocally(initialEvents);
    // Also seed starter items
    this.saveBudgetLocally(STARTER_BUDGET_ITEMS);
    this.saveTasksLocally(STARTER_TIMELINE_TASKS);
    this.saveVendorsLocally(STARTER_VENDORS);
    this.saveGuestsLocally(STARTER_GUESTS);
    this.saveTeamRolesLocally(STARTER_TEAM_ROLES);
    this.saveAiPlanLocally(STARTER_EVENT.id, STARTER_AI_PLAN);

    return initialEvents;
  }

  static async loadEventById(eventId: string): Promise<GatherEvent | null> {
    const events = await this.loadAllEvents();
    return events.find(e => e.id === eventId) || null;
  }

  static async saveEvent(event: GatherEvent): Promise<void> {
    const events = await this.loadAllEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      events[existingIndex] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      events.unshift({ ...event, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveEventsLocally(events);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'gather_and_glow_events', event.id), {
          ...event,
          userId: auth.currentUser.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('[GatherGlow] Firestore save event error:', e);
      }
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    const events = await this.loadAllEvents();
    const filtered = events.filter(e => e.id !== eventId);
    this.saveEventsLocally(filtered);

    // Also remove associated data
    const budget = (await this.loadBudget(eventId)).filter(b => b.eventId !== eventId);
    this.saveBudgetLocally(budget);

    const tasks = (await this.loadTasks(eventId)).filter(t => t.eventId !== eventId);
    this.saveTasksLocally(tasks);

    const vendors = (await this.loadVendors(eventId)).filter(v => v.eventId !== eventId);
    this.saveVendorsLocally(vendors);

    const guests = (await this.loadGuests(eventId)).filter(g => g.eventId !== eventId);
    this.saveGuestsLocally(guests);

    const roles = (await this.loadTeamRoles(eventId)).filter(r => r.eventId !== eventId);
    this.saveTeamRolesLocally(roles);

    safeStorage.removeItem(this.getStorageKey(`ai_plan_${eventId}`));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'gather_and_glow_events', eventId));
      } catch (e) {
        console.warn('[GatherGlow] Firestore delete event error:', e);
      }
    }
  }

  static async duplicateEvent(eventId: string): Promise<GatherEvent> {
    const events = await this.loadAllEvents();
    const source = events.find(e => e.id === eventId);
    if (!source) {
      throw new Error(`Event not found for duplication: ${eventId}`);
    }

    const newId = `event-${Date.now()}`;
    const duplicatedEvent: GatherEvent = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Duplicate all sub-resources
    const [budget, tasks, vendors, guests, roles, plan] = await Promise.all([
      this.loadBudget(eventId),
      this.loadTasks(eventId),
      this.loadVendors(eventId),
      this.loadGuests(eventId),
      this.loadTeamRoles(eventId),
      this.loadAiPlan(eventId)
    ]);

    const newBudget = budget.map(b => ({ ...b, id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, eventId: newId }));
    const newTasks = tasks.map(t => ({ ...t, id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, eventId: newId }));
    const newVendors = vendors.map(v => ({ ...v, id: `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, eventId: newId }));
    const newGuests = guests.map(g => ({ ...g, id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, eventId: newId }));
    const newRoles = roles.map(r => ({ ...r, id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, eventId: newId }));

    await this.saveEvent(duplicatedEvent);
    this.saveBudgetLocally([...(await this.getAllBudgetItems()), ...newBudget]);
    this.saveTasksLocally([...(await this.getAllTasks()), ...newTasks]);
    this.saveVendorsLocally([...(await this.getAllVendors()), ...newVendors]);
    this.saveGuestsLocally([...(await this.getAllGuests()), ...newGuests]);
    this.saveTeamRolesLocally([...(await this.getAllTeamRoles()), ...newRoles]);
    if (plan) {
      await this.saveAiPlan(newId, plan);
    }

    return duplicatedEvent;
  }

  static async archiveEvent(eventId: string, isArchived = true): Promise<void> {
    const events = await this.loadAllEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.isArchived = isArchived;
      await this.saveEvent(event);
    }
  }

  static async checkAiHealth(): Promise<{ status: string; model: string; isLiveConfigured: boolean }> {
    try {
      const res = await fetch('/api/gather-and-glow/health');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Local fallback
    }
    return {
      status: 'DEGRADED',
      model: 'gemini-3.8-flash',
      isLiveConfigured: false
    };
  }

  static async refineAiPlan(currentPlan: AIEventPlan, prompt: string, event: GatherEvent): Promise<AIEventPlan> {
    try {
      const res = await fetch('/api/gather-and-glow/refine-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlan, prompt, event })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plan) {
          await this.saveAiPlan(event.id, data.plan);
          return data.plan;
        }
      }
    } catch (err) {
      console.warn('[GatherGlow] Server refinement failed, applying client heuristic refinement:', err);
    }

    // Client fallback refinement
    const updatedPlan: AIEventPlan = {
      ...currentPlan,
      themeConcept: {
        ...currentPlan.themeConcept,
        moodboardSummary: `${currentPlan.themeConcept.moodboardSummary} [User Refinement: ${prompt}]`
      },
      generatedAt: new Date().toISOString(),
      engine: 'Client Heuristic Refinement'
    };
    if (prompt.toLowerCase().includes('emerald') || prompt.toLowerCase().includes('gold')) {
      updatedPlan.themeConcept.palette = ['#0F5132', '#D4AF37', '#F4EDE2', '#198754', '#1F2937'];
    }
    await this.saveAiPlan(event.id, updatedPlan);
    return updatedPlan;
  }

  static exportGuestsCsv(guests: GuestRecord[]): string {
    const headers = ['Name', 'Email', 'Phone', 'RSVP Status', 'Invitation Status', 'Plus Ones', 'Dietary Requirements', 'Table / Seating', 'VIP', 'Notes'];
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`,
      g.rsvpStatus,
      g.invitationStatus,
      g.plusOnes || 0,
      `"${(g.dietaryRequirements || []).join('; ').replace(/"/g, '""')}"`,
      `"${(g.tableOrSeating || '').replace(/"/g, '""')}"`,
      g.isVIP ? 'Yes' : 'No',
      `"${(g.notes || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  static async importGuestsCsv(arg1: string, arg2?: string): Promise<GuestRecord[]> {
    const isArg1Csv = (arg1 && (arg1.includes('\n') || arg1.includes(','))) || !arg2;
    const csvContent = isArg1Csv ? arg1 : (arg2 || '');
    const eventId = isArg1Csv ? (arg2 || 'default-event') : arg1;

    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    // Parse header to map columns dynamically
    const headerLine = lines[0];
    const headerMatch = headerLine.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    const headerCells = (headerMatch || []).map(c => {
      let v = c.startsWith(',') ? c.slice(1) : c;
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.slice(1, -1).replace(/""/g, '"');
      }
      return v.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    });

    const col = (names: string[]): number => {
      for (const n of names) {
        const idx = headerCells.indexOf(n);
        if (idx >= 0) return idx;
      }
      return -1;
    };

    const nameIdx = col(['name', 'guestname', 'fullname']) >= 0 ? col(['name', 'guestname', 'fullname']) : 0;
    const emailIdx = col(['email', 'emailaddress']);
    const phoneIdx = col(['phone', 'phonenumber', 'tel']);
    const rsvpIdx = col(['rsvpstatus', 'rsvp', 'status']);
    const partySizeIdx = col(['partysize', 'plusones', 'guests', 'seats']);
    const dietaryIdx = col(['dietaryrequirements', 'dietary', 'allergies', 'diet']);
    const tableIdx = col(['tableassignment', 'tableseating', 'table', 'seating']);
    const vipIdx = col(['isvip', 'vip']);
    const notesIdx = col(['notes', 'note', 'comment', 'comments']);

    const newGuests: GuestRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
      if (!match) continue;
      const cells = match.map(c => {
        let v = c.startsWith(',') ? c.slice(1) : c;
        if (v.startsWith('"') && v.endsWith('"')) {
          v = v.slice(1, -1).replace(/""/g, '"');
        }
        return v.trim();
      });

      const name = cells[nameIdx];
      if (!name) continue;

      const rsvpRaw = (rsvpIdx >= 0 ? cells[rsvpIdx] : cells[3])?.toLowerCase();
      const rsvp = (['attending', 'declined', 'tentative', 'pending'].includes(rsvpRaw) 
        ? rsvpRaw 
        : 'pending') as GuestRecord['rsvpStatus'];

      const dietaryRaw = dietaryIdx >= 0 ? cells[dietaryIdx] : (cells[6] || '');
      const dietary = dietaryRaw
        .split(/[;,]/)
        .map(s => s.trim())
        .filter(Boolean);

      const vipRaw = (vipIdx >= 0 ? cells[vipIdx] : (cells[8] || '')).toLowerCase();
      const isVIP = vipRaw === 'yes' || vipRaw === 'true' || vipRaw === '1';

      const partySizeRaw = partySizeIdx >= 0 ? cells[partySizeIdx] : (cells[5] || '1');
      const partySize = parseInt(partySizeRaw, 10) || 1;

      const guest: GuestRecord = {
        id: `guest-csv-${Date.now()}-${i}`,
        eventId,
        name,
        email: emailIdx >= 0 ? cells[emailIdx] : (cells[1] || undefined),
        phone: phoneIdx >= 0 ? cells[phoneIdx] : (cells[2] || undefined),
        rsvpStatus: rsvp,
        invitationStatus: 'draft',
        plusOnes: Math.max(0, partySize - 1),
        dietaryRequirements: dietary.length > 0 ? dietary : ['None'],
        tableOrSeating: tableIdx >= 0 ? cells[tableIdx] : (cells[7] || ''),
        isVIP,
        notes: notesIdx >= 0 ? cells[notesIdx] : (cells[9] || '')
      };
      newGuests.push(guest);
      await this.saveGuest(guest);
    }
    return newGuests;
  }

  // ----------------------------------------------------
  // BUDGET CRUD
  // ----------------------------------------------------

  static async loadBudget(eventId: string): Promise<BudgetItem[]> {
    const local = safeStorage.getItem(this.getStorageKey('budget'));
    if (local) {
      try {
        const items: BudgetItem[] = JSON.parse(local);
        return items.filter(b => b.eventId === eventId);
      } catch (e) {
        console.warn('Error reading budget:', e);
      }
    }
    return STARTER_BUDGET_ITEMS.filter(b => b.eventId === eventId);
  }

  static async saveBudgetItem(item: BudgetItem): Promise<void> {
    const all = await this.getAllBudgetItems();
    const index = all.findIndex(b => b.id === item.id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    this.saveBudgetLocally(all);
  }

  static async deleteBudgetItem(itemId: string): Promise<void> {
    const all = await this.getAllBudgetItems();
    const filtered = all.filter(b => b.id !== itemId);
    this.saveBudgetLocally(filtered);
  }

  private static async getAllBudgetItems(): Promise<BudgetItem[]> {
    const local = safeStorage.getItem(this.getStorageKey('budget'));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return STARTER_BUDGET_ITEMS;
  }

  // ----------------------------------------------------
  // TIMELINE TASKS CRUD
  // ----------------------------------------------------

  static async loadTasks(eventId: string): Promise<TimelineTask[]> {
    const local = safeStorage.getItem(this.getStorageKey('tasks'));
    if (local) {
      try {
        const items: TimelineTask[] = JSON.parse(local);
        return items.filter(t => t.eventId === eventId);
      } catch (e) {}
    }
    return STARTER_TIMELINE_TASKS.filter(t => t.eventId === eventId);
  }

  static async saveTask(task: TimelineTask): Promise<void> {
    const all = await this.getAllTasks();
    const index = all.findIndex(t => t.id === task.id);
    if (index >= 0) {
      all[index] = task;
    } else {
      all.push(task);
    }
    this.saveTasksLocally(all);
  }

  static async deleteTask(taskId: string): Promise<void> {
    const all = await this.getAllTasks();
    this.saveTasksLocally(all.filter(t => t.id !== taskId));
  }

  private static async getAllTasks(): Promise<TimelineTask[]> {
    const local = safeStorage.getItem(this.getStorageKey('tasks'));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return STARTER_TIMELINE_TASKS;
  }

  // ----------------------------------------------------
  // VENDORS CRUD
  // ----------------------------------------------------

  static async loadVendors(eventId: string): Promise<VendorRecord[]> {
    const local = safeStorage.getItem(this.getStorageKey('vendors'));
    if (local) {
      try {
        const items: VendorRecord[] = JSON.parse(local);
        return items.filter(v => v.eventId === eventId);
      } catch (e) {}
    }
    return STARTER_VENDORS.filter(v => v.eventId === eventId);
  }

  static async saveVendor(vendor: VendorRecord): Promise<void> {
    const all = await this.getAllVendors();
    const index = all.findIndex(v => v.id === vendor.id);
    if (index >= 0) {
      all[index] = vendor;
    } else {
      all.push(vendor);
    }
    this.saveVendorsLocally(all);
  }

  static async deleteVendor(vendorId: string): Promise<void> {
    const all = await this.getAllVendors();
    this.saveVendorsLocally(all.filter(v => v.id !== vendorId));
  }

  private static async getAllVendors(): Promise<VendorRecord[]> {
    const local = safeStorage.getItem(this.getStorageKey('vendors'));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return STARTER_VENDORS;
  }

  // ----------------------------------------------------
  // GUESTS CRUD
  // ----------------------------------------------------

  static async loadGuests(eventId: string): Promise<GuestRecord[]> {
    const local = safeStorage.getItem(this.getStorageKey('guests'));
    if (local) {
      try {
        const items: GuestRecord[] = JSON.parse(local);
        return items.filter(g => g.eventId === eventId);
      } catch (e) {}
    }
    return STARTER_GUESTS.filter(g => g.eventId === eventId);
  }

  static async saveGuest(guest: GuestRecord): Promise<void> {
    const all = await this.getAllGuests();
    const index = all.findIndex(g => g.id === guest.id);
    if (index >= 0) {
      all[index] = guest;
    } else {
      all.push(guest);
    }
    this.saveGuestsLocally(all);
  }

  static async deleteGuest(guestId: string): Promise<void> {
    const all = await this.getAllGuests();
    this.saveGuestsLocally(all.filter(g => g.id !== guestId));
  }

  private static async getAllGuests(): Promise<GuestRecord[]> {
    const local = safeStorage.getItem(this.getStorageKey('guests'));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return STARTER_GUESTS;
  }

  // ----------------------------------------------------
  // TEAM ROLES CRUD
  // ----------------------------------------------------

  static async loadTeamRoles(eventId: string): Promise<TeamRoleAssignment[]> {
    const local = safeStorage.getItem(this.getStorageKey('team_roles'));
    if (local) {
      try {
        const items: TeamRoleAssignment[] = JSON.parse(local);
        return items.filter(r => r.eventId === eventId);
      } catch (e) {}
    }
    return STARTER_TEAM_ROLES.filter(r => r.eventId === eventId);
  }

  static async saveTeamRole(role: TeamRoleAssignment): Promise<void> {
    const all = await this.getAllTeamRoles();
    const index = all.findIndex(r => r.id === role.id);
    if (index >= 0) {
      all[index] = role;
    } else {
      all.push(role);
    }
    this.saveTeamRolesLocally(all);
  }

  static async deleteTeamRole(roleId: string): Promise<void> {
    const all = await this.getAllTeamRoles();
    this.saveTeamRolesLocally(all.filter(r => r.id !== roleId));
  }

  private static async getAllTeamRoles(): Promise<TeamRoleAssignment[]> {
    const local = safeStorage.getItem(this.getStorageKey('team_roles'));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return STARTER_TEAM_ROLES;
  }

  // ----------------------------------------------------
  // AI PLAN
  // ----------------------------------------------------

  static async loadAiPlan(eventId: string): Promise<AIEventPlan | null> {
    const local = safeStorage.getItem(this.getStorageKey(`ai_plan_${eventId}`));
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    if (eventId === STARTER_EVENT.id) {
      return STARTER_AI_PLAN;
    }
    return null;
  }

  static saveAiPlan(eventId: string, plan: AIEventPlan): void {
    this.saveAiPlanLocally(eventId, plan);
  }

  // ----------------------------------------------------
  // AI SERVER GENERATION
  // ----------------------------------------------------

  static async requestAiPlan(event: GatherEvent): Promise<AIEventPlan> {
    try {
      const response = await fetch('/api/gather-and-glow/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          this.saveAiPlan(event.id, data.plan);
          return data.plan;
        }
      }
    } catch (err) {
      console.warn('[GatherGlow] Server AI generation failed, falling back to local heuristic plan:', err);
    }

    // Heuristic generator fallback
    const fallbackPlan = this.generateHeuristicPlan(event);
    this.saveAiPlan(event.id, fallbackPlan);
    return fallbackPlan;
  }

  private static generateHeuristicPlan(event: GatherEvent): AIEventPlan {
    const currency = event.currency || 'USD';
    const total = event.totalBudget || 10000;

    return {
      themeConcept: {
        title: `${event.title} — Signature Concept`,
        moodboardSummary: `A personalized celebration celebrating ${event.eventType.replace('_', ' ')} with ${event.themeStyle || 'warm contemporary elegance'}. Tailored for ${event.expectedGuests} cherished guests in ${event.location || 'a memorable venue'}.`,
        palette: ['#C88D42', '#3D5A40', '#F4EDE2', '#8C3838', '#1F2937'],
        atmosphereKeynotes: [
          'Welcoming, unhurried hospitality greeting every guest by name',
          'Thoughtful seating accommodating both elders and young children',
          'Soft, conversational acoustic ambiance during meals',
          'Coordinated celebration highlights focusing on authentic connection'
        ]
      },
      budgetBreakdown: [
        {
          category: 'catering',
          categoryLabel: 'Food & Beverage Experience',
          recommendedPercent: 35,
          recommendedAmount: Math.round(total * 0.35),
          reasoning: 'Culinary hospitality is the centerpiece of guest comfort and memory.'
        },
        {
          category: 'venue',
          categoryLabel: 'Venue & Grounds Hire',
          recommendedPercent: 25,
          recommendedAmount: Math.round(total * 0.25),
          reasoning: 'Atmospheric setting, shelter guarantees, and foundational logistics.'
        },
        {
          category: 'photography',
          categoryLabel: 'Photography & Videography',
          recommendedPercent: 12,
          recommendedAmount: Math.round(total * 0.12),
          reasoning: 'Preserves authentic, candid emotion and generational portraits.'
        },
        {
          category: 'decor',
          categoryLabel: 'Flowers & Theme Decor',
          recommendedPercent: 10,
          recommendedAmount: Math.round(total * 0.10),
          reasoning: 'Immersive colors, floral centerpieces, and lighting accents.'
        },
        {
          category: 'entertainment',
          categoryLabel: 'Music & Entertainment',
          recommendedPercent: 8,
          recommendedAmount: Math.round(total * 0.08),
          reasoning: 'Soundtrack that guides guest emotion from ceremony to dance.'
        },
        {
          category: 'attire',
          categoryLabel: 'Attire & Styling',
          recommendedPercent: 5,
          recommendedAmount: Math.round(total * 0.05),
          reasoning: 'Special garments honoring the milestone.'
        },
        {
          category: 'contingency',
          categoryLabel: 'Emergency Reserve Buffer',
          recommendedPercent: 5,
          recommendedAmount: Math.round(total * 0.05),
          reasoning: 'Crucial safety buffer for weather adjustments or unexpected additions.'
        }
      ],
      milestones: [
        {
          timeframe: '6+ Months Prior',
          actionItems: [
            'Confirm date, venue contract, and emergency weather guarantee',
            'Draft preliminary guest list and budget allocations',
            'Interview and lock lead photographer and caterer'
          ]
        },
        {
          timeframe: '3 Months Prior',
          actionItems: [
            'Send official invitations with dietary and accessibility RSVP survey',
            'Book entertainment, sound system, and floral/decor specialists',
            'Finalize ceremony structure and traditional rites'
          ]
        },
        {
          timeframe: '1 Month Prior',
          actionItems: [
            'Confirm final RSVPs and special dietary requirements',
            'Walk through venue floorplan with day-of coordinator',
            'Order favors and design printable day-of signage'
          ]
        },
        {
          timeframe: 'Event Week',
          actionItems: [
            'Finalize day-of running order with all vendor leads',
            'Distribute Three Hats responsibility briefing to key helpers',
            'Pack emergency event day kit (first aid, chargers, backup schedule)'
          ]
        }
      ],
      vendorChecklist: [
        {
          category: 'venue',
          keyQuestionsToAsk: [
            'What is the sound and noise curfew for amplified music?',
            'What is the backup plan and room if severe rain or wind occurs?',
            'Are there step-free ramps and clean accessible restrooms for elders?'
          ],
          selectionTips: [
            'Visit the venue at the exact hour your event will occur to check sunlight and shadows.'
          ]
        },
        {
          category: 'catering',
          keyQuestionsToAsk: [
            'How are severe allergies and dietary meals labeled and delivered?',
            'Is coffee, tea, and water service included throughout the reception?',
            'What is your cancellation and reschedule policy?'
          ],
          selectionTips: [
            'Always request a menu tasting prior to final contract signing.'
          ]
        }
      ],
      guestExperiencePlan: {
        welcomeStrategy: 'A warm welcome table offering refreshing beverages, program booklets, and comfortable seating immediately upon arrival.',
        dietaryCareSummary: `Dedicated catering tags catering to ${event.dietaryNeeds?.join(', ') || 'all guests with personal respect'}.`,
        accessibilityChecklist: [
          'Step-free entrance and ramps for wheelchairs',
          'Shaded seating zones for elders and infants',
          'Clear, legible directional signage in large typography'
        ]
      },
      eventDayRunningOrder: [
        {
          time: '12:00',
          activity: 'Venue Setup & Vendor Load-In',
          responsibleHat: 'professional',
          leadPerson: 'Event Coordinator',
          notes: 'Tables, sound equipment, and decor placed.'
        },
        {
          time: '14:30',
          activity: 'Honoree & Family Arrival & Quiet Moment',
          responsibleHat: 'personal',
          leadPerson: 'Host Team',
          notes: 'Stay hydrated, check attire, take deep breaths.'
        },
        {
          time: '15:30',
          activity: 'Guest Arrival & Welcome Refreshments',
          responsibleHat: 'social',
          leadPerson: 'Welcome Ambassadors',
          notes: 'Greet guests, direct to guestbook and seating.'
        },
        {
          time: '16:00',
          activity: 'Ceremony / Opening Welcome',
          responsibleHat: 'personal',
          leadPerson: 'Couple / Officiant / Host',
          notes: 'Meaningful vows, milestone blessings, or key speeches.'
        },
        {
          time: '17:30',
          activity: 'Celebratory Feast & Dinner Service',
          responsibleHat: 'professional',
          leadPerson: 'Catering Lead',
          notes: 'Multi-course meal or family feast served.'
        },
        {
          time: '19:30',
          activity: 'Heartfelt Toasts & Family Sharing',
          responsibleHat: 'social',
          leadPerson: 'Emcee & Family',
          notes: 'Toasts, slideshow projection, and collective storytelling.'
        },
        {
          time: '20:30',
          activity: 'Music, Celebration & Dancing',
          responsibleHat: 'social',
          leadPerson: 'Musicians / DJ',
          notes: 'Joyful music, dessert table open, celebratory social time.'
        },
        {
          time: '22:00',
          activity: 'Farewell Send-Off & Wrap-Up',
          responsibleHat: 'professional',
          leadPerson: 'Coordinator & Volunteer Team',
          notes: 'Guest favors distributed, venue breakdown begins.'
        }
      ],
      decorAndCateringIdeas: {
        decorHighlights: [
          'Eco-friendly botanical table runners featuring seasonal greenery and local flowers',
          'Soft warm-white accent lighting, fairy lights, and candles in hurricane glass',
          'Personalized handwritten welcome mirrors or wooden entryway easels'
        ],
        signatureMenuConcepts: [
          'Seasonal farm-to-table banquet featuring fresh local ingredients',
          'Artisanal tasting platter with savory bites and vibrant vegetarian options',
          'Celebration dessert station with regional cakes and fresh fruit skewers'
        ],
        beverageAndCocktailIdeas: [
          'Signature celebration spritz with fresh citrus, rosemary, and sparkling soda',
          'Artisanal cold-brew tea bar infused with elderflower and mint',
          'Custom non-alcoholic mocktail pairing for every dinner course'
        ]
      },
      contingencyChecklist: [
        {
          risk: 'Inclement Weather (Rain or Extreme Heat)',
          trigger: 'Forecast shifts 24 hours prior to outdoor segments',
          contingencyAction: 'Activate venue covered pavilion or install pop-up shade tents; ensure fans or heaters are on standby.'
        },
        {
          risk: 'Sound or Microphone Feedback / Glitch',
          trigger: 'Wireless microphone drops signal during ceremony',
          contingencyAction: 'Coordinator holds wired backup dynamic microphone and fresh 9V batteries at the soundboard.'
        },
        {
          risk: 'Guest Sudden Dietary Need',
          trigger: 'Guest mentions unrecorded allergy during banquet',
          contingencyAction: 'Kitchen maintains 5 unassigned emergency vegetarian/allergy-safe plated dinners.'
        }
      ],
      generatedAt: new Date().toISOString(),
      engine: 'Dr. T Heuristic Event Architect Engine (Offline Fallback)'
    };
  }

  // ----------------------------------------------------
  // MICROBIZ OPERATIONS LEDGER BRIDGE
  // ----------------------------------------------------

  static createMicroBizInvoicePayload(item: BudgetItem, event: GatherEvent) {
    return {
      source: 'Gather & Glow Event Manager',
      eventId: event.id,
      eventTitle: event.title,
      vendorCategory: item.category,
      description: `${item.name} (${event.title})`,
      amount: item.vendorQuotation || item.actualCost || item.estimatedCost,
      paidAmount: item.paidAmount,
      balanceDue: (item.vendorQuotation || item.actualCost) - item.paidAmount,
      currency: event.currency,
      dueDate: item.dueDate || event.date,
      status: item.paymentStatus,
      receiptNumber: item.receiptId || `REC-GG-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
  }

  // ----------------------------------------------------
  // DOSSIER EXPORT & BACKUP
  // ----------------------------------------------------

  static async exportFullDossier(eventId: string): Promise<FullEventPackage> {
    const events = await this.loadAllEvents();
    const event = events.find(e => e.id === eventId) || STARTER_EVENT;
    const budget = await this.loadBudget(eventId);
    const tasks = await this.loadTasks(eventId);
    const vendors = await this.loadVendors(eventId);
    const guests = await this.loadGuests(eventId);
    const teamRoles = await this.loadTeamRoles(eventId);
    const aiPlan = await this.loadAiPlan(eventId) || undefined;

    return {
      event,
      budget,
      tasks,
      vendors,
      guests,
      teamRoles,
      aiPlan
    };
  }

  static generateMarkdownDossier(pkg: FullEventPackage): string {
    const { event, budget, tasks, vendors, guests, teamRoles, aiPlan } = pkg;
    const totalSpent = budget.reduce((acc, b) => acc + (b.actualCost || b.estimatedCost), 0);
    const totalPaid = budget.reduce((acc, b) => acc + b.paidAmount, 0);
    const attendingCount = guests.filter(g => g.rsvpStatus === 'attending').length;

    let md = `# 🌟 ${event.title}\n\n`;
    md += `*Celebrated with Dr. T Gather & Glow — An AI-Powered Event Planning Assistant*\n\n`;
    md += `**Date:** ${event.date} ${event.time ? `at ${event.time}` : ''}\n`;
    md += `**Location:** ${event.location} (${event.venueName || 'Venue TBD'})\n`;
    md += `**Event Type:** ${event.eventType.toUpperCase()} | **Planning Stage:** ${event.planningStage}\n`;
    md += `**Guests Expected:** ${event.expectedGuests} (Confirmed Attending: ${attendingCount})\n`;
    md += `**Total Budget:** ${event.currency} ${event.totalBudget.toLocaleString()} | **Current Allocated:** ${event.currency} ${totalSpent.toLocaleString()} | **Paid:** ${event.currency} ${totalPaid.toLocaleString()}\n`;
    md += `**Theme & Style:** ${event.themeStyle}\n`;
    if (event.culturalPreferences) {
      md += `**Cultural Heritage:** ${event.culturalPreferences}\n`;
    }
    md += `\n---\n\n`;

    md += `## 💰 Budget & Expense Breakdown\n\n`;
    md += `| Category | Item Name | Estimated | Actual / Quoted | Paid | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    budget.forEach(b => {
      md += `| ${b.category.toUpperCase()} | ${b.name} | ${b.estimatedCost} | ${b.actualCost || b.vendorQuotation} | ${b.paidAmount} | ${b.paymentStatus} |\n`;
    });
    md += `\n`;

    md += `## ⏱️ Timeline & Critical Milestones\n\n`;
    tasks.forEach(t => {
      const check = t.status === 'completed' ? '[x]' : '[ ]';
      md += `- ${check} **${t.title}** (Due: ${t.dueDate}) — *${t.assignedPersonName || 'Unassigned'}* [${t.hatType.toUpperCase()} HAT]\n`;
      if (t.description) md += `  ${t.description}\n`;
    });
    md += `\n`;

    md += `## 🤝 Verified Vendors & Contacts\n\n`;
    vendors.forEach(v => {
      md += `### ${v.name} (${v.category.toUpperCase()})\n`;
      md += `- **Contact:** ${v.contactPerson} (${v.phone || 'No phone'} | ${v.email || 'No email'})\n`;
      md += `- **Quotation:** ${event.currency} ${v.quotedPrice.toLocaleString()} (Deposit Paid: ${v.depositPaid ? 'Yes' : 'No'})\n`;
      md += `- **Status:** ${v.status} | **Notes:** ${v.notes}\n\n`;
    });

    md += `## 👥 Three Hats Team Responsibilities\n\n`;
    teamRoles.forEach(r => {
      md += `### ${r.personName} — ${r.roleTitle} [${r.hat.toUpperCase()} HAT]\n`;
      r.coreResponsibilities.forEach(resp => {
        md += `- ${resp}\n`;
      });
      md += `\n`;
    });

    md += `## 📋 Guest List & RSVPs (${guests.length} Registered)\n\n`;
    guests.forEach(g => {
      md += `- **${g.name}** (${g.rsvpStatus.toUpperCase()}) | Table: ${g.tableOrSeating || 'Unassigned'}`;
      if (g.dietaryRequirements && g.dietaryRequirements.length > 0) {
        md += ` | Dietary: ${g.dietaryRequirements.join(', ')}`;
      }
      md += `\n`;
    });

    if (aiPlan) {
      md += `\n---\n\n## 🤖 AI Event-Day Running Order\n\n`;
      aiPlan.eventDayRunningOrder.forEach(slot => {
        md += `* **${slot.time}** — ${slot.activity} (${slot.leadPerson}) [${slot.responsibleHat.toUpperCase()} HAT]\n`;
        if (slot.notes) md += `  *Note: ${slot.notes}*\n`;
      });

      md += `\n## 🛡️ Contingency & Safety Checklist\n\n`;
      aiPlan.contingencyChecklist.forEach(c => {
        md += `- **Risk:** ${c.risk}\n  - *Trigger:* ${c.trigger}\n  - *Action:* ${c.contingencyAction}\n`;
      });
    }

    md += `\n\n*Generated on ${new Date().toLocaleString()} by Dr. T Gather & Glow*`;
    return md;
  }

  // ----------------------------------------------------
  // INTERNAL LOCAL STORAGE HELPERS
  // ----------------------------------------------------

  private static saveEventsLocally(events: GatherEvent[]): void {
    safeStorage.setItem(this.getStorageKey('events'), JSON.stringify(events));
  }

  private static saveBudgetLocally(budget: BudgetItem[]): void {
    safeStorage.setItem(this.getStorageKey('budget'), JSON.stringify(budget));
  }

  private static saveTasksLocally(tasks: TimelineTask[]): void {
    safeStorage.setItem(this.getStorageKey('tasks'), JSON.stringify(tasks));
  }

  private static saveVendorsLocally(vendors: VendorRecord[]): void {
    safeStorage.setItem(this.getStorageKey('vendors'), JSON.stringify(vendors));
  }

  private static saveGuestsLocally(guests: GuestRecord[]): void {
    safeStorage.setItem(this.getStorageKey('guests'), JSON.stringify(guests));
  }

  private static saveTeamRolesLocally(roles: TeamRoleAssignment[]): void {
    safeStorage.setItem(this.getStorageKey('team_roles'), JSON.stringify(roles));
  }

  private static saveAiPlanLocally(eventId: string, plan: AIEventPlan): void {
    safeStorage.setItem(this.getStorageKey(`ai_plan_${eventId}`), JSON.stringify(plan));
  }
}
