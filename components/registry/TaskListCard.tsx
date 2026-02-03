'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { TASKS, DRONES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useFieldStore } from '@/lib/field-store';
import Link from 'next/link';

export function TaskListCard() {
    const { fields } = useFieldStore();
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const getFieldName = (fieldId: string) => fields.find(f => f.id === fieldId)?.name || 'Unknown';
    const getDroneName = (droneId: string) => DRONES.find(d => d.id === droneId)?.model || 'Unknown';

    return (
        <Widget title="Upcoming Tasks" className="col-span-1">
            <div className="space-y-2">
                {TASKS.slice(0, 5).map((task) => (
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
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    📍 {getFieldName(task.fieldId)}
                                </Link>
                                <span>🚁 {getDroneName(task.droneId).split(' ')[0]}</span>
                                <span>📅 {new Date(task.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Pending Tasks: {TASKS.filter(t => t.status === 'pending').length}</span>
                <button
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Add Task
                </button>
            </div>

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onSubmit={(task) => {
                    console.log('Task created:', task);
                }}
            />
        </Widget>
    );
}
