// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import UndoEmailChange from '../../src/components/UndoEmailChange';

interface Props {
  token: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = context.query;

	// TODO: Run graphql queries here and pass data to post

	return {
		props: {
			token: `${token}`
		}
	};
};

const UndoEmailChangePage: NextPage<Props> = ({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Undo Email Change</title>
			</Head>
			<UndoEmailChange token={token} />
		</>
	);
};

export default UndoEmailChangePage;