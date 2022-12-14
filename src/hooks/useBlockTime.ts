// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext, useMemo } from 'react';

import { ApiContext } from '../context/ApiContext';
import { chainProperties } from '../global/networkConstants';
import getNetwork from '../util/getNetwork';

const network = getNetwork();
const DEFAULT_TIME = chainProperties?.[network]?.blockTime;

export default function ()  {
	const { api, apiReady } = useContext(ApiContext);

	return useMemo(() => {
		if (!api) {
			return {
				blocktime: DEFAULT_TIME
			};
		}

		if (!apiReady) {
			return {
				blocktime: DEFAULT_TIME
			};
		}

		return {
			blocktime: api.consts.babe?.expectedBlockTime.toNumber()
		};
	}, [api, apiReady]);
}
