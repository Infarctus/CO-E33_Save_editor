import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SearchableSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const lower = searchTerm.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(lower));
    }, [options, searchTerm]);

    // Find current selected label
    const selectedLabel = useMemo(() => {
        return options.find((o) => o.value === value)?.label || value;
    }, [options, value]);

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'relative',
                width: '100%',
                minWidth: '200px',
                fontFamily: 'inherit',
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
            }}
        >
            {/* Trigger / Display */}
            <div
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(!isOpen);
                        if (!isOpen) setTimeout(() => inputRef.current?.focus(), 50);
                    }
                }}
                style={{
                    backgroundColor: 'var(--col-1)',
                    color: 'var(--col-text-1)',
                    border: '1px solid transparent',
                    borderRadius: '8px',
                    padding: '0.4em 1em',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none',
                    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
                    transition: 'border-color 0.25s',
                }}
            >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedLabel || placeholder}
                </span>
                <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>▼</span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        backgroundColor: 'var(--col-bg)',
                        border: '1px solid var(--col-border-1)',
                        borderRadius: '8px',
                        marginTop: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Search Input */}
                    <div style={{ padding: '8px', position: 'sticky', top: 0, backgroundColor: 'var(--col-bg)', borderBottom: '1px solid var(--col-border-1)', zIndex: 10 }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--col-1)',
                                color: 'var(--col-text-1)',
                                border: '1px solid transparent',
                                borderRadius: '8px',
                                padding: '6px',
                                outline: 'none',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options List */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                style={{
                                    padding: '8px 12px',
                                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                                    backgroundColor: value === option.value ? 'var(--col-2)' : 'transparent',
                                    color: option.disabled ? 'var(--col-text-disabled)' : 'var(--col-text-1)',
                                    borderBottom: '1px solid var(--col-border-2)',
                                    transition: 'background-color 0.1s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!option.disabled) e.currentTarget.style.backgroundColor = 'var(--col-2)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!option.disabled && value !== option.value) e.currentTarget.style.backgroundColor = 'transparent';
                                    if (!option.disabled && value === option.value) e.currentTarget.style.backgroundColor = 'var(--col-2)';
                                }}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '12px', color: 'var(--col-text-disabled)', textAlign: 'center' }}>
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
