// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { PrivacyPolicy } from '../../src/screens/LegalDocuments';

const PrivacyPolicyPage: NextPage<{}> = () => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Privacy Policy</title>
			</Head>
			<PrivacyPolicy />
		</>
	);
};

export default PrivacyPolicyPage;