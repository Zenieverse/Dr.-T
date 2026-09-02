// =========================================================================
// TRIB-HOUSE SOVEREIGN STORAGE & PERSISTENCE SERVICE
// Manages Personal Forest, Reading Sessions, Notes, Leaves, and Future Letters
// =========================================================================

import { PersonalForest, ForestLeaf, ReflectionRecord, ReadingSession, FutureLetter } from '../types';
import { MOCK_FUTURE_LETTERS } from '../data/mockFutureLetters';

const STORAGE_KEY_FOREST = 'tribhouse_personal_forest_v1';
const STORAGE_KEY_FUTURE_LETTERS = 'tribhouse_future_letters_v1';

export class TribStorageService {
  private static instance: TribStorageService | null = null;

  private constructor() {}

  public static getInstance(): TribStorageService {
    if (!TribStorageService.instance) {
      TribStorageService.instance = new TribStorageService();
    }
    return TribStorageService.instance;
  }

  public getPersonalForest(): PersonalForest {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FOREST);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading personal forest from storage:', e);
    }

    // Default initialized forest
    const defaultForest: PersonalForest = {
      userId: 'user_sovereign_01',
      userName: 'Sovereign Reader',
      joinedDate: '2026-08-30',
      level: 3,
      flourishingScore: 86,
      booksRead: 4,
      leavesCount: 5,
      questionsPlanted: 12,
      treesSupported: 3,
      tCoinsBalance: 120,
      activeBranches: ['earth', 'literature', 'zen', 'mind'],
      leaves: [
        {
          id: 'leaf_1',
          title: 'Reciprocity in the Canopy',
          type: 'NOTE',
          branchId: 'earth',
          content: 'The mycorrhizal carbon debt repayment between birch and fir teaches us that competition is only half the ecological story.',
          bookTitle: 'The Hidden Life of Trees',
          createdAt: '2026-08-30T10:15:00Z',
          isPublic: true
        },
        {
          id: 'leaf_2',
          title: 'Washing the dishes while washing the dishes',
          type: 'HIGHLIGHT',
          branchId: 'zen',
          content: 'If while washing dishes, we think only of the cup of tea that awaits us, we are not alive during the time we are washing the dishes.',
          bookTitle: 'The Miracle of Mindfulness',
          createdAt: '2026-08-30T14:20:00Z',
          isPublic: true
        },
        {
          id: 'leaf_3',
          title: 'How will 2126 measure true wealth?',
          type: 'IDEA_SEED',
          branchId: 'future',
          content: 'What if gross domestic product is replaced by clean water index, soil microbial density, and intergenerational peace?',
          createdAt: '2026-08-30T18:00:00Z',
          isPublic: true
        }
      ],
      reflections: [
        {
          id: 'refl_1',
          prompt: 'What did you read today that shifted how you view the living world?',
          userResponse: 'Learning that mother trees recognize their own kin and prioritize carbon allocation to their saplings completely changed my walk through the park.',
          branchId: 'earth',
          createdAt: '2026-08-30T16:30:00Z',
          mood: 'Curious & Serene'
        }
      ],
      readingHistory: [
        {
          id: 'sess_1',
          bookId: 'book_forest_mind',
          bookTitle: 'The Hidden Life of Trees & Mycorrhizal Networks',
          startedAt: '2026-08-30T09:00:00Z',
          completedAt: '2026-08-30T09:45:00Z',
          pagesRead: 42,
          durationMinutes: 45,
          notesCount: 3
        },
        {
          id: 'sess_2',
          bookId: 'book_truyen_kieu',
          bookTitle: 'The Tale of Kiều (Truyện Kiều)',
          startedAt: '2026-08-30T11:00:00Z',
          pagesRead: 18,
          durationMinutes: 25,
          notesCount: 1
        }
      ]
    };

    this.savePersonalForest(defaultForest);
    return defaultForest;
  }

  public savePersonalForest(forest: PersonalForest) {
    try {
      localStorage.setItem(STORAGE_KEY_FOREST, JSON.stringify(forest));
    } catch (e) {
      console.warn('Error saving personal forest:', e);
    }
  }

  public addLeaf(leaf: Omit<ForestLeaf, 'id' | 'createdAt'>): ForestLeaf {
    const forest = this.getPersonalForest();
    const newLeaf: ForestLeaf = {
      ...leaf,
      id: 'leaf_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    forest.leaves.unshift(newLeaf);
    forest.leavesCount = forest.leaves.length;
    forest.flourishingScore = Math.min(100, forest.flourishingScore + 2);
    forest.tCoinsBalance += 5; // Reward participation dividend
    this.savePersonalForest(forest);
    return newLeaf;
  }

  public addReflection(prompt: string, userResponse: string, branchId: any, mood?: string): ReflectionRecord {
    const forest = this.getPersonalForest();
    const newRefl: ReflectionRecord = {
      id: 'refl_' + Date.now(),
      prompt,
      userResponse,
      branchId,
      createdAt: new Date().toISOString(),
      mood
    };
    forest.reflections.unshift(newRefl);
    forest.flourishingScore = Math.min(100, forest.flourishingScore + 3);
    forest.tCoinsBalance += 8;
    this.savePersonalForest(forest);
    return newRefl;
  }

  public recordReadingSession(session: Omit<ReadingSession, 'id' | 'startedAt'>): ReadingSession {
    const forest = this.getPersonalForest();
    const newSess: ReadingSession = {
      ...session,
      id: 'sess_' + Date.now(),
      startedAt: new Date().toISOString()
    };
    forest.readingHistory.unshift(newSess);
    forest.booksRead = new Set(forest.readingHistory.map(s => s.bookId)).size;
    forest.flourishingScore = Math.min(100, forest.flourishingScore + 4);
    forest.tCoinsBalance += Math.floor(session.durationMinutes / 5) * 2;
    this.savePersonalForest(forest);
    return newSess;
  }

  public getFutureLetters(): FutureLetter[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FUTURE_LETTERS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading future letters:', e);
    }
    return MOCK_FUTURE_LETTERS;
  }

  public saveFutureLetter(letter: Omit<FutureLetter, 'id' | 'writtenYear' | 'isSealed' | 'integrityChecksumSha256'>): FutureLetter {
    const letters = this.getFutureLetters();
    const newLetter: FutureLetter = {
      ...letter,
      id: 'letter_' + Date.now(),
      writtenYear: 2026,
      isSealed: true,
      integrityChecksumSha256: 'sha256_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    };
    letters.unshift(newLetter);
    try {
      localStorage.setItem(STORAGE_KEY_FUTURE_LETTERS, JSON.stringify(letters));
    } catch (e) {
      console.warn('Error saving future letters:', e);
    }

    // Also reward personal forest
    const forest = this.getPersonalForest();
    forest.leaves.unshift({
      id: 'leaf_future_' + Date.now(),
      title: `Sealed Future Letter to ${letter.targetYear}`,
      type: 'IDEA_SEED',
      branchId: 'future',
      content: letter.excerpt,
      createdAt: new Date().toISOString(),
      isPublic: false
    });
    forest.tCoinsBalance += 25;
    forest.treesSupported += 1;
    this.savePersonalForest(forest);

    return newLetter;
  }

  public awardTCoins(amount: number, reason?: string) {
    const forest = this.getPersonalForest();
    forest.tCoinsBalance += amount;
    this.savePersonalForest(forest);
  }

  public deductTCoins(amount: number, reason?: string): boolean {
    const forest = this.getPersonalForest();
    if (forest.tCoinsBalance >= amount) {
      forest.tCoinsBalance -= amount;
      this.savePersonalForest(forest);
      return true;
    }
    return false;
  }

  public recordTreeSupport(treeCount: number) {
    const forest = this.getPersonalForest();
    forest.treesSupported += treeCount;
    forest.flourishingScore = Math.min(100, forest.flourishingScore + treeCount * 2);
    this.savePersonalForest(forest);
  }
}

export const tribStorage = TribStorageService.getInstance();
