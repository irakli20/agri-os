'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ReactNode } from 'react';
import { SpectrumSlider } from '@/components/registry/SpectrumSlider';
import { WeatherCard } from '@/components/registry/WeatherCard';
import { FieldStatusCard } from '@/components/registry/FieldStatusCard';

// ============================================================================
// AI State Definitions
// ============================================================================

export interface ServerMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClientMessage {
    id: number;
    role: 'user' | 'assistant';
    display: ReactNode | any; // Allow RenderResult from streamUI
}

// ============================================================================
// Server Actions
// ============================================================================

export async function submitUserMessage(content: string): Promise<ClientMessage> {
    'use server';

    const aiState = getMutableAIState<typeof AI>();

    aiState.update([
        ...aiState.get(),
        {
            role: 'user',
            content,
        },
    ]);

    // Check for API Key
    const apiKey = process.env.OPENAI_API_KEY;
    const hasApiKey = !!apiKey && apiKey !== 'your_openai_api_key_here' && !apiKey.startsWith('sk-placeholder');

    // MOCK MODE: If no API key, simulate AI response
    if (!hasApiKey) {
        console.log('⚠️ No OpenAI API Key found. Using Mock Mode.');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        let ui;
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('ndvi') || lowerContent.includes('plant health')) {
            ui = (
                <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg space-y-2">
                    <p>Switching to NDVI view to analyze plant health.</p>
                    <MapStateUpdater activeBand="ndvi" />
                    <SpectrumSlider />
                </div>
            );
        } else if (lowerContent.includes('thermal') || lowerContent.includes('heat')) {
            ui = (
                <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg space-y-2">
                    <p>Switching to Thermal band for heat stress analysis.</p>
                    <MapStateUpdater activeBand="thermal" />
                    <SpectrumSlider />
                </div>
            );
        } else if (lowerContent.includes('ndre') || lowerContent.includes('red edge')) {
            ui = (
                <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg space-y-2">
                    <p>Switching to NDRE view for nitrogen analysis.</p>
                    <MapStateUpdater activeBand="ndre" />
                    <SpectrumSlider />
                </div>
            );
        } else if (lowerContent.includes('rgb') || lowerContent.includes('visual')) {
            ui = (
                <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg space-y-2">
                    <p>Resetting to standard RGB visual view.</p>
                    <MapStateUpdater activeBand="rgb" />
                </div>
            );
        } else {
            ui = (
                <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg">
                    <p>I can help you analyze field data. Try asking to see "NDVI" or "Thermal" imagery.</p>
                </div>
            );
        }

        aiState.done([
            ...aiState.get(),
            {
                role: 'assistant',
                content: "Mock response generated.",
            },
        ]);

        return {
            id: Date.now(),
            role: 'assistant' as const,
            display: ui,
        };
    }

    // REAL MODE: Use Vercel AI SDK
    const ui = await streamUI({
        model: openai('gpt-4-turbo'),
        initial: <div className="text-sm text-muted-foreground">Thinking...</div>,
        system: `
      You are Agri-OS, an expert AI assistant for precision agriculture.
      Your user is an expert drone pilot and agronomist.
      
      You have control over a map interface and can generate UI components.
      
      AVAILABLE TOOLS:
      1. updateMapState: Change the map view (zoom, location) or active band (RGB, NDVI, Thermal).
      2. showComponent: Display a specific component from the registry (e.g., SpectrumSlider).
      
      GUIDELINES:
      - If the user asks to see "NDVI" or "plant health", use updateMapState to switch the band AND showComponent('spectrum-slider') so they can control it.
      - If the user asks about "thermal" or "heat", switch to 'thermal' band.
      - If the user asks about "red edge" or "nitrogen", switch to 'ndre' band.
      - Be concise in your text responses.
    `,
        messages: [
            ...aiState.get().map((info: any) => ({
                role: info.role,
                content: info.content,
                name: info.name,
            })),
        ],
        text: ({ content, done }) => {
            if (done) {
                aiState.done([
                    ...aiState.get(),
                    {
                        role: 'assistant',
                        content,
                    },
                ]);
            }
            return <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg">{content}</div>;
        },
        tools: {
            updateMapState: {
                description: 'Update the map view state or active spectral band',
                parameters: z.object({
                    activeBand: z.enum(['rgb', 'ndvi', 'ndre', 'thermal']).optional(),
                    zoom: z.number().optional(),
                    latitude: z.number().optional(),
                    longitude: z.number().optional(),
                }),
                generate: async ({ activeBand, zoom, latitude, longitude }) => {
                    return (
                        <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 text-sm shadow-lg">
                            <p>Updating map state...</p>
                            <MapStateUpdater
                                activeBand={activeBand}
                                zoom={zoom}
                                latitude={latitude}
                                longitude={longitude}
                            />
                        </div>
                    );
                },
            },
            showComponent: {
                description: 'Show a specific UI component from the registry',
                parameters: z.object({
                    componentId: z.enum(['spectrum-slider', 'weather-card', 'field-status-card']),
                }),
                generate: async ({ componentId }) => {
                    switch (componentId) {
                        case 'spectrum-slider':
                            return <SpectrumSlider />;
                        case 'weather-card':
                            return <WeatherCard />;
                        case 'field-status-card':
                            return <FieldStatusCard />;
                        default:
                            return <div>Component not found</div>;
                    }
                },
            },
        },
    });

    return {
        id: Date.now(),
        role: 'assistant' as const,
        display: ui,
    };
}

// ============================================================================
// Client Action Components (Bridge Server -> Client Store)
// ============================================================================

import { MapStateUpdater } from '@/components/registry/MapStateUpdater';

// ============================================================================
// AI Provider Definition
// ============================================================================

export const AI = createAI<ServerMessage[], ClientMessage[], {
    submitUserMessage: typeof submitUserMessage;
}>({
    actions: {
        submitUserMessage,
    },
    initialUIState: [],
    initialAIState: [],
});
