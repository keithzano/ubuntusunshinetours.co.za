import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MediaFile {
    file: File;
    id: string;
    preview: string;
    type: 'image' | 'video';
}

interface MediaUploadProps {
    value: MediaFile[];
    onChange: (files: MediaFile[]) => void;
    maxFiles?: number;
    accept?: string;
}

export default function MediaUpload({ 
    value = [], 
    onChange, 
    maxFiles = 10,
    accept = 'image/*,video/*' 
}: MediaUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = (files: FileList) => {
        const newFiles: MediaFile[] = [];
        
        Array.from(files).forEach((file) => {
            if (value.length + newFiles.length >= maxFiles) return;
            
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            if (!isImage && !isVideo) return;
            
            const preview = isImage ? URL.createObjectURL(file) : '';
            
            newFiles.push({
                file,
                id: Math.random().toString(36).substr(2, 9),
                preview,
                type: isImage ? 'image' : 'video',
            });
        });
        
        onChange([...value, ...newFiles]);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id: string) => {
        const fileToRemove = value.find(f => f.id === id);
        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        onChange(value.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={value.length >= maxFiles}
                />
                <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                        <p className="text-lg font-medium">
                            {value.length >= maxFiles 
                                ? 'Maximum files reached' 
                                : 'Drop files here or click to upload'
                            }
                        </p>
                        <p className="text-sm text-gray-500">
                            Upload up to {maxFiles} files (images and videos)
                        </p>
                    </div>
                </div>
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {value.map((mediaFile) => (
                        <Card key={mediaFile.id} className="relative overflow-hidden">
                            <CardContent className="p-0">
                                <div className="aspect-square relative">
                                    {mediaFile.type === 'image' ? (
                                        <img
                                            src={mediaFile.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <Video className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => removeFile(mediaFile.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="absolute bottom-2 left-2">
                                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            {mediaFile.type === 'image' ? (
                                                <ImageIcon className="h-3 w-3" />
                                            ) : (
                                                <Video className="h-3 w-3" />
                                            )}
                                            {mediaFile.file.name}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
