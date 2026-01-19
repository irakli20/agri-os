import { useState, useRef, useCallback } from 'react';
import {
    X,
    Upload,
    Camera,
    Image as ImageIcon,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FIELDS } from '@/lib/mock-data';
import { MOCK_IMAGE_UPLOADS } from '@/types/image-upload';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedFieldId?: string;
}

export function ImageUploadModal({ isOpen, onClose, preselectedFieldId }: ImageUploadModalProps) {
    const [selectedFieldId, setSelectedFieldId] = useState<string>(preselectedFieldId || '');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleBrowseClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleSubmit = useCallback(() => {
        if (!previewUrl || !selectedFieldId) return;

        // For now, just close the modal - US-003 will add the results display
        onClose();
    }, [previewUrl, selectedFieldId, onClose]);

    const handleClearImage = useCallback(() => {
        setPreviewUrl(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Upload Pest/Disease Photo</h2>
                            <p className="text-sm text-muted-foreground">
                                AI will identify the pest or disease in your photo
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Field Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Field</label>
                        <div className="relative">
                            <select
                                value={selectedFieldId}
                                onChange={(e) => setSelectedFieldId(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Choose a field...</option>
                                {FIELDS.map(field => (
                                    <option key={field.id} value={field.id}>
                                        {field.name} - {field.crop} ({field.acres} acres)
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    {!previewUrl ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                                isDragging
                                    ? "border-primary bg-primary/10"
                                    : "border-white/20 hover:border-white/40 hover:bg-white/5"
                            )}
                            onClick={handleBrowseClick}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium">Drag and drop your image here</p>
                                    <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                                </div>
                                <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, WebP</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Image Preview */}
                            <div className="relative rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full max-h-80 object-contain bg-black/20"
                                />
                                <button
                                    onClick={handleClearImage}
                                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground truncate flex-1">{fileName}</span>
                                <button
                                    onClick={handleBrowseClick}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!previewUrl || !selectedFieldId}
                        className={cn(
                            "px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium",
                            previewUrl && selectedFieldId
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-white/10 text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        <Camera className="w-4 h-4" />
                        Identify Pest/Disease
                    </button>
                </div>
            </div>
        </div>
    );
}
