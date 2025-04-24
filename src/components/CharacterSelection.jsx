import { useState, useEffect } from 'react';
import {
    characterParts,
    getSelectedCharacter,
    setSelectedCharacter,
} from '../utils/characterData';

const CharacterSelection = () => {
    const [body, setBody] = useState(getSelectedCharacter().body);
    const [hat, setHat] = useState(getSelectedCharacter().hat);

    useEffect(() => {
        setSelectedCharacter(body, hat);
    }, [body, hat]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Выбор персонажа</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Тело</h3>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    {characterParts.bodies.map((b) => (
                        <img
                            key={b}
                            src={`/images/${b}`}
                            alt={b}
                            style={{
                                width: '60px',
                                cursor: 'pointer',
                                border:
                                    b === body
                                        ? '2px solid #3498db'
                                        : '2px solid transparent',
                                borderRadius: '8px',
                            }}
                            onClick={() => setBody(b)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3>Шапка</h3>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    {characterParts.hats.map((h) => (
                        <img
                            key={h}
                            src={`/images/${h}`}
                            alt={h}
                            style={{
                                width: '60px',
                                cursor: 'pointer',
                                border:
                                    h === hat
                                        ? '2px solid #e74c3c'
                                        : '2px solid transparent',
                                borderRadius: '8px',
                            }}
                            onClick={() => setHat(h)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CharacterSelection;
