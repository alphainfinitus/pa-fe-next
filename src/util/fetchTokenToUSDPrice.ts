// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { REACT_APP_SUBSCAN_API_KEY  } from '../global/apiKeys';
import { chainProperties } from '../global/networkConstants';
import getNetwork from '../util/getNetwork';
import formatUSDWithUnits from './formatUSDWithUnits';

const NETWORK = getNetwork();

export default async function fetchTokenToUSDPrice(token: number) {

	const response = await fetch(
		`https://${NETWORK === 'kilt' ? 'spiritnet' : NETWORK}.api.subscan.io/api/open/price_converter`,
		{
			body: JSON.stringify({
				from: chainProperties[NETWORK]?.tokenSymbol,
				quote: 'USD',
				value: token
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-API-Key': REACT_APP_SUBSCAN_API_KEY || ''
			},
			method: 'POST'
		}
	);

	const responseJSON = await response.json();

	if (responseJSON['message'] == 'Success') {
		return formatUSDWithUnits(responseJSON['data']['output']);
	} else {
		return 'N/A';
	}
}
