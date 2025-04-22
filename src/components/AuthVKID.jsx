import { useEffect } from 'react';
import { signin } from '../api/auth';

const generateCodeVerifier = (length = 64) => {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let verifier = '';
    for (let i = 0; i < length; i++) {
        verifier += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }
    return verifier;
};

export function generateState(length = 32) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let state = '';
    for (let i = 0; i < length; i++) {
        state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
}

const AuthVKID = ({ onLoginSuccess }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
        script.async = true;

        script.onload = async () => {
            if ('VKIDSDK' in window) {
                const VKID = window.VKIDSDK;

                const codeVerifier = generateCodeVerifier();
                const state = generateState();

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

                const container = document.getElementById('VkIdSdkOneTap');

                oneTap
                    .render({
                        appName: 'Mail Jumper',
                        container: container,
                        scheme: VKID.Scheme.LIGHT,
                        lang: VKID.Languages.RUS,
                        styles: {
                            width: 220,
                        },
                    })
                    .on(
                        VKID.OneTapInternalEvents.LOGIN_SUCCESS,
                        async function (payload) {
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
                            const maxAge = 60 * 60 * 24 * 7; // 7 дней
                            document.cookie = `device_id=${deviceId}; max-age=${maxAge}; path=/`;
                            document.cookie = `vkid=${userData.vkid}; max-age=${maxAge}; path=/`;

                            if (onLoginSuccess) {
                                onLoginSuccess();
                            }
                        }
                    );
            }
        };

        document.body.appendChild(script);
    }, [onLoginSuccess]);

    return <div id="VkIdSdkOneTap" />;
};

export default AuthVKID;
