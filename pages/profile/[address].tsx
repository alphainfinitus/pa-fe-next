// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

interface Props {
  address: string,
	council: string,
	username: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { address, council, username } = context.query;

	return {
		props: {
			address: `${address}`,
			council: `${council}`,
			username: `${username}`
		}
	};
};

const Profile = dynamic(() => import('../../src/screens/Profile'), {
	ssr: false
});

const PostBountyPage: NextPage<Props> = ({ address, council, username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Profile</title>
			</Head>
			<Profile address={address} council={council} username={username} />
		</>
	);
};

export default PostBountyPage;