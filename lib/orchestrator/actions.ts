// @ts-nocheck
/**
 * Agri-OS Action Execution System
 * Execute farming operations with equipment assignment and cost tracking
 */

import { useOrchestratorStore } from '@/lib/orchestrator';
import { useGameStore, InventoryItem } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { v4 as uuidv4 } from 'uuid';
import type {
  ActionResult,
  ActionRollbackStepResult,
  Decision,
  ActionType,
  DecisionPriority,
  ActionControlMode,
} from '@/types/orchestrator';
import { canTransitionActionStatus } from './action-lifecycle';
import { isHighRiskAction } from './action-policy';
import { getActionContingencyPolicy } from './action-contingency';
import { evaluateOrchestratorGuardrails } from './policy-guardrails';

// ============================================================================
// ACTION EXECUTION RESULTS
// ============================================================================

export interface ExecutionResult {
  success: boolean;
  actionId: string;
  message: string;
  cost: number;
  duration: number; // hours
  outputs?: Record<string, any>;
  error?: string;
}

export interface EquipmentAssignment {
  equipmentId: string;
  equipmentType: string;
  operatorId?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
}

// ============================================================================
// COST CALCULATION
// ============================================================================

interface CostBreakdown {
  equipment: number;
  labor: number;
  inputs: number;
  fuel: number;
  total: number;
}

function calculateOperationCosts(
  operationType: ActionType,
  fieldId: string,
  parameters: Record<string, any>
): CostBreakdown {
  const gameStore = useGameStore.getState();
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (!field) {
    return { equipment: 0, labor: 0, inputs: 0, fuel: 0, total: 0 };
  }

  const acres = field.acres || 1;
  const baseCosts: Record<ActionType, { equipment: number; labor: number; inputs: number; fuel: number }> = {
    plant_crop: { equipment: 25, labor: 15, inputs: 120, fuel: 8 },
    apply_irrigation: { equipment: 10, labor: 5, inputs: 5, fuel: 3 },
    apply_fertilizer: { equipment: 20, labor: 12, inputs: 80, fuel: 6 },
    apply_treatment: { equipment: 18, labor: 10, inputs: 45, fuel: 5 },
    harvest: { equipment: 40, labor: 20, inputs: 0, fuel: 12 },
    scout: { equipment: 5, labor: 25, inputs: 0, fuel: 2 },
    sell_product: { equipment: 0, labor: 5, inputs: 0, fuel: 0 },
    buy_inputs: { equipment: 0, labor: 0, inputs: 100, fuel: 0 },
    lease_equipment: { equipment: 50, labor: 0, inputs: 0, fuel: 0 },
    dispatch_equipment: { equipment: 30, labor: 0, inputs: 0, fuel: 8 },
    schedule_maintenance: { equipment: 0, labor: 35, inputs: 25, fuel: 0 },
    emergency_response: { equipment: 60, labor: 40, inputs: 30, fuel: 15 },
  };

  const base = baseCosts[operationType] || { equipment: 20, labor: 15, inputs: 30, fuel: 5 };

  return {
    equipment: Math.round(base.equipment * acres),
    labor: Math.round(base.labor * acres),
    inputs: Math.round(base.inputs * acres),
    fuel: Math.round(base.fuel * acres),
    total: Math.round((base.equipment + base.labor + base.inputs + base.fuel) * acres),
  };
}

// ============================================================================
// EQUIPMENT SCHEDULING
// ============================================================================

function findAvailableEquipment(
  equipmentType: string,
  requiredHours: number
): EquipmentAssignment | null {
  const gameStore = useGameStore.getState();
  const equipment = gameStore.equipment;

  // Find equipment of the right type that's ready
  const available = equipment.find(
    eq => eq.category === equipmentType && eq.status === 'ready'
  );

  if (!available) {
    return null;
  }

  const now = new Date();
  const scheduledEnd = new Date(now.getTime() + requiredHours * 60 * 60 * 1000);

  return {
    equipmentId: available.id,
    equipmentType: available.category,
    scheduledStart: now,
    scheduledEnd,
  };
}

