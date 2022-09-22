// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React from 'react';

import InfoBox from '../ui-components/InfoBox';

const DefaultAddressInfoBox = () => {

	return (
		<InfoBox
			className='default-address-infobox'
			dismissable={true}
			name='defaultAddress'
			title='Default address is here!'
		>
			<p><Link href='/settings'>Visit your settings</Link> to set a default address and let other users see your on-chain identity.</p>
			<p>If you don&apos;t have any on-chain identity yet,&nbsp;
				<a href='https://wiki.polkadot.network/docs/en/mirror-learn-identity#setting-an-identity' rel='noopener noreferrer' target='_blank'>here is how to set it up</a>.</p>
		</InfoBox>
	);
};

export default DefaultAddressInfoBox;
