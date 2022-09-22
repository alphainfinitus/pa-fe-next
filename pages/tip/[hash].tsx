// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import TipPost from '../../src/screens/TipPost';

interface Props {
  hash: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { hash } = context.query;

	// TODO: Run graphql queries here and pass data to post

	return {
		props: {
			hash: `${hash}`
		}
	};
};

const PostTipPage: NextPage<Props> = ({ hash }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Tip</title>
			</Head>
			<TipPost hash={hash} />
		</>
	);
};

export default PostTipPage;