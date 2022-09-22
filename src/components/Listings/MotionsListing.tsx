// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Link from 'next/link';
import React from 'react';

import { GetLatestMotionPostsQuery } from '../../generated/graphql';
import NothingFoundCard from '../../ui-components/NothingFoundCard';
import GovernanceCard from '../GovernanceCard';

interface Props {
  className?: string
  data: GetLatestMotionPostsQuery
}

const Motions = ({ className, data }: Props) => {

	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentMotion = data.posts.some((post) => {
		if(post.onchain_link?.onchain_motion.length){
			// this breaks the loop as soon as
			// we find a post that has a motion.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentMotion) return <NothingFoundCard className={className} text='There are currently no active motions.'/>;

	return (
		<ul className={`${className} motions__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_motion_id;

					return !!post?.author?.username && !!post.onchain_link?.onchain_motion.length &&
						<Link href={`/motion/${onchainId}`}>
							<li key={post.id} className='motions__item'>
								{
									<GovernanceCard
										address={post.onchain_link.proposer_address}
										comments={post.comments_aggregate.aggregate?.count
											? post.comments_aggregate.aggregate.count.toString()
											: 'no'}
										method={post.onchain_link.onchain_motion[0]?.preimage?.method}
										onchainId={onchainId}
										status={post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status}
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

export default styled(Motions)`
	margin-block-start: 0;
	margin-block-end: 0;

	li {
		list-style-type: none;
	}

	.motions__item {
		cursor: pointer;
		margin: 0 0 1rem 0;
		a:hover {
			text-decoration: none;
		}
	}
`;
