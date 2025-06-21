import { useEffect, useRef } from 'react';
import { signin } from '../api/auth';

/**
 * Генерирует случайный code verifier для OAuth 2.0 PKCE.
 * @param {number} [length=64] - Длина строки
 * @returns {string} Сгенерированный code verifier
 */
const generateCodeVerifier = (length = 64) => {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join('');
};

/**
 * Генерирует случайное состояние для OAuth 2.0.
 * @param {number} [length=32] - Длина строки
 * @returns {string} Сгенерированное состояние
 */
export function generateState(length = 32) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join('');
}

/**
 * Компонент для авторизации через VK ID.
 * @param {Object} props
 * @param {Function} props.onLoginSuccess - Колбэк при успешной авторизации
 * @returns {JSX.Element}
 */
const AuthVKID = ({ onLoginSuccess }) => {
    const oneTapRef = useRef(null);

    /**
     * Инициализирует VK ID SDK и настраивает авторизацию.
     * @async
     */
    useEffect(() => {
        const initVKID = async () => {
            const container = document.getElementById('VkIdSdkOneTap');
            if (!container || oneTapRef.current) return;

            const codeVerifier = generateCodeVerifier();
            const state = generateState();

            const VKID = window.VKIDSDK;

            VKID.Config.init({
                app: 53445034,
                redirectUrl: 'https://mail-jumper.ru',
                state: state,
                codeVerifier: codeVerifier,
                responseMode: VKID.ConfigResponseMode.Callback,
                source: VKID.ConfigSource.LOWCODE,
                scope: 'email',
            });

            const oneTap = new VKID.OneTap();
            oneTapRef.current = oneTap;

            oneTap
                .render({
                    appName: 'Mail Jumper',
                    container: container,
                    scheme: VKID.Scheme.LIGHT,
                    lang: VKID.Languages.RUS,
                    styles: { width: 220 },
                })
                .on(
                    VKID.OneTapInternalEvents.LOGIN_SUCCESS,
                    async (payload) => {
                        const code = payload.code;
                        const deviceId = payload.device_id;

                        const loginData = {
                            code_verifier: codeVerifier,
                            redirect_uri: 'https://mail-jumper.ru',
                            code: code,
                            device_id: deviceId,
                            state: state,
                        };

                        const userData = await signin(loginData);
                        const maxAge = 60 * 60 * 24 * 7;
                        document.cookie = `device_id=${deviceId}; max-age=${maxAge}; path=/`;
                        document.cookie = `vkid=${userData.vkid}; max-age=${maxAge}; path=/`;

                        if (onLoginSuccess) onLoginSuccess();

                        window.dispatchEvent(new Event('auth_success'));
                    }
                );
        };

        if (!window.VKIDSDK) {
            const existingScript = document.querySelector(
                'script[src*="@vkid/sdk"]'
            );
            if (!existingScript) {
                const script = document.createElement('script');
                script.src =
                    'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
                script.async = true;
                script.onload = initVKID;
                document.body.appendChild(script);
            } else {
                existingScript.addEventListener('load', initVKID);
            }
        } else {
            initVKID();
        }
    }, [onLoginSuccess]);

    return <div id="VkIdSdkOneTap" />;
};

export default AuthVKID;
