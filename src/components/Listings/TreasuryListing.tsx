// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Link from 'next/link';
import React from 'react';

import { GetLatestDemocracyTreasuryProposalPostsQuery } from '../../generated/graphql';
import NothingFoundCard from '../../ui-components/NothingFoundCard';
import GovernanceCard from '../GovernanceCard';

interface Props {
  className?: string
  data: GetLatestDemocracyTreasuryProposalPostsQuery
}

const TreasuryProposals = ({ className, data }: Props) => {

	if (!data.posts || !data.posts.length) return <NothingFoundCard className={className} text='There are currently no active treasury proposals.'/>;

	return (
		<ul className={`${className} proposals__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_treasury_proposal_id;

					return !!post?.author?.username && post.onchain_link &&
						<li key={post.id} className='proposals__item'>
							{<Link href={`/treasury/${onchainId}`}>
								<GovernanceCard
									address={post.onchain_link.proposer_address}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: 'no'}
									onchainId={onchainId}
									status={post.onchain_link.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.[0].status}
									title={post.title}
									topic={post.topic.name}
								/>
							</Link>}
						</li>
					;
				}
			)}
		</ul>
	);
};

export default styled(TreasuryProposals)`
	margin-block-start: 0;
	margin-block-end: 0;

	li {
		list-style-type: none;
	}

	.proposals__item {
		margin: 0 0 1rem 0;
		a:hover {
			text-decoration: none;
		}
	}
`;
