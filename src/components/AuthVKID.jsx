import { useEffect, useRef } from 'react';
import { signin } from '../api/auth';

const generateCodeVerifier = (length = 64) => {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join('');
};

export function generateState(length = 32) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join('');
}

const AuthVKID = ({ onLoginSuccess }) => {
    const oneTapRef = useRef(null);

    useEffect(() => {
        const initVKID = async () => {
            const container = document.getElementById('VkIdSdkOneTap');
            if (!container || oneTapRef.current) return; // уже инициализировано

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
