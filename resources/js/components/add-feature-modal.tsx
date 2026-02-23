import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FeatureCategory {
    id: number;
    name: string;
}

interface AddFeatureModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string, categoryId: number) => Promise<void>;
    featureCategories: FeatureCategory[];
    loading?: boolean;
}

export default function AddFeatureModal({
    open,
    onClose,
    onSubmit,
    featureCategories,
    loading = false,
}: AddFeatureModalProps) {
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [errors, setErrors] = useState<{ name?: string; categoryId?: string }>({});

    // Reset on open
    useEffect(() => {
        if (open) {
            setName('');
            setCategoryId('');
            setErrors({});
        }
    }, [open]);

    if (!open) return null;

    const validate = () => {
        const newErrors: { name?: string; categoryId?: string } = {};
        if (!name.trim()) newErrors.name = 'Feature name is required.';
        if (!categoryId) newErrors.categoryId = 'Please select a category.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(name.trim(), Number(categoryId));
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal Box */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Add New Feature</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5 space-y-4">
                        {/* Feature Name */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="feature-name">
                                Feature Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="feature-name"
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                placeholder="e.g. Swimming Pool"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="feature-category">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={categoryId}
                                onValueChange={(v) => {
                                    setCategoryId(v);
                                    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: undefined }));
                                }}
                            >
                                <SelectTrigger id="feature-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {featureCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && (
                                <p className="text-sm text-red-500">{errors.categoryId}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Feature'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}