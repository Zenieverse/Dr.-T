// ============================================================================
// 🌌 GREENIEVERSE - ENDGAME OPTIMIZER
// Calculates strict payback windows and prevents stranded capital before Turn 720
// ============================================================================

import { CropType, SeasonPhase } from '../../../types/greenieverse';
import { CROP_SPECS, LIVESTOCK_SPECS } from '../constants';

export interface EndgameDirective {
  seasonPhase: SeasonPhase;
  turnsRemaining: number;
  daysRemaining: number;
  liquidationModeActive: boolean;
  permittedCrops: CropType[];
  bannedCrops: CropType[];
  livestockPurchasesPermitted: boolean;
  landExpansionPermitted: boolean;
  workerHiringPermitted: boolean;
  strategicInstruction: string;
}

export class EndgameOptimizer {
  /**
   * Evaluates the remaining turn horizon and enforces strict capital discipline.
   */
  public static evaluateEndgame(currentTurn: number, maxTurns = 720): EndgameDirective {
    const turnsRemaining = Math.max(0, maxTurns - currentTurn);
    const daysRemaining = Math.max(0, Math.ceil(turnsRemaining / 24));

    let seasonPhase: SeasonPhase = 'PHASE 1 — BOOTSTRAP';
    let liquidationModeActive = false;
    let livestockPurchasesPermitted = true;
    let landExpansionPermitted = true;
    let workerHiringPermitted = true;

    const permittedCrops: CropType[] = [];
    const bannedCrops: CropType[] = [];

    // Check each crop duration against remaining turns
    (Object.keys(CROP_SPECS) as CropType[]).forEach(type => {
      const spec = CROP_SPECS[type];
      if (turnsRemaining >= spec.growthTurns) {
        permittedCrops.push(type);
      } else {
        bannedCrops.push(type);
      }
    });

    let strategicInstruction = '';

    if (currentTurn <= 168) {
      // Days 1-7: Phase 1 Bootstrap
      seasonPhase = 'PHASE 1 — BOOTSTRAP';
      strategicInstruction = 'Accumulate liquid capital. Seed fast-turnover grains and observe opponent crop cadence.';
    } else if (currentTurn <= 432) {
      // Days 8-18: Phase 2 Scale
      seasonPhase = 'PHASE 2 — SCALE';
      strategicInstruction = 'Deploy capital into workforce automation and unlock solar quadrants. Scale into Strawberries and Melons.';
    } else if (currentTurn <= 624) {
      // Days 19-26: Phase 3 Arbitrage
      seasonPhase = 'PHASE 3 — ARBITRAGE';
      workerHiringPermitted = false;
      landExpansionPermitted = false;
      livestockPurchasesPermitted = false;
      strategicInstruction = 'Cease long-duration infrastructure outlays. Exploit supply scarcity spikes and sell into market demand peaks.';
    } else {
      // Days 27-30: Phase 4 Liquidation
      seasonPhase = 'PHASE 4 — LIQUIDATION';
      liquidationModeActive = true;
      workerHiringPermitted = false;
      landExpansionPermitted = false;
      livestockPurchasesPermitted = false;
      strategicInstruction = 'EMERGENCY LIQUIDATION: Harvest all mature crops, liquidate entire inventory stockpile to 100% Sol Credits, zero stranded capital.';
    }

    return {
      seasonPhase,
      turnsRemaining,
      daysRemaining,
      liquidationModeActive,
      permittedCrops,
      bannedCrops,
      livestockPurchasesPermitted,
      landExpansionPermitted,
      workerHiringPermitted,
      strategicInstruction,
    };
  }
}
