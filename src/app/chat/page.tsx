"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState, Suspense } from "react";
import { Send, Bot, Sparkles, ImagePlus, X, Zap, HeadphonesIcon, ShoppingCart, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DefaultChatTransport, TextUIPart } from "ai";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import { ToolResult } from "@/components/chat/tool-result";
import { FadeInText } from "@/components/chat/typewriter-text";
import { SuggestionChips, INITIAL_SUGGESTIONS } from "@/components/chat/suggestion-chips";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type AgentType = 'generalist' | 'customer_service' | 'sales';

interface AgentMetadata {
    type: AgentType;
    routingMethod: string;
    confidence: string;
}

const AGENT_CONFIG = {
    generalist: {
        icon: Sparkles,
        label: "Solar Guide",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
    },
    customer_service: {
        icon: HeadphonesIcon,
        label: "Customer Support",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
    },
    sales: {
        icon: ShoppingCart,
        label: "Sales Engineer",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
    },
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ChatInterfaceContent() {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
    const [attachedImages, setAttachedImages] = useState<{ file: File; preview: string }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [currentAgent, setCurrentAgent] = useState<AgentType>('generalist');
    const [isRetrying, setIsRetrying] = useState(false);
    const hasSentFirstMessage = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const detectAgentFromMessage = (messageText: string): AgentType => {
        const lower = messageText.toLowerCase();

        // Sales indicators
        if (lower.includes('₦') || lower.includes('inverter') || lower.includes('battery') ||
            lower.includes('calculate') || lower.includes('kva') || lower.includes('price')) {
            return 'sales';
        }

        // Customer service indicators
        if (lower.includes('showroom') || lower.includes('location') || lower.includes('warranty') ||
            lower.includes('contact') || lower.includes('policy')) {
            return 'customer_service';
        }

        return 'generalist';
    };
    // Add this effect to watch for new assistant messages



    const welcomeMessage: TextUIPart = {
        type: 'text',
        text: '👋 Welcome to **SolarTech Nigeria**! I\'m here to help you with solar energy solutions.\n\nI can assist you with:\n- 🔍 Product recommendations and pricing\n- 📍 Showroom locations and contact info\n- 📚 Solar energy education\n- 🛠️ Technical system sizing\n\nHow can I help you today?',
        state: 'done'
    };

    const { messages, sendMessage, status, error, regenerate } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            credentials: 'include',
        }),
        messages: [
            {
                id: 'welcome',
                role: 'assistant',
                parts: [welcomeMessage],
            },
        ],
        onError: (error) => {
            console.error("Chat error:", error);
        },
        onFinish: async (message) => {
            // Detect agent from message content
            const textParts = (message.message.parts || [])
                .filter(p => p.type === 'text')
                .map(p => p.text)
                .join(' ');

            if (textParts) {
                const detectedAgent = detectAgentFromMessage(textParts);
                setCurrentAgent(detectedAgent);
            }

            // Fetch dynamic suggestions after AI response
            if (hasSentFirstMessage.current) {
                await fetchSuggestions();
            }
        },
    });

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage.parts) {
            // Try to detect agent from message content
            const textContent = lastMessage.parts
                .filter(p => p.type === 'text')
                .map(p => p.text)
                .join(' ');

            if (textContent) {
                const detectedAgent = detectAgentFromMessage(textContent);
                setCurrentAgent(detectedAgent);
            }
        }
    }, [messages]);

    const isLoading = status === "submitted" || status === "streaming";

    // ========================================================================
    // AUTO-SCROLL
    // ========================================================================
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isLoading]);

    // ========================================================================
    // CLEANUP
    // ========================================================================
    useEffect(() => {
        return () => {
            attachedImages.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, [attachedImages]);

    // ========================================================================
    // DYNAMIC SUGGESTIONS
    // ========================================================================
    const fetchSuggestions = async () => {
        try {
            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.slice(-5), // Last 5 messages for context
                    currentAgent
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch suggestions');

            const data = await response.json();
            if (data.suggestions && Array.isArray(data.suggestions)) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
            // Fallback suggestions based on current agent
            const fallbackSuggestions = {
                generalist: ["How do solar panels work?", "Benefits of solar energy"],
                customer_service: ["Where are your showrooms?", "What's your warranty policy?"],
                sales: ["Show me 5kVA inverters", "Calculate my power needs"],
            };
            setSuggestions(fallbackSuggestions[currentAgent] || ["Tell me more", "What else?"]);
        }
    };

    // ========================================================================
    // IMAGE HANDLING
    // ========================================================================
    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setAttachedImages(prev => {
            // Cleanup old previews
            prev.forEach(img => URL.revokeObjectURL(img.preview));
            return [{
                file,
                preview: URL.createObjectURL(file)
            }];
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    const removeImage = (index: number) => {
        setAttachedImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // ========================================================================
    // DRAG & DROP
    // ========================================================================
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isLoading) return;

        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    // ========================================================================
    // MESSAGE SUBMISSION
    // ========================================================================
    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if ((!input.trim() && attachedImages.length === 0) || isLoading) return;

        const userMessage = input;
        setInput("");
        setSuggestions([]);
        hasSentFirstMessage.current = true;

        // If there are images, convert to base64 and include in message
        if (attachedImages.length > 0) {
            try {
                const imagePromises = attachedImages.map(async (img) => {
                    const base64 = await fileToBase64(img.file);
                    return {
                        type: 'image' as const,
                        image: base64,
                    };
                });

                const imageParts = await Promise.all(imagePromises);

                // Clear attached images
                attachedImages.forEach(img => URL.revokeObjectURL(img.preview));
                setAttachedImages([]);

                // Send with images
                sendMessage({
                    content: [
                        { type: 'text', text: userMessage || 'Please analyze this image.' },
                        ...imageParts
                    ]
                } as any);
            } catch (error) {
                console.error('Failed to process image:', error);
                alert('Failed to upload image. Please try again.');
            }
        } else {
            sendMessage({ text: userMessage });
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSuggestions([]);
        hasSentFirstMessage.current = true;
        sendMessage({ text: suggestion });
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await regenerate();
        } finally {
            setIsRetrying(false);
        }
    };

    // ========================================================================
    // TOOL RESULT HANDLER
    // ========================================================================
    const handleToolResult = (toolCallId: string, result: any) => {
        // This would be used if implementing interactive tool responses
        console.log('Tool result:', { toolCallId, result });
    };

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div
            className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Agent Indicator Bar */}
            <AnimatePresence>
                {hasSentFirstMessage.current && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-b border-border bg-background/80 backdrop-blur-sm"
                    >
                        <div className="max-w-3xl mx-auto px-4 py-2">
                            <div className="flex items-center gap-2 text-sm">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full",
                                    AGENT_CONFIG[currentAgent].bgColor,
                                    AGENT_CONFIG[currentAgent].borderColor,
                                    "border"
                                )}>
                                    {(() => {
                                        const Icon = AGENT_CONFIG[currentAgent].icon;
                                        return <Icon className={cn("w-4 h-4", AGENT_CONFIG[currentAgent].color)} />;
                                    })()}
                                    <span className={cn("font-medium", AGENT_CONFIG[currentAgent].color)}>
                                        {AGENT_CONFIG[currentAgent].label}
                                    </span>
                                </div>
                                <span className="text-muted-foreground">assisting you</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Container */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto relative"
            >
                {/* Drag Overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-xl flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-background/90 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 text-primary">
                                <ImagePlus className="w-10 h-10 animate-bounce" />
                                <p className="font-semibold text-lg">Drop your image here</p>
                                <p className="text-sm text-muted-foreground">Upload electricity bills, site photos, or product images</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((message, index) => {
                            const isUser = (message.role as string) === "user";
                            const isAssistant = (message.role as string) === "assistant";

                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: index === messages.length - 1 ? 0.05 : 0
                                    }}
                                    className={cn(
                                        "flex gap-3",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {/* AI Avatar */}
                                    {isAssistant && (
                                        <div className={cn(
                                            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border",
                                            AGENT_CONFIG[currentAgent].bgColor,
                                            AGENT_CONFIG[currentAgent].borderColor
                                        )}>
                                            {(() => {
                                                const Icon = AGENT_CONFIG[currentAgent].icon;
                                                return <Icon className={cn("w-5 h-5", AGENT_CONFIG[currentAgent].color)} />;
                                            })()}
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
                                            isUser
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "bg-card border border-border text-card-foreground"
                                        )}
                                    >
                                        {(message.parts || []).map((part, idx) => {
                                            // Handle text content
                                            if ((part.type as string) === 'text') {
                                                const isLastMessage = index === messages.length - 1;
                                                const isMessageStreaming = isLastMessage && status === 'streaming';

                                                // Show thinking indicator while streaming with no text
                                                if (isMessageStreaming && !part.text) {
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2 py-2">
                                                            <motion.div className="flex gap-1">
                                                                {[0, 1, 2].map((i) => (
                                                                    <motion.span
                                                                        key={i}
                                                                        className="w-2 h-2 rounded-full bg-primary"
                                                                        animate={{
                                                                            scale: [1, 1.2, 1],
                                                                            opacity: [0.5, 1, 0.5],
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.6,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.2,
                                                                        }}
                                                                    />
                                                                ))}
                                                            </motion.div>
                                                            <span className="text-sm text-muted-foreground">
                                                                {currentAgent === 'sales' ? 'Calculating...' :
                                                                    currentAgent === 'customer_service' ? 'Searching...' :
                                                                        'Thinking...'}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                // Render markdown for assistant messages
                                                if (isAssistant) {
                                                    return (
                                                        <FadeInText key={idx}>
                                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline">
                                                                <ReactMarkdown>
                                                                    {part.text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </FadeInText>
                                                    );
                                                }

                                                // Plain text for user messages
                                                return (
                                                    <FadeInText key={idx}>
                                                        <div className="whitespace-pre-wrap">{part.text}</div>
                                                    </FadeInText>
                                                );
                                            }

                                            // Handle image parts
                                            if ((part.type as string) === 'image') {
                                                const imagePart = part as any;
                                                const imageSrc = imagePart.image || imagePart.url || imagePart.base64;

                                                if (!imageSrc) return null;

                                                return (
                                                    <div key={idx} className="mt-2 first:mt-0">
                                                        <img
                                                            src={imageSrc}
                                                            alt="Uploaded"
                                                            className="max-w-full rounded-lg max-h-64 object-contain bg-muted/30 border border-border"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                );
                                            }

                                            // Handle tool-invocation (legacy format)
                                            if ((part.type as string) === 'tool-invocation') {
                                                const invocation = (part as any).toolInvocation;
                                                return (
                                                    <div key={idx} className="mt-3 first:mt-0">
                                                        <ToolResult
                                                            toolName={invocation.toolName}
                                                            state={invocation.state}
                                                            args={invocation.args}
                                                            result={'result' in invocation ? invocation.result : undefined}
                                                            toolCallId={invocation.toolCallId}
                                                            onToolResult={handleToolResult}
                                                        />
                                                    </div>
                                                );
                                            }

                                            // Handle tool-{toolName} format (AI SDK v6)
                                            if ((part.type as string).startsWith('tool-')) {
                                                const toolPart = part as any;
                                                const toolName = (part.type as string).replace('tool-', '');
                                                return (
                                                    <div key={idx} className="mt-3 first:mt-0">
                                                        <ToolResult
                                                            toolName={toolName}
                                                            state={toolPart.state === 'output-available' ? 'result' : 'call'}
                                                            args={toolPart.input}
                                                            result={toolPart.output}
                                                            toolCallId={toolPart.toolCallId}
                                                            onToolResult={handleToolResult}
                                                        />
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>

                                    {/* User Avatar */}
                                    {isUser && (
                                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                                            <span className="text-xs font-bold text-white">You</span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Loading Indicator */}
                        {isLoading && (messages[messages.length - 1]?.role as string) === "user" && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="flex gap-3 justify-start"
                            >
                                <div className={cn(
                                    "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border",
                                    AGENT_CONFIG[currentAgent].bgColor,
                                    AGENT_CONFIG[currentAgent].borderColor
                                )}>
                                    {(() => {
                                        const Icon = AGENT_CONFIG[currentAgent].icon;
                                        return <Icon className={cn("w-5 h-5", AGENT_CONFIG[currentAgent].color)} />;
                                    })()}
                                </div>
                                <div className="bg-card rounded-2xl px-5 py-4 shadow-sm border border-border">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex justify-center"
                            >
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 max-w-md">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-destructive mb-1">
                                                Something went wrong
                                            </p>
                                            <p className="text-xs text-destructive/80 mb-3">
                                                {error.message || "Failed to process your message. Please try again."}
                                            </p>
                                            <button
                                                onClick={handleRetry}
                                                disabled={isRetrying}
                                                className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                            >
                                                {isRetrying ? 'Retrying...' : 'Try again'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Area */}
            <div className={cn(
                "border-t border-border bg-background/95 backdrop-blur-sm transition-all duration-200",
                isDragging && "bg-primary/5 border-primary"
            )}>
                <div className="max-w-3xl mx-auto">
                    {/* Suggestion Chips */}
                    <AnimatePresence>
                        {!isLoading && suggestions.length > 0 && (
                            <SuggestionChips
                                suggestions={suggestions}
                                onSelect={handleSuggestionClick}
                            />
                        )}
                    </AnimatePresence>

                    {/* Image Preview */}
                    <AnimatePresence>
                        {attachedImages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pt-3 overflow-hidden"
                            >
                                <div className="flex gap-2 flex-wrap">
                                    {attachedImages.map((img, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="relative group"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Attachment ${index + 1}`}
                                                className="h-20 w-20 object-cover rounded-lg border-2 border-border shadow-sm"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 transition-transform"
                                                aria-label="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">Remove</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="px-4 py-4">
                        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                aria-label="Upload image"
                            />

                            {/* Image upload button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading || attachedImages.length >= 1}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                                    "hover:bg-muted text-muted-foreground hover:text-foreground",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    attachedImages.length > 0 && "bg-primary/10 text-primary"
                                )}
                                title="Upload image (Max 5MB)"
                            >
                                <ImagePlus className="w-5 h-5" />
                            </button>

                            {/* Text input */}
                            <div className="flex-1 relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        attachedImages.length > 0
                                            ? "Add a message about your image..."
                                            : "Ask about solar products, prices, locations..."
                                    }
                                    className={cn(
                                        "w-full px-5 py-3.5 pr-14 rounded-full",
                                        "bg-muted/50 border border-input",
                                        "text-[15px] text-foreground placeholder:text-muted-foreground",
                                        "shadow-sm transition-all duration-200",
                                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || (!input.trim() && attachedImages.length === 0)}
                                    className={cn(
                                        "absolute right-2 top-1/2 -translate-y-1/2",
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        "transition-all duration-200",
                                        (input.trim() || attachedImages.length > 0) && !isLoading
                                            ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                    )}
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Zap className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
