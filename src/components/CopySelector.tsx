import React, { useState, ChangeEvent } from 'react';

interface CopySelectorProps {
    copies: string[];
    onCopyChange: (copy: string, isCustom: boolean) => void; // Add this line
}

function CopySelector({ copies, onCopyChange }: CopySelectorProps) { // Add onCopyChange to the destructured props
    const [selectedCopy, setSelectedCopy] = useState<string>('');
    const [isCustom, setIsCustom] = useState<boolean>(false);

    const handleCopyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedCopy(value);
        const custom = value === 'custom';
        setIsCustom(custom);
        onCopyChange(value, custom); // Call onCopyChange
    };

    return (
        <div className="copy-selector">
            {/* Mostrar lista de copys si existen */}
            {copies.length > 0 && (
                <div className="copy-list">
                    <h3>Copys Disponibles</h3>
                    <ul>
                        {copies.map((copy, index) => (
                            <li key={index}>{copy}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Campo para seleccionar copy existente o custom */}
            <div className="copy-input">
                <label htmlFor="copy-select">Seleccionar Copy:</label>
                <select id="copy-select" onChange={handleCopyChange}>
                    <option value="">Seleccionar copy existente o custom copy</option>
                    {copies.map((copy, index) => (
                        <option key={index} value={copy}>{copy}</option>
                    ))}
                    <option value="custom">Custom Copy</option>
                </select>
            </div>

            {/* Campo de prompt */}
            <div className="prompt-field">
                <label htmlFor="prompt">Prompt:</label>
                <input
                    type="text"
                    id="prompt"
                    value={isCustom ? selectedCopy : ''}
                    onChange={(e) => isCustom && setSelectedCopy(e.target.value)}
                    disabled={!isCustom}
                />
            </div>
        </div>
    );
}

export default CopySelector;