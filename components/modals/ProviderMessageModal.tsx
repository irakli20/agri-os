'use client';

import { useState, useRef, useEffect } from 'react';
import {
    X,
    Send,
    Phone,
    Video,
    Star,
    CheckCircle,
    Clock,
    Paperclip,
    Image as ImageIcon,
    MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    sender: 'user' | 'provider';
    content: string;
    timestamp: Date;
    read: boolean;
}

interface ProviderMessageModalProps {
    provider: {
        name: string;
        company: string;
        phone: string;
        rating: number;
        responseTime: string;
        verified: boolean;
    };
    bookingId?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ProviderMessageModal({ provider, bookingId, isOpen, onClose }: ProviderMessageModalProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'provider',
            content: `Hi! I'm ${provider.name} from ${provider.company}. How can I help you today?`,
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            read: true,
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: message,
            timestamp: new Date(),
            read: false,
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simulate provider typing
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        setIsTyping(false);

        // Simulate provider response
        const responses = [
            "Thanks for reaching out! I'll get back to you shortly.",
            "Got it! Let me check my schedule and I'll confirm the details.",
            "Sure thing! Is there anything specific you'd like me to prepare?",
            "No problem! I'll be there as scheduled. Feel free to ask any questions.",
        ];

        const providerResponse: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'provider',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            read: true,
        };

        setMessages(prev => [...prev, providerResponse]);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg h-[600px] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                                {provider.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{provider.name}</span>
                                {provider.verified && (
                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{provider.company}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{provider.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Call">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Video">
                            <Video className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Response Time Badge */}
                <div className="px-4 py-2 bg-white/5 flex items-center justify-center gap-2 text-sm shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Typical response time: <span className="text-foreground font-medium">{provider.responseTime}</span>
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {bookingId && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm">
                            <div className="text-blue-400 font-medium mb-1">Regarding Booking</div>
                            <div className="text-muted-foreground">Booking #{bookingId}</div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex",
                                msg.sender === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2.5",
                                msg.sender === 'user'
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : "bg-white/10 rounded-bl-md"
                            )}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={cn(
                                    "text-xs mt-1",
                                    msg.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                                )}>
                                    {formatTime(msg.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <div className="flex items-end gap-2">
                        <div className="flex gap-1">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Paperclip className="w-5 h-5 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type a message..."
                                rows={1}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className={cn(
                                "p-2.5 rounded-xl transition-colors",
                                message.trim()
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
