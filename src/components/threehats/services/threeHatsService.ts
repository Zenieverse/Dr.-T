import { 
  ThreeHatsRole, 
  ThreeHatsCommitment, 
  ThreeHatsWeeklyReflection, 
  HatType,
  HatPerspectiveScores
} from '../types';
import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  setDoc,
  doc, 
  deleteDoc 
} from 'firebase/firestore';

export class ThreeHatsService {
  private static getStorageKey(type: string, userId = 'demo-user'): string {
    return `dr_t_three_hats_${type}_${userId}`;
  }

  // --------------------------------------------------------------------------
  // ROLES: LOAD, SAVE, MUTATE
  // --------------------------------------------------------------------------
  static async loadRoles(userId = 'demo-user'): Promise<ThreeHatsRole[]> {
    // 1. Try local cache first for instant UI response
    const cached = localStorage.getItem(this.getStorageKey('roles', userId));
    let initialRoles: ThreeHatsRole[] = [];
    if (cached) {
      try {
        initialRoles = JSON.parse(cached);
      } catch (e) {
        console.warn('Failed to parse cached Three Hats roles', e);
      }
    }

    // 2. If authenticated, fetch from Firestore
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(
          collection(db, 'three_hats_roles'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteRoles: ThreeHatsRole[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<ThreeHatsRole, 'id'>)
          }));
          // Update cache
          localStorage.setItem(this.getStorageKey('roles', userId), JSON.stringify(remoteRoles));
          return remoteRoles;
        }
      } catch (err) {
        console.warn('Firestore roles fetch fallback to local cache:', err);
      }
    }

    return initialRoles;
  }

  static async saveRoles(roles: ThreeHatsRole[], userId = 'demo-user'): Promise<void> {
    // Save to local cache
    localStorage.setItem(this.getStorageKey('roles', userId), JSON.stringify(roles));

    // If authenticated, sync each document to Firestore
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        for (const role of roles) {
          const roleDocRef = doc(db, 'three_hats_roles', role.id);
          await setDoc(roleDocRef, {
            ...role,
            userId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Failed to sync roles to Firestore:', err);
      }
    }
  }

  static async deleteRole(roleId: string, userId = 'demo-user'): Promise<void> {
    // Delete from Firestore if authenticated
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await deleteDoc(doc(db, 'three_hats_roles', roleId));
      } catch (err) {
        console.warn('Failed to delete role in Firestore:', err);
      }
    }
  }

  // --------------------------------------------------------------------------
  // COMMITMENTS: LOAD, SAVE, MUTATE
  // --------------------------------------------------------------------------
  static async loadCommitments(userId = 'demo-user'): Promise<ThreeHatsCommitment[]> {
    const cached = localStorage.getItem(this.getStorageKey('commitments', userId));
    let initialCommitments: ThreeHatsCommitment[] = [];
    if (cached) {
      try {
        initialCommitments = JSON.parse(cached);
      } catch (e) {
        console.warn('Failed to parse cached commitments', e);
      }
    }

    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const q = query(
          collection(db, 'three_hats_commitments'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteCommitments: ThreeHatsCommitment[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<ThreeHatsCommitment, 'id'>)
          }));
          localStorage.setItem(this.getStorageKey('commitments', userId), JSON.stringify(remoteCommitments));
          return remoteCommitments;
        }
      } catch (err) {
        console.warn('Firestore commitments fetch fallback to local cache:', err);
      }
    }

    return initialCommitments;
  }

  static async saveCommitments(commitments: ThreeHatsCommitment[], userId = 'demo-user'): Promise<void> {
    localStorage.setItem(this.getStorageKey('commitments', userId), JSON.stringify(commitments));

    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        for (const comm of commitments) {
          const commDocRef = doc(db, 'three_hats_commitments', comm.id);
          await setDoc(commDocRef, {
            ...comm,
            userId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Failed to sync commitments to Firestore:', err);
      }
    }
  }

  static async deleteCommitment(commitmentId: string, userId = 'demo-user'): Promise<void> {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await deleteDoc(doc(db, 'three_hats_commitments', commitmentId));
      } catch (err) {
        console.warn('Failed to delete commitment in Firestore:', err);
      }
    }
  }

  // --------------------------------------------------------------------------
  // WEEKLY REFLECTIONS: PERSISTENCE & HISTORY
  // --------------------------------------------------------------------------
  static async saveWeeklyReflection(
    reflection: ThreeHatsWeeklyReflection,
    userId = 'demo-user'
  ): Promise<void> {
    const listKey = this.getStorageKey('reflections_list', userId);
    const existing = localStorage.getItem(listKey);
    let list: ThreeHatsWeeklyReflection[] = [];
    if (existing) {
      try {
        list = JSON.parse(existing);
      } catch (e) {
        list = [];
      }
    }
    // Prepend new reflection
    list = [reflection, ...list.filter(r => r.id !== reflection.id)];
    localStorage.setItem(listKey, JSON.stringify(list));

    // Firestore sync
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        const refDoc = doc(db, 'three_hats_reflections', reflection.id);
        await setDoc(refDoc, {
          ...reflection,
          userId,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed to save reflection to Firestore:', err);
      }
    }
  }

  // --------------------------------------------------------------------------
  // EXPORT / BACKUP (JSON & MARKDOWN)
  // --------------------------------------------------------------------------
  static exportDataToJSON(data: {
    roles: ThreeHatsRole[];
    commitments: ThreeHatsCommitment[];
    perspectives: Record<HatType, HatPerspectiveScores>;
    latestReflection: any;
  }): string {
    const exportBundle = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'Dr. T — Three Hats Life Balance',
      ...data
    };
    return JSON.stringify(exportBundle, null, 2);
  }

  static exportDataToMarkdown(data: {
    roles: ThreeHatsRole[];
    commitments: ThreeHatsCommitment[];
    perspectives: Record<HatType, HatPerspectiveScores>;
    latestReflection: any;
  }): string {
    let md = `# 🎩 Three Hats — Life Balance & Role Map Journal\n\n`;
    md += `*Exported on: ${new Date().toLocaleDateString()} via Dr. T Commons*\n\n`;
    md += `> "One person. Three hats. Many roles. One life to balance."\n\n`;

    md += `## 1. Stated Hat Balance Perspectives (1–5 Scale)\n\n`;
    (['professional', 'personal', 'social'] as HatType[]).forEach(hat => {
      const p = data.perspectives[hat];
      md += `### ${hat.toUpperCase()} HAT\n`;
      md += `* **Importance:** ${p.importance} / 5\n`;
      md += `* **Recorded Attention:** ${p.attention} / 5\n`;
      md += `* **Satisfaction:** ${p.satisfaction} / 5\n\n`;
    });

    md += `## 2. My Mapped Roles (${data.roles.length} Total)\n\n`;
    data.roles.forEach(role => {
      md += `### ${role.name}\n`;
      md += `* **Hats:** ${role.hatIds.join(', ')}\n`;
      md += `* **Category:** ${role.category}\n`;
      md += `* **Status:** ${role.status} | **Importance:** ${role.importance} | **Energy:** ${role.energyLevel || 'neutral'}\n`;
      md += `* **Time Demand:** ${role.timeDemand || 'Flexible'}\n`;
      md += `* **Description:** ${role.description}\n`;
      if (role.values && role.values.length > 0) {
        md += `* **Values:** ${role.values.join(', ')}\n`;
      }
      if (role.commitments && role.commitments.length > 0) {
        md += `* **Commitment:** ${role.commitments.join('; ')}\n`;
      }
      md += `\n`;
    });

    md += `## 3. Active Commitments (${data.commitments.length} Total)\n\n`;
    data.commitments.forEach(c => {
      md += `* **[${c.status.toUpperCase()}]** ${c.title} (${c.roleName} — ${c.hatId})\n`;
      md += `  * *Next Action:* ${c.nextAction}\n`;
      md += `  * *Value:* ${c.personalValue}\n`;
      if (c.targetDate) md += `  * *Target Date:* ${c.targetDate}\n`;
      md += `\n`;
    });

    if (data.latestReflection) {
      md += `## 4. Latest Weekly Reflection Ritual\n\n`;
      md += `* **What was meaningful:** ${data.latestReflection.step1_meaningful}\n`;
      md += `* **Attention review:** ${data.latestReflection.step2_attentionReview}\n`;
      md += `* **Noticed conflicts:** ${data.latestReflection.step3_conflictsNoticed}\n`;
      md += `* **Appreciations:** ${data.latestReflection.step4_appreciations}\n`;
      md += `* **Realistic adjustment:** ${data.latestReflection.step5_realisticAdjustment}\n`;
      if (data.latestReflection.step6_committedActions) {
        md += `* **Committed Actions for Next Week:**\n`;
        data.latestReflection.step6_committedActions.forEach((act: string) => {
          md += `  * ${act}\n`;
        });
      }
    }

    return md;
  }
}
