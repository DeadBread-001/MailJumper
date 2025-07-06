import React, { useState } from 'react';
import {
    getDeviceType,
    getOnboardingKey,
    getControlTypeKey,
    isMobileDevice,
} from '../utils/deviceDetection';

/**
 * Компонент онбординга для выбора типа управления.
 * @param {Object} props
 * @param {Function} props.onFinish - Колбэк при завершении онбординга.
 * @param {Object} props.resourceLoader - Лоадер ресурсов (опционально).
 * @returns {JSX.Element}
 */
export default function Onboarding({ onFinish, resourceLoader }) {
    const [step, setStep] = useState(0);
    const deviceType = getDeviceType();
    const controlTypeKey = getControlTypeKey();

    const [controlType, setControlType] = useState(
        localStorage.getItem(controlTypeKey) || ''
    );

    /**
     * Переход к следующему шагу или завершение онбординга.
     */
    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else {
            if (controlType) {
                localStorage.setItem(controlTypeKey, controlType);
                localStorage.setItem(getOnboardingKey(), 'true');

                onFinish(controlType);
            }
        }
    };

    /**
     * Обработка выбора типа управления.
     * @param {Event} e
     */
    const handleRadioChange = (e) => {
        setControlType(e.target.value);
    };

    /**
     * Возвращает массив слайдов онбординга в зависимости от устройства.
     * @returns {Array<{id: number, content: JSX.Element, button: string|null}>}
     */
    const getOnboardingSlides = () => {
        if (isMobileDevice()) {
            return [
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
                                    className={`onboarding-radio${controlType === 'tilt' ? ' onboarding-radio_active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="controlType"
                                        value="tilt"
                                        checked={controlType === 'tilt'}
                                        readOnly
                                    />
                                    <span className="onboarding-radio-custom" />
                                    <span className="onboarding-radio-label">
                                        <b>Наклоном телефона</b>
                                        <span className="onboarding-radio-desc">
                                            Наклоняйте телефон влево и вправо
                                            для управления Байтом
                                        </span>
                                    </span>
                                </label>
                                <label
                                    className={`onboarding-radio${controlType === 'touch' ? ' onboarding-radio_active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="controlType"
                                        value="touch"
                                        checked={controlType === 'touch'}
                                        readOnly
                                    />
                                    <span className="onboarding-radio-custom" />
                                    <span className="onboarding-radio-label">
                                        <b>Нажатием на экран</b>
                                        <span className="onboarding-radio-desc">
                                            Нажимайте или удерживайте палец на
                                            экране слева и справа, направляя
                                            Байта
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    ),
                    button: null,
                },
            ];
        } else {
            return [
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
                                            Управляйте Байтом с помощью клавиш
                                            влево и вправо
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
                                            Кликайте или удерживайте кнопку мыши
                                            слева и справа, направляя Байта
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    ),
                    button: null,
                },
            ];
        }
    };

    const onboardingSlides = getOnboardingSlides();

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-content">
                <div className="onboarding-main-content">
                    {onboardingSlides[step].content}
                </div>
                <div className="onboarding-button-area">
                    {step === 0 && (
                        <button className="onboarding-btn" onClick={handleNext}>
                            {onboardingSlides[0].button}
                        </button>
                    )}
                    {step === 1 && controlType && (
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
            </div>
        </div>
    );
}
