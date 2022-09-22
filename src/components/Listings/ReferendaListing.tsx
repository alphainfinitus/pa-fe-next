// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Link from 'next/link';
import React from 'react';

import { GetLatestReferendaPostsQuery } from '../../generated/graphql';
import NothingFoundCard from '../../ui-components/NothingFoundCard';
import GovernanceCard from '../GovernanceCard';

interface Props {
  className?: string
  data: GetLatestReferendaPostsQuery
}

const Referenda = ({ className, data }: Props) => {
	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentReferendum = data.posts.some((post) => {
		if(post.onchain_link?.onchain_referendum.length){
			// this breaks the loop as soon as
			// we find a post that has a referendum.
			return true;
		}
		return false;
	});

	if (!atLeastOneCurrentReferendum || noPost) return <NothingFoundCard className={className} text='There are currently no active referenda.'/>;

	return (
		<ul className={`${className} referenda__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_referendum_id;

					return !!post?.author?.username && !!post.onchain_link?.onchain_referendum.length &&
						<Link href={`/referendum/${onchainId}`}>
							<li key={post.id} className='referenda__item'>
								{
									<GovernanceCard
										address={post.onchain_link.proposer_address}
										comments={post.comments_aggregate.aggregate?.count
											? post.comments_aggregate.aggregate.count.toString()
											: 'no'}
										method={post.onchain_link.onchain_referendum[0]?.preimage?.method}
										onchainId={onchainId}
										status={post.onchain_link.onchain_referendum[0]?.referendumStatus?.[0].status}
										end={post.onchain_link.onchain_referendum[0]?.end}
										title={post.title}
										topic={post.topic.name}
									/>
								}
							</li>
						</Link>
					;
				}
			)}
		</ul>
	);
};

export default styled(Referenda)`
	margin-block-start: 0;
	margin-block-end: 0;

	li {
		list-style-type: none;
	}

	.referenda__item {
		cursor: pointer;
		margin: 0 0 1rem 0;
		a:hover {
			text-decoration: none;
		}
	}
`;
