// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

const CalendarView = dynamic(() => import('../../src/screens/CalendarView'), {
	ssr: false
});

const CalendarPage: NextPage<{}> = () => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Calendar</title>
			</Head>
			<CalendarView />
		</>
	);
};

export default CalendarPage;