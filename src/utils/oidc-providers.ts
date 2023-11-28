/* eslint-disable no-async-promise-executor */
import {UserManager, UserManagerSettings} from 'oidc-client-ts';
import {sleep} from './helpers';
import axios from 'axios';

const GOOGLE_CONFIG: UserManagerSettings = {
    authority: 'https://accounts.google.com',
    client_id:
        '533830427279-cspigijdu0g50c7imca5pvdbrcn2buaq.apps.googleusercontent.com',
    client_secret: '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',
    redirect_uri: `${window.location.protocol}//${window.location.host}/callback`,
    scope: 'openid email profile',
    loadUserInfo: true
};

export const GoogleProvider = new UserManager(GOOGLE_CONFIG);

export const authLogin = (email: string, password: string) => {
    return new Promise(async (res, rej) => {
        //await sleep(500);
        //if (email === 'admin@example.com' && password === 'admin') {
        //    localStorage.setItem(
        //        'authentication',
        //        JSON.stringify({profile: {email: 'admin@example.com'}})
        //    );
        //    return res({profile: {email: 'admin@example.com'}});
        //}
        //return rej({message: 'Credentials are wrong!'});
        
        try {
            const result = await axios.post('http://localhost/api/v1/login', {
                email: email,
                password: password
              });

              localStorage.setItem('jwt', result.data.token.plainTextToken);

            return res(result.data.token.plainTextToken); 
        } catch (error: any){
            return rej({message: error.response.data.message})
        }
        
    });
};

export const userRegister = (name: string, email: string, password: string, rePassword: string) => {
    return new Promise(async (res, rej) => {
        try {
            const result = await axios.post('http://localhost/api/v1/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: rePassword,
            });
            localStorage.setItem('jwt', result.data.token.plainTextToken);
            return res(result.data.token.plainTextToken); 
        } catch (error: any) {
            return rej({message: error.response.data.message})
        }
    });
}

export const isLoggedIn = () => {
    return new Promise(async (res, rej) => {
        try {
            const token = localStorage.getItem('jwt')
            axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
            const result = await axios.get('http://localhost/api/v1/user');
            return res(true)
        } catch (error: any) {
            
        }
        return res(false);
    });
}

export const getAuthStatus = () => {
    return new Promise(async (res) => {
        await sleep(500);
        try {
            let authentication = localStorage.getItem('authentication');
            if (authentication) {
                authentication = JSON.parse(authentication);
                return res(authentication);
            }
            return res(undefined);
        } catch (error) {
            return res(undefined);
        }
    });
};
