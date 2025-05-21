import React, { useState } from 'react';

export default function Onboarding({ onFinish, resourceLoader }) {
    const [step, setStep] = useState(0);
    const [controlType, setControlType] = useState(
        localStorage.getItem('controlType') || ''
    );

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else {
            if (controlType) {
                localStorage.setItem('controlType', controlType);
                onFinish(controlType);
            }
        }
    };

    const handleRadioChange = (e) => {
        setControlType(e.target.value);
    };

    const onboardingSlides = [
        {
            id: 1,
            content: (
                <div
                    className="onboarding-slide onboarding-slide-1"
                    style={{ position: 'relative' }}
                >
                    <img
                        src="/images/onboarding.png"
                        alt="Онбординг"
                        className="onboarding-image"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <img
                        src="/images/byteOnboarding.svg"
                        alt="Байт"
                        className="onboarding-image-byte"
                    />
                </div>
            ),
            button: 'Дальше',
        },
        {
            id: 2,
            content: (
                <div className="onboarding-slide onboarding-slide-2">
                    <div className="onboarding-title">
                        выбери способ управления персонажем
                    </div>
                    <div
                        className="onboarding-controls-list"
                        onChange={handleRadioChange}
                    >
                        <label
                            className={`onboarding-radio${controlType === 'arrows' ? ' onboarding-radio_active' : ''}`}
                        >
                            <input
                                type="radio"
                                name="controlType"
                                value="arrows"
                                checked={controlType === 'arrows'}
                                readOnly
                            />
                            <span className="onboarding-radio-custom" />
                            <span className="onboarding-radio-label">
                                <b>Стрелками на клавиатуре</b>
                                <span className="onboarding-radio-desc">
                                    Управляйте Байтом с помощью клавиш влево и
                                    вправо
                                </span>
                            </span>
                        </label>
                        <label
                            className={`onboarding-radio${controlType === 'click' ? ' onboarding-radio_active' : ''}`}
                        >
                            <input
                                type="radio"
                                name="controlType"
                                value="click"
                                checked={controlType === 'click'}
                                readOnly
                            />
                            <span className="onboarding-radio-custom" />
                            <span className="onboarding-radio-label">
                                <b>Кликами мыши</b>
                                <span className="onboarding-radio-desc">
                                    Кликайте по экрану слева и справа, направляя
                                    Байта
                                </span>
                            </span>
                        </label>
                    </div>
                    {controlType && (
                        <button
                            className="onboarding-btn onboarding-btn-appear"
                            onClick={handleNext}
                        >
                            Играть
                            <span className="onboarding-btn-arrow">
                                <img src="/images/play.svg" alt="Играть" />
                            </span>
                        </button>
                    )}
                </div>
            ),
            button: null,
        },
    ];

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-content">
                {onboardingSlides[step].content}
                {step === 0 && (
                    <button className="onboarding-btn" onClick={handleNext}>
                        {onboardingSlides[0].button}
                    </button>
                )}
            </div>
        </div>
    );
}
