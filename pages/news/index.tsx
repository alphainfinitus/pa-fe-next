// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

const NewsView = dynamic(() => import('../../src/screens/NewsView'), {
	ssr: false
});

const NewsPage: NextPage<{}> = () => {
	return (
		<>
			<Head>
				<title>Polkaassembly | News</title>
			</Head>
			<NewsView />
		</>
	);
};

export default NewsPage;