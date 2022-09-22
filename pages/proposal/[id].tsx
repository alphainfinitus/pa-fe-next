// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import ProposalPost from '../../src/screens/ProposalPost';

interface Props {
  id: number
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query;

	// TODO: Run graphql queries here and pass data to post

	return {
		props: {
			id: Number(id) || 0
		}
	};
};

const PostProposalPage: NextPage<Props> = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Head>
				<title>Polkaassembly | Proposal</title>
			</Head>
			<ProposalPost id={id} />
		</>
	);
};

export default PostProposalPage;