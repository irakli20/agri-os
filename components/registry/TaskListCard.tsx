'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, MapPin, CalendarDays, Plane } from 'lucide-react';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { TASKS, DRONES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRunbookTemplateForOperation } from '@/lib/runbooks-data';
import { MOCK_SUPPLY_PRODUCTS } from '@/lib/supplies-store';
import { InventoryItem } from '@/lib/game-store';

export function TaskListCard() {
    const router = useRouter();
    const { getDemoFields, getStrategyFields } = useFieldStore();
    const { gameMode, weeklyChallenges, performFieldOperation, completeChallenge, buySupplies } = useGameStore();
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fields = getDemoFields();
    const gameFields = getStrategyFields();
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const getFieldName = (fieldId: string) => fields.find(f => f.id === fieldId)?.name || 'Unknown';
    const getDroneName = (droneId: string) => DRONES.find(d => d.id === droneId)?.model || 'Unknown';
    const openChallenges = weeklyChallenges.filter((c) => c.status === 'open').slice(0, 5);

    return (
        <Widget title={gameMode ? "Weekly Priorities" : "Upcoming Tasks"} className="col-span-1">
            <div className="space-y-2">
                {actionMessage && (
                    <div className={cn(
                        "rounded-lg border p-2 text-xs mb-2",
                        actionMessage.type === 'success'
                            ? "bg-green-500/10 border-green-500/30 text-green-300"
                            : "bg-red-500/10 border-red-500/30 text-red-300"
                    )}>
                        {actionMessage.text}
                    </div>
                )}
                {gameMode ? openChallenges.map((challenge) => {
                    const runbookTemplateId = getRunbookTemplateForOperation(challenge.operationId);
                    return (
                        <div
                            key={challenge.id}
                            className="flex items-start gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                challenge.priority === 'critical' && "bg-red-500/20",
                                challenge.priority === 'high' && "bg-yellow-500/20",
                                challenge.priority === 'medium' && "bg-blue-500/20"
                            )}>
                                <AlertCircle className={cn(
                                    "w-4 h-4",
                                    challenge.priority === 'critical' && "text-red-400",
                                    challenge.priority === 'high' && "text-yellow-400",
                                    challenge.priority === 'medium' && "text-blue-400"
                                )} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium uppercase tracking-wider text-primary">
                                        Weekly Priority
                                    </span>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium",
                                        challenge.priority === 'critical' && "bg-red-500/20 text-red-400",
                                        challenge.priority === 'high' && "bg-yellow-500/20 text-yellow-400",
                                        challenge.priority === 'medium' && "bg-blue-500/20 text-blue-400"
                                    )}>
                                        {challenge.priority}
                                    </span>
                                </div>

                                <p className="text-sm font-medium mb-1">{challenge.title}</p>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                    <span>+{challenge.rewardXp} XP</span>
                                    {challenge.fieldId && (
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {gameFields.find((f) => f.id === challenge.fieldId)?.name || getFieldName(challenge.fieldId)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {runbookTemplateId && (
                                    <button
                                        onClick={() => router.push(`/runbooks?template=${runbookTemplateId}`)}
                                        className="text-xs px-2.5 py-1.5 rounded bg-white/10 text-foreground hover:bg-white/15 transition-colors"
                                    >
                                        Guide
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (challenge.operationId === 'buy-seeds' || challenge.operationId === 'buy-fertilizer' || challenge.operationId === 'buy-chemical' || challenge.operationId === 'buy-fuel') {
                                            const field = challenge.fieldId ? gameFields.find(f => f.id === challenge.fieldId) : null;
                                            const category = challenge.operationId === 'buy-seeds' ? 'seeds' : 
                                                            challenge.operationId === 'buy-fertilizer' ? 'fertilizer' : 
                                                            challenge.operationId === 'buy-fuel' ? 'fuel' : 'pesticide';
                                            const products = MOCK_SUPPLY_PRODUCTS.filter(p => p.category === category && p.inStock);
                                            const product = products.find(p => p.isCornRelated) || products[0];
                                            if (product) {
                                                const item: InventoryItem = {
                                                    id: product.id,
                                                    name: product.name,
                                                    category: category === 'seeds' ? 'seed' : 
                                                              category === 'fertilizer' ? 'fertilizer' : 
                                                              category === 'fuel' ? 'fuel' : 'chemical',
                                                    quantity: 1,
                                                    unit: product.unit,
                                                };
                                                const result = buySupplies(item, product.price);
                                                if (result.success) {
                                                    completeChallenge(challenge.id);
                                                    setActionMessage({ type: 'success', text: `Purchased ${product.name}!` });
                                                } else {
                                                    setActionMessage({ type: 'error', text: result.error || 'Purchase failed.' });
                                                }
                                            } else {
                                                setActionMessage({ type: 'error', text: 'No items available.' });
                                            }
                                            return;
                                        }
                                        if (challenge.operationId && challenge.fieldId) {
                                            if (challenge.operationId.startsWith('serv-')) {
                                                router.push(`/game/marketplace/services?fieldId=${challenge.fieldId}`);
                                                return;
                                            }
                                            const result = performFieldOperation(challenge.fieldId, challenge.operationId);
                                            if (result.success) {
                                                completeChallenge(challenge.id);
                                            }
                                            return;
                                        }
                                        completeChallenge(challenge.id);
                                    }}
                                    className="text-xs px-2.5 py-1.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                                >
                                    Execute
                                </button>
                            </div>
                        </div>
                    );
                }) : TASKS.slice(0, 5).map((task) => (
                    <div
                        key={task.id}
                        className="flex items-start gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                            task.priority === 'high' && "bg-red-500/20",
                            task.priority === 'medium' && "bg-yellow-500/20",
                            task.priority === 'low' && "bg-blue-500/20"
                        )}>
                            {task.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : task.status === 'in-progress' ? (
                                <Clock className="w-4 h-4 text-blue-400" />
                            ) : (
                                <AlertCircle className={cn(
                                    "w-4 h-4",
                                    task.priority === 'high' && "text-red-400",
                                    task.priority === 'medium' && "text-yellow-400",
                                    task.priority === 'low' && "text-blue-400"
                                )} />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                                    {task.type}
                                </span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium",
                                    task.priority === 'high' && "bg-red-500/20 text-red-400",
                                    task.priority === 'medium' && "bg-yellow-500/20 text-yellow-400",
                                    task.priority === 'low' && "bg-blue-500/20 text-blue-400"
                                )}>
                                    {task.priority}
                                </span>
                            </div>

                            <p className="text-sm font-medium mb-1">{task.description}</p>

                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <Link
                                    href={`/fields/${task.fieldId}`}
                                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {getFieldName(task.fieldId)}
                                </Link>
                                <span className="inline-flex items-center gap-1">
                                    <Plane className="w-3 h-3" />
                                    {getDroneName(task.droneId).split(' ')[0]}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {new Date(task.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {gameMode && openChallenges.length === 0 && (
                    <div className="p-3 text-xs text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10">
                        No pending weekly priorities. Use Next Week to generate new planning tasks.
                    </div>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                    {gameMode ? 'Open Priorities' : 'Pending Tasks'}: {gameMode ? openChallenges.length : TASKS.filter(t => t.status === 'pending').length}
                </span>
                {!gameMode && (
                    <button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="flex items-center gap-1 text-primary hover:text-primary/90 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        Add Task
                    </button>
                )}
            </div>

            {!gameMode && (
                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    onSubmit={(task) => {
                        console.log('Task created:', task);
                    }}
                />
            )}
        </Widget>
    );
}
