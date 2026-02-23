import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export interface PetEssential {
    pet_type: string;
    allowed: 'yes' | 'no';
    number_allowed: string;
    icon: File | null;
    icon_url: string | null;
    existing_icon?: string | null;
}

interface PetEssentialsInputProps {
    value: PetEssential[];
    onChange: (items: PetEssential[]) => void;
    error?: string;
}

const PET_TYPE_SUGGESTIONS = [
    'Small dogs',
    'Cats',
    'Large dogs',
    'Birds',
    'Fish',
    'Rabbits',
    'Other',
];

const emptyItem = (): PetEssential => ({
    pet_type: '',
    allowed: 'yes',
    number_allowed: '',
    icon: null,
    icon_url: null,
    existing_icon: null,
});

export default function PetEssentialsInput({
    value,
    onChange,
    error,
}: PetEssentialsInputProps) {

    const addItem = () => {
        onChange([...value, emptyItem()]);
    };

    const removeItem = (index: number) => {
        const updated = value.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateItem = (
        index: number,
        field: keyof PetEssential,
        val: any
    ) => {
        const updated = value.map((item, i) =>
            i === index ? { ...item, [field]: val } : item
        );
        onChange(updated);
    };

    const handleIconChange = (index: number, file: File | null) => {
        const updated = value.map((item, i) => {
            if (i !== index) {
                return item;
            }

            return {
                ...item,
                icon: file,
                icon_url: file ? null : item.icon_url,
                existing_icon: file ? null : item.existing_icon,
            };
        });

        onChange(updated);
    };

    return (
        <div className="grid gap-3">

            {value.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                    No pet essentials added yet. Click "+ Add Pet Type" to add one.
                </p>
            )}

            {value.map((item, index) => (
                <div key={index} className='flex justify-between items-center gap-4 bg-white p-4 shadow-sm rounded-lg border '>
                    <div
                        key={index}
                        className="grid grid-cols-1 gap-3  md:grid-cols-4 items-center"
                    >

                        {/* Pet Type */}
                        <div className="grid gap-1 md:col-span-1">
                            <Label className="text-xs text-slate-500">Pet Type</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    list={`pet-type-suggestions-${index}`}
                                    value={item.pet_type}
                                    onChange={(e) =>
                                        updateItem(index, 'pet_type', e.target.value)
                                    }
                                    placeholder="e.g. Small dogs"
                                />
                                <datalist id={`pet-type-suggestions-${index}`}>
                                    {PET_TYPE_SUGGESTIONS.map((s) => (
                                        <option key={s} value={s} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="grid gap-1 md:col-span-1">
                            <Label className="text-xs text-slate-500">Icon</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleIconChange(
                                        index,
                                        e.target.files ? e.target.files[0] : null,
                                    )
                                }
                            />

                            {/* Preview */}
                            {(item.icon || item.icon_url || item.existing_icon) && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-12 w-12 overflow-hidden rounded border">
                                        {item.icon ? (
                                            <img
                                                src={URL.createObjectURL(item.icon)}
                                                alt="Selected icon preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={item.icon_url ?? item.existing_icon ?? ''}
                                                alt="Existing icon"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {item.icon ? (
                                        <p className="text-xs text-slate-500">
                                            {item.icon.name}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-500">Using saved icon</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Allowed */}
                        <div className="grid gap-1 md:col-span-1">
                            <Label className="text-xs text-slate-500">Allowed</Label>
                            <div className="flex gap-4 pt-2">
                                <label className="flex cursor-pointer items-center gap-1.5 text-sm font-normal">
                                    <input
                                        type="radio"
                                        name={`allowed-${index}`}
                                        value="yes"
                                        checked={item.allowed === 'yes'}
                                        onChange={() => updateItem(index, 'allowed', 'yes')}
                                    />
                                    <span className="text-green-600 font-medium">
                                        Allowed
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-1.5 text-sm font-normal">
                                    <input
                                        type="radio"
                                        name={`allowed-${index}`}
                                        value="no"
                                        checked={item.allowed === 'no'}
                                        onChange={() => updateItem(index, 'allowed', 'no')}
                                    />
                                    <span className="text-red-500 font-medium">
                                        Not Allowed
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Number Allowed */}
                        <div className="grid gap-1 md:col-span-1">
                            <Label className="text-xs text-slate-500">
                                Number Allowed
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                value={item.number_allowed}
                                onChange={(e) =>
                                    updateItem(index, 'number_allowed', e.target.value)
                                }
                                disabled={item.allowed === 'no'}
                                placeholder="e.g. 2"
                            />
                        </div>
                    </div>
                    {/* Remove Button */}
                    <div className="flex items-end justify-end md:col-span-1 mt-6">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={addItem}
            >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Pet Type
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}