function scheduleEquipment(
  equipmentId: string,
  hours: number
): boolean {
  const gameStore = useGameStore.getState();
  const equipmentIndex = gameStore.equipment.findIndex(eq => eq.id === equipmentId);

  if (equipmentIndex === -1) {
    return false;
  }

  // Mark equipment as in_use
  const updatedEquipment = [...gameStore.equipment];
  updatedEquipment[equipmentIndex] = {
    ...updatedEquipment[equipmentIndex],
    status: 'in_use',
  };

  useGameStore.setState({ equipment: updatedEquipment });

  // Schedule release
  setTimeout(() => {
    const currentStore = useGameStore.getState();
    const idx = currentStore.equipment.findIndex(eq => eq.id === equipmentId);
    if (idx !== -1) {
      const released = [...currentStore.equipment];
      released[idx] = { ...released[idx], status: 'ready' };
      useGameStore.setState({ equipment: released });
    }
  }, hours * 60 * 60 * 1000);

  return true;
}

// ============================================================================
// INPUT CONSUMPTION
// ============================================================================

function consumeInputs(
  operationType: ActionType,
  fieldId: string,
  parameters: Record<string, any>
): { success: boolean; consumed: InventoryItem[]; error?: string } {
  const gameStore = useGameStore.getState();
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (!field) {
    return { success: false, consumed: [], error: 'Field not found' };
  }

  const acres = field.acres || 1;
  const consumed: InventoryItem[] = [];

  // Define input requirements per acre
  const inputRequirements: Record<ActionType, Array<{ category: InventoryItem['category']; amount: number; unit: string }>> = {
    plant_crop: [{ category: 'seed', amount: 5, unit: 'kg' }],
    apply_irrigation: [{ category: 'fuel', amount: 2, unit: 'L' }],
    apply_fertilizer: [{ category: 'fertilizer', amount: 50, unit: 'kg' }],
    apply_treatment: [{ category: 'chemical', amount: 2, unit: 'L' }],
    harvest: [{ category: 'fuel', amount: 5, unit: 'L' }],
    scout: [],
    sell_product: [],
    buy_inputs: [],
    lease_equipment: [],
    dispatch_equipment: [{ category: 'fuel', amount: 3, unit: 'L' }],
    schedule_maintenance: [],
    emergency_response: [{ category: 'fuel', amount: 5, unit: 'L' }],
  };

  const requirements = inputRequirements[operationType] || [];
  const inventory = [...gameStore.inventory];

  for (const req of requirements) {
    const totalAmount = req.amount * acres;
    const available = inventory
      .filter(item => item.category === req.category)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (available < totalAmount) {
      return {
        success: false,
        consumed: [],
        error: `Insufficient ${req.category}. Need ${totalAmount} ${req.unit}, have ${available} ${req.unit}`,
      };
    }

    // Consume from inventory
    let remaining = totalAmount;
    for (let i = 0; i < inventory.length && remaining > 0; i++) {
      if (inventory[i].category === req.category) {
        const take = Math.min(remaining, inventory[i].quantity);
        inventory[i] = { ...inventory[i], quantity: inventory[i].quantity - take };
        remaining -= take;
        
        consumed.push({
          ...inventory[i],
          quantity: take,
        });
      }
    }
  }

  // Update inventory
  useGameStore.setState({ inventory: inventory.filter(item => item.quantity > 0) });

  return { success: true, consumed };
}

function restoreConsumedInputs(consumed: InventoryItem[]): { success: boolean; details: string } {
  try {
    if (!consumed.length) {
      return { success: true, details: 'No inventory consumption to restore.' };
    }

    const gameStore = useGameStore.getState();
    const updated = [...gameStore.inventory];

    for (const used of consumed) {
      const index = updated.findIndex(
        (item) =>
          item.category === used.category &&
          item.name === used.name &&
          item.unit === used.unit
      );

      if (index === -1) {
        updated.push({ ...used, quantity: used.quantity });
      } else {
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + used.quantity,
        };
      }
    }

    useGameStore.setState({ inventory: updated });
    return { success: true, details: `Restored ${consumed.length} consumed inventory item batch(es).` };
  } catch (error) {
    return {
      success: false,
      details: error instanceof Error ? error.message : 'Unknown inventory restore error',
    };
  }
}

// ============================================================================
// ACTION EXECUTORS
// ============================================================================

