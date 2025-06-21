import React, { useState, useEffect } from 'react';

/**
 * Компонент для запроса разрешения на доступ к датчикам движения.
 * @param {Object} props
 * @param {Function} props.onPermissionGranted - Колбэк при успешном разрешении.
 * @param {Function} props.onPermissionDenied - Колбэк при отказе в разрешении.
 * @returns {JSX.Element|null}
 */
const MotionPermissionRequest = ({
    onPermissionGranted,
    onPermissionDenied,
}) => {
    const [showRequest, setShowRequest] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        if (
            window.DeviceMotionEvent &&
            typeof window.DeviceMotionEvent.requestPermission === 'function'
        ) {
            setShowRequest(true);
        }
    }, []);

    /**
     * Запрашивает разрешение у пользователя на доступ к датчикам движения.
     * @async
     */
    const requestPermission = async () => {
        setIsRequesting(true);
        try {
            const permissionState =
                await window.DeviceMotionEvent.requestPermission();
            if (permissionState === 'granted') {
                onPermissionGranted();
            } else {
                onPermissionDenied();
            }
        } catch (error) {
            console.error('Ошибка при запросе разрешения:', error);
            onPermissionDenied();
        } finally {
            setIsRequesting(false);
            setShowRequest(false);
        }
    };

    if (!showRequest) {
        return null;
    }

    return (
        <div className="motion-permission-overlay">
            <div className="motion-permission-window">
                <h3>Разрешить доступ к датчикам движения?</h3>
                <p>
                    Для управления игрой наклоном телефона необходимо разрешить
                    доступ к датчикам движения.
                </p>
                <div className="motion-permission-buttons">
                    <button
                        className="motion-permission-btn motion-permission-btn--allow"
                        onClick={requestPermission}
                        disabled={isRequesting}
                    >
                        {isRequesting ? 'Запрос...' : 'Разрешить'}
                    </button>
                    <button
                        className="motion-permission-btn motion-permission-btn--deny"
                        onClick={() => {
                            onPermissionDenied();
                            setShowRequest(false);
                        }}
                        disabled={isRequesting}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MotionPermissionRequest;
