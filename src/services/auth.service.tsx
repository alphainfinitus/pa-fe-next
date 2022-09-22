// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import jwt from 'jsonwebtoken';

import { network } from '../global/networkConstants';
import { JWTPayploadType, UserDetailsContextType } from '../types';
import { decodePostgresArray } from '../util/decodePostgressArray';
import getNetwork from '../util/getNetwork';

const NETWORK = getNetwork();

/**
 * Store the JWT token in localstorage
 * @param token the token received from the authentication header
 */
export const storeLocalStorageToken = (token: string) => {
	if(typeof localStorage != 'undefined') {
		localStorage.setItem('Authorization', token);
	}
};

/**
 * Get the the jwt from localstorage
 * if any. It might be expired
 */
export const getLocalStorageToken = (): string|null => {
	if(typeof localStorage != 'undefined') {
		return localStorage.getItem('Authorization') || null;
	}
	return null;
};

/**
 * Remove the the jwt from localstorage
 * if any.
 */
export const deleteLocalStorageToken = (): void => {
	if(typeof localStorage != 'undefined') {
		return localStorage.removeItem('Authorization');
	}
};

/**
 * Store the user information in local context and call the function to store the received token
 * @param token answered by the auth server
 * @param currentUser context data on the user
 */
export const handleTokenChange = (token: string, currentUser: UserDetailsContextType) => {
	token && storeLocalStorageToken(token);
	try {
		const tokenPayload: any = token && jwt.decode(token);

		if (tokenPayload && tokenPayload.sub) {
			const {
				sub: id,
				username,
				email,
				email_verified,
				notification,
				'https://hasura.io/jwt/claims': claims,
				web3signup
			} = tokenPayload as JWTPayploadType;

			currentUser.setUserDetailsContextState((prevState) => {
				let addresses = '';
				let defaultAddress = '';

				if (NETWORK === network.KUSAMA) {
					addresses = claims['x-hasura-kusama'];
					defaultAddress = claims['x-hasura-kusama-default'];
				}

				if (NETWORK === network.POLKADOT) {
					addresses = claims['x-hasura-polkadot'];
					defaultAddress = claims['x-hasura-polkadot-default'];
				}
				const allowed_roles = claims['x-hasura-allowed-roles'];

				return {
					...prevState,
					addresses: decodePostgresArray(addresses),
					allowed_roles,
					defaultAddress,
					email,
					email_verified,
					id: Number(id),
					notification,
					username,
					web3signup
				};
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const logout = (setUserDetailsContextState: UserDetailsContextType['setUserDetailsContextState']) => {
	deleteLocalStorageToken();
	setUserDetailsContextState((prevState) => {
		return {
			...prevState,
			addresses: [],
			allowed_roles: [],
			defaultAddress: null,
			email: null,
			email_verified: false,
			id: null,
			notification: null,
			username: null,
			web3signup: false
		};
	});
};