async function executeAction(
  actionType: ActionType,
  fieldId: string | undefined,
  parameters: Record<string, any>,
  priority: DecisionPriority
): Promise<ExecutionResult> {
  const actionId = uuidv4();
  const contingencyPolicy = getActionContingencyPolicy(actionType);
  const controlMode: ActionControlMode =
    parameters.controlMode === 'manual' || parameters.controlMode === 'assisted' || parameters.controlMode === 'autopilot'
      ? parameters.controlMode
      : priority === 'critical'
        ? 'manual'
        : 'assisted';
  const risk = isHighRiskAction(actionType, priority, parameters);
  const requiresApproval = risk.isHighRisk && controlMode !== 'manual';
  const approvalRequiredReason = requiresApproval ? (risk.reason || 'High-risk action requires explicit approval.') : undefined;
  const approvedBy = typeof parameters.approvedBy === 'string' && parameters.approvedBy.trim().length > 0
    ? parameters.approvedBy.trim()
    : undefined;

  // Create action result record
  const actionResult: ActionResult = {
    id: actionId,
    decisionId: parameters.decisionId || 'manual',
    actionType,
    status: 'proposed',
    requestedAt: new Date(),
    fieldId,
    parameters,
    cost: 0,
    controlMode,
    requiresApproval,
    approvalRequiredReason,
    approvedBy,
    contingencyPolicy,
    lifecycleHistory: [
      {
        status: 'proposed',
        timestamp: new Date(),
        note: 'Action proposed for execution',
      },
    ],
  };

  useOrchestratorStore.getState().addActionResult(actionResult);

  const transition = (nextStatus: ActionResult['status'], transitionResult?: any): void => {
    const store = useOrchestratorStore.getState();
    const current = store.completedActions.find(a => a.id === actionId);
    if (!current) return;

    if (!canTransitionActionStatus(current.status, nextStatus)) {
      store.updateActionStatus(actionId, 'failed', {
        error: `Invalid lifecycle transition attempted: ${current.status} -> ${nextStatus}`,
      });
      throw new Error(`Invalid lifecycle transition: ${current.status} -> ${nextStatus}`);
    }

    store.updateActionStatus(actionId, nextStatus, transitionResult);
  };

  const rollbackLedger: Array<{ step: string; rollback: () => { success: boolean; details: string } }> = [];

  try {
    if (useOrchestratorStore.getState().safety.emergencyStopActive) {
      transition('cancelled', {
        reason: 'Emergency stop active',
        safety: useOrchestratorStore.getState().safety,
      });
      return {
        success: false,
        actionId,
        message: 'Action blocked by active emergency stop.',
        cost: 0,
        duration: 0,
        error: 'Emergency stop active',
      };
    }

    const guardrail = evaluateOrchestratorGuardrails({
      source: 'action_dispatch',
      actionType,
      controlMode,
      priority,
      parameters,
      requestedOperation: 'dispatch',
    });
    if (guardrail.decision === 'block') {
      transition('failed', {
        error: 'Action blocked by policy guardrails.',
        guardrail,
      });
      return {
        success: false,
        actionId,
        message: 'Action blocked by policy guardrails.',
        cost: 0,
        duration: 0,
        error: guardrail.hits.map((hit) => hit.message).join(' | ') || 'Policy guardrail blocked action.',
      };
    }

    if (requiresApproval && !approvedBy) {
      throw new Error(approvalRequiredReason || 'High-risk action requires explicit approval.');
    }

    transition('approved', { note: 'Action approved for dispatch' });
    transition('dispatched', { note: 'Action dispatched to operations layer' });
    transition('acknowledged', { note: 'Action acknowledged by execution handler' });

    // Check prerequisites
    if (fieldId) {
      const field = useFieldStore.getState().gameFields.find(f => f.id === fieldId);
      if (!field) {
        throw new Error('Field not found');
      }
    }

    // Calculate costs
    const costs = calculateOperationCosts(actionType, fieldId || '', parameters);

    // Check funds
    const player = useGameStore.getState().getCurrentPlayer();
    if (player && player.balance < costs.total) {
      throw new Error(`Insufficient funds. Need $${costs.total}, have $${player.balance}`);
    }

    // Consume inputs
    if (fieldId) {
      const consumption = consumeInputs(actionType, fieldId, parameters);
      if (!consumption.success) {
        throw new Error(consumption.error || 'Input consumption failed');
      }
      if (consumption.consumed.length > 0) {
        rollbackLedger.push({
          step: 'Restore consumed inputs',
          rollback: () => restoreConsumedInputs(consumption.consumed),
        });
      }
    }

    // Deduct costs from player balance
    if (player) {
      const playerIndex = useGameStore.getState().players.findIndex(p => p.id === player.id);
      if (playerIndex !== -1) {
        const updatedPlayers = [...useGameStore.getState().players];
        updatedPlayers[playerIndex] = {
          ...player,
          balance: player.balance - costs.total,
        };
        useGameStore.setState({ players: updatedPlayers });
        rollbackLedger.push({
          step: 'Refund deducted operation cost',
          rollback: () => {
            const latest = useGameStore.getState();
            const rollbackPlayerIdx = latest.players.findIndex(p => p.id === player.id);
            if (rollbackPlayerIdx === -1) {
              return { success: false, details: 'Player not found for refund.' };
            }

            const revertedPlayers = [...latest.players];
            revertedPlayers[rollbackPlayerIdx] = {
              ...revertedPlayers[rollbackPlayerIdx],
              balance: revertedPlayers[rollbackPlayerIdx].balance + costs.total,
            };
            useGameStore.setState({ players: revertedPlayers });
            return { success: true, details: `Refunded $${costs.total}.` };
          },
        });
      }
    }

    // Simulate execution time based on priority
    const baseDuration = 4; // hours
    const duration = priority === 'critical' ? baseDuration * 0.5 :
                     priority === 'high' ? baseDuration * 0.75 :
                     priority === 'low' ? baseDuration * 1.5 : baseDuration;

    // Simulate async work
    await new Promise(resolve => setTimeout(resolve, 100));

    // Update action result
    transition('completed', {
      costs,
      duration,
      outputs: generateOutputs(actionType, fieldId, parameters),
    });

    return {
      success: true,
      actionId,
      message: `${actionType} completed successfully`,
      cost: costs.total,
      duration,
      outputs: generateOutputs(actionType, fieldId, parameters),
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const rollbackStepResults: ActionRollbackStepResult[] = [];
    let rollbackApplied = false;

    if (contingencyPolicy.rollbackEnabled && contingencyPolicy.autoRollbackOnFailure && rollbackLedger.length > 0) {
      for (const entry of [...rollbackLedger].reverse()) {
        const rollbackResult = entry.rollback();
        rollbackStepResults.push({
          step: entry.step,
          success: rollbackResult.success,
          details: rollbackResult.details,
        });
      }
      rollbackApplied = rollbackStepResults.every((step) => step.success);
    }

    const current = useOrchestratorStore.getState().completedActions.find(a => a.id === actionId);
    if (current && current.status !== 'failed' && current.status !== 'completed' && current.status !== 'cancelled') {
      useOrchestratorStore.getState().updateActionStatus(actionId, 'failed', {
        error: errorMessage,
        contingencyPolicy,
        rollback: {
          attempted: contingencyPolicy.rollbackEnabled && contingencyPolicy.autoRollbackOnFailure,
          applied: rollbackApplied,
          stepResults: rollbackStepResults,
          summary: rollbackStepResults.length
            ? (rollbackApplied ? 'Rollback completed for reversible mutations.' : 'Rollback partially failed; operator review required.')
            : 'No rollback actions were necessary or configured.',
          attemptedAt: new Date(),
        },
      });
    }

    return {
      success: false,
      actionId,
      message: rollbackApplied
        ? `Action failed: ${errorMessage}. Contingency rollback applied.`
        : `Action failed: ${errorMessage}`,
      cost: 0,
      duration: 0,
      error: errorMessage,
    };
  }
}

function generateOutputs(
  actionType: ActionType,
  fieldId: string | undefined,
  parameters: Record<string, any>
): Record<string, any> {
  const outputs: Record<string, any> = {};

  switch (actionType) {
    case 'plant_crop':
      outputs.cropEstablished = true;
      outputs.expectedYield = 8.5 + Math.random() * 2;
      outputs.growthStage = 'germination';
      break;

    case 'harvest':
      outputs.yield = 8 + Math.random() * 3;
      outputs.quality = 80 + Math.random() * 15;
      outputs.moistureContent = 12 + Math.random() * 4;
      outputs.revenue = outputs.yield * 250; // $/ton
      break;

    case 'apply_irrigation':
      outputs.waterApplied = parameters.duration * parameters.rate || 60;
      outputs.soilMoistureIncrease = 15 + Math.random() * 10;
      break;

    case 'apply_fertilizer':
      outputs.nutrientsApplied = {
        n: parameters.nitrogen || 50,
        p: parameters.phosphorus || 25,
        k: parameters.potassium || 40,
      };
      break;

    case 'sell_product':
      outputs.quantity = parameters.quantity || 100;
      outputs.price = parameters.price || 250;
      outputs.revenue = outputs.quantity * outputs.price;
      break;
  }

  return outputs;
}

// ============================================================================
// PUBLIC ACTION API
// ============================================================================

export async function executePlanting(
  fieldId: string,
  cropType: string,
  variety: string,
  parameters: {
    seedRate?: number;
    plantingDepth?: number;
    rowSpacing?: number;
    decisionId?: string;
    priority?: DecisionPriority;
  } = {}
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'high';
  
  // Update field state
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (field) {
    fieldStore.updateField(fieldId, {
      ...field,
      crop: cropType,
      farmingStage: 'growing',
      growthProgress: 0,
      plantedAt: new Date().toISOString(),
    });
  }

  return executeAction('plant_crop', fieldId, {
    cropType,
    variety,
    ...parameters,
  }, priority);
}

export async function executeIrrigation(
  fieldId: string,
  parameters: {
    duration: number; // hours
    rate?: number; // mm/hour
    method?: 'drip' | 'sprinkler' | 'flood';
    decisionId?: string;
    priority?: DecisionPriority;
  }
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'high';

  // Update field moisture
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (field) {
    const waterApplied = parameters.duration * (parameters.rate || 15);
    const moistureIncrease = waterApplied / 10; // Simplified
    
    fieldStore.updateField(fieldId, {
      ...field,
      soilMoisture: Math.min(100, (field.soilMoisture || 50) + moistureIncrease),
    });
  }

  return executeAction('apply_irrigation', fieldId, parameters, priority);
}

export async function executeFertilizing(
  fieldId: string,
  parameters: {
    fertilizerType: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    applicationMethod?: 'broadcast' | 'foliar' | 'fertigation';
    decisionId?: string;
    priority?: DecisionPriority;
  }
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'medium';

  // Update field nutrient status
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (field) {
    fieldStore.updateField(fieldId, {
      ...field,
      inputStatus: {
        ...field.inputStatus,
        needsNutrients: false,
      },
    });
  }

  return executeAction('apply_fertilizer', fieldId, parameters, priority);
}

export async function executeSpraying(
  fieldId: string,
  parameters: {
    chemicalType: string;
    rate: number;
    target: 'weeds' | 'pests' | 'disease' | 'growth_regulator';
    weatherWindow?: { minWind: number; maxWind: number; noRainHours: number };
    decisionId?: string;
    priority?: DecisionPriority;
  }
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'high';

  // Update field protection status
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (field) {
    fieldStore.updateField(fieldId, {
      ...field,
      inputStatus: {
        ...field.inputStatus,
        needsProtection: false,
      },
    });
  }

  return executeAction('apply_treatment', fieldId, parameters, priority);
}

export async function executeHarvesting(
  fieldId: string,
  parameters: {
    moistureTarget?: number;
    equipmentType?: 'combine' | 'stripper' | 'picker';
    decisionId?: string;
    priority?: DecisionPriority;
  } = {}
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'critical';

  // Update field to harvested state
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (field) {
    fieldStore.updateField(fieldId, {
      ...field,
      farmingStage: 'fallow',
      growthProgress: 0,
      harvestedAt: new Date().toISOString(),
    });
  }

  const result = await executeAction('harvest', fieldId, parameters, priority);

  // Add yield to inventory if successful
  if (result.success && result.outputs?.yield) {
    const gameStore = useGameStore.getState();
    const cropItem: InventoryItem = {
      id: uuidv4(),
      name: `${field?.crop || 'Crop'} Harvest`,
      category: 'other',
      quantity: Math.round(result.outputs.yield * 1000), // kg
      unit: 'kg',
    };
    
    useGameStore.setState({
      inventory: [...gameStore.inventory, cropItem],
    });
  }

  return result;
}

export async function executeStorage(
  productType: string,
  quantity: number,
  parameters: {
    storageType?: 'grain_bin' | 'silo' | 'warehouse' | 'cold_storage';
    duration?: number; // days
    quality?: number;
    decisionId?: string;
    priority?: DecisionPriority;
  } = {}
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'low';

  return executeAction('sell_product', undefined, {
    productType,
    quantity,
    storage: true,
    ...parameters,
  }, priority);
}

export async function executeSale(
  productType: string,
  quantity: number,
  parameters: {
    price: number;
    buyer?: string;
    deliveryTerms?: 'ex_farm' | 'delivered';
    paymentTerms?: 'immediate' | '30_days' | '60_days';
    decisionId?: string;
    priority?: DecisionPriority;
  }
): Promise<ExecutionResult> {
  const priority = parameters.priority || 'high';

  const result = await executeAction('sell_product', undefined, {
    productType,
    quantity,
    ...parameters,
  }, priority);

  // Add revenue to player balance
  if (result.success && result.outputs?.revenue) {
    const gameStore = useGameStore.getState();
    const player = gameStore.getCurrentPlayer();
    
    if (player) {
      const playerIndex = gameStore.players.findIndex(p => p.id === player.id);
      if (playerIndex !== -1) {
        const updatedPlayers = [...gameStore.players];
        updatedPlayers[playerIndex] = {
          ...player,
          balance: player.balance + result.outputs.revenue,
        };
        useGameStore.setState({ players: updatedPlayers });
      }
    }
  }

  return result;
}

// ============================================================================
// RESULT LOGGING
// ============================================================================

export function logActionResult(
  actionId: string,
  decisionId: string,
  success: boolean,
  details: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  
  console.log(`[ActionLog] ${timestamp} - ${actionId}`, {
    decisionId,
    success,
    ...details,
  });

  // Store in localStorage for persistence
  const logs = JSON.parse(localStorage.getItem('agri-os-action-logs') || '[]');
  logs.push({
    timestamp,
    actionId,
    decisionId,
    success,
    details,
  });
  
  // Keep last 1000 logs
  if (logs.length > 1000) {
    logs.shift();
  }
  
  localStorage.setItem('agri-os-action-logs', JSON.stringify(logs));
}

export function getActionLogs(
  filter?: { decisionId?: string; success?: boolean; limit?: number }
): Array<{ timestamp: string; actionId: string; decisionId: string; success: boolean; details: any }> {
  const logs = JSON.parse(localStorage.getItem('agri-os-action-logs') || '[]');
  
  let filtered = logs;
  
  if (filter?.decisionId) {
    filtered = filtered.filter((log: any) => log.decisionId === filter.decisionId);
  }
  
  if (filter?.success !== undefined) {
    filtered = filtered.filter((log: any) => log.success === filter.success);
  }
  
  if (filter?.limit) {
    filtered = filtered.slice(-filter.limit);
  }
  
  return filtered;
}

// ============================================================================
// FEEDBACK LOOP
// ============================================================================

export function recordActionOutcome(
  actionId: string,
  outcome: {
    actualCost: number;
    actualRevenue: number;
    actualYield: number;
    quality: number;
    timeToComplete: number;
    complications?: string[];
  }
): void {
  const orchestratorStore = useOrchestratorStore.getState();
  
  // Find the action
  const action = orchestratorStore.completedActions.find(a => a.id === actionId);
  if (!action) {
    console.warn(`[Feedback] Action ${actionId} not found`);
    return;
  }

  // Find associated decision
  const decision = orchestratorStore.activeDecisions.find(d => d.id === action.decisionId);
  if (decision && decision.recommendation) {
    // Calculate prediction accuracy
    const costAccuracy = 1 - Math.abs(decision.recommendation.expectedCost - outcome.actualCost) / decision.recommendation.expectedCost;
    const revenueAccuracy = 1 - Math.abs(decision.recommendation.expectedRevenue - outcome.actualRevenue) / decision.recommendation.expectedRevenue;
    const overallAccuracy = (costAccuracy + revenueAccuracy) / 2;

    // Update decision with outcome
    const updatedDecisions = orchestratorStore.activeDecisions.map(d =>
      d.id === decision.id
        ? {
            ...d,
            outcome: {
              decisionId: d.id,
              actualCost: outcome.actualCost,
              actualRevenue: outcome.actualRevenue,
              actualROI: outcome.actualRevenue / outcome.actualCost,
              yield: outcome.actualYield,
              quality: outcome.quality,
              timeToComplete: outcome.timeToComplete,
              complications: outcome.complications || [],
              lessons: [],
              satisfaction: overallAccuracy * 100,
              wouldRepeat: overallAccuracy > 0.7,
            },
          }
        : d
    );

    useOrchestratorStore.setState({ activeDecisions: updatedDecisions });

    console.log(`[Feedback] Outcome recorded for action ${actionId}. Accuracy: ${(overallAccuracy * 100).toFixed(1)}%`);
  }
}
