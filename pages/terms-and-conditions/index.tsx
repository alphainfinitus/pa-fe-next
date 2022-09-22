// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { TermsAndConditions } from '../../src/screens/LegalDocuments';

const TermsAndConditionsPage: NextPage<{}> = () => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Terms and Conditions</title>
			</Head>
			<TermsAndConditions />
		</>
	);
};

export default TermsAndConditionsPage;