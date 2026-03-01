import { useEffect, useMemo, useState } from 'react'

interface PriceOption {
    label: string
    min: number
    max: number
}

interface PriceRangeProps {
    options: PriceOption[]
    active?: string
    onChange: (option: PriceOption) => void
}

export default function PriceRangeSection({ options, active, onChange }: PriceRangeProps) {
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(0)

    const bounds = useMemo(() => {
        const mins = options.map((option) => option.min)
        const maxs = options.map((option) => option.max)
        return {
            min: Math.min(...mins),
            max: Math.max(...maxs),
        }
    }, [options])

    useEffect(() => {
        const fallback = options[0]
        const selected = options.find((option) => option.label === active) ?? fallback
        setMinValue(selected.min)
        setMaxValue(selected.max)
    }, [active, options])

    const handleSliderChange = (type: 'min' | 'max', value: number) => {
        if (type === 'min') {
            const next = Math.min(value, maxValue - 1)
            setMinValue(next)
        } else {
            const next = Math.max(value, minValue + 1)
            setMaxValue(next)
        }
    }

    const formatCurrency = (value: number) =>
        value >= 1000 ? `$${(value / 1000).toFixed(1)}` : `$${value}`

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <div className="mt-4">
                    <div className="relative h-1 rounded-full bg-white">
                        <div
                            className="absolute h-full rounded-full bg-[#2563eb]"
                            style={{
                                left: `${((minValue - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                                right: `${100 - ((maxValue - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                            }}
                        />

                        <input
                            type="range"
                            min={bounds.min}
                            max={bounds.max}
                            value={minValue}
                            onChange={(event) => handleSliderChange('min', Number(event.target.value))}
                            className="pointer-events-auto absolute -top-1.5 h-4 w-full cursor-pointer appearance-none bg-transparent focus:outline-none"
                            style={{ accentColor: '#2563eb' }}
                        />
                        <input
                            type="range"

                            min={bounds.min}
                            max={bounds.max}
                            value={maxValue}
                            onChange={(event) => handleSliderChange('max', Number(event.target.value))}
                            className="pointer-events-auto absolute -top-1.5 h-4 w-full cursor-pointer appearance-none bg-transparent focus:outline-none"
                            style={{ accentColor: '#2563eb' }}
                        />
                    </div>
                    <div className="mt-4 flex gap-3">
                        {[minValue, maxValue].map((value, index) => (
                            <div
                                key={index}
                                className="flex-1 rounded bg-bg-gray p-2 text-left"
                            >
                                <p className="text-lg font-semibold text-white">{formatCurrency(value)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ul className="space-y-2">
                {options.map((option) => {
                    const isActive = active === option.label

                    return (

                        <li
                            key={option.label}
                            onClick={() => onChange(option)}
                            className="flex cursor-pointer items-center gap-4"
                        >
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                                    isActive ? 'bg-white' : 'bg-white'
                                }`}
                            >
                                {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />}
                            </span>
                            <span className={`text-md ${isActive ? 'text-navy' : 'text-white'}`}>{option.label}</span>
                        </li>
                    )
                })}
            </ul>
        </div>

    )
}