import { useEffect, useRef } from 'react';

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

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function generateState(length = 32) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let state = '';
    for (let i = 0; i < length; i++) {
        state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
}

const AuthVKID = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
        script.async = true;

        script.onload = async () => {
            if ('VKIDSDK' in window) {
                const VKID = window.VKIDSDK;

                const codeVerifier = generateCodeVerifier();
                const codeChallenge = await generateCodeChallenge(codeVerifier);
                const state = generateState();
                console.log('state', state);
                console.log('codeVerifier', codeVerifier);
                console.log('codeChallenge', codeChallenge);


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
                    .on(VKID.WidgetEvents.ERROR, vkidOnError)
                    .on(
                        VKID.OneTapInternalEvents.LOGIN_SUCCESS,
                        function (payload) {
                            const code = payload.code;
                            const deviceId = payload.device_id;
                            console.log('payload', payload);
                            VKID.Auth.exchangeCode(code, deviceId)
                                .then(vkidOnSuccess)
                                .catch(vkidOnError);
                        }
                    );

                async function vkidOnSuccess(data) {
                    console.log('vkiddata', data);
                    const personalData = await VKID.Auth.userInfo(
                        data.access_token
                    );
                    console.log('data', personalData);
                }

                function vkidOnError(error) {
                    console.error('VKID error:', error);
                }
            }
        };

        document.body.appendChild(script);
    }, []);

    return <div id="VkIdSdkOneTap" />;
};

export default AuthVKID;
