// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Link from 'next/link';
import React from 'react';

import { LatestDiscussionPostsQuery } from '../../generated/graphql';
import getDefaultAddressField from '../../util/getDefaultAddressField';
import DiscussionCard from '../DiscussionCard';

interface Props {
  className?: string
  data: LatestDiscussionPostsQuery
}

const Discussions = ({ className, data }: Props) => {
	if (!data.posts || !data.posts.length) return <div>No discussion found.</div>;

	const defaultAddressField = getDefaultAddressField();

	return (
		<ul className={`${className} discussions__list`}>
			{!!data.posts &&
				data.posts.map(
					(post) => {
						return !!post?.author?.username &&
							<Link href={`/post/${post.id}`}>
								<li key={post.id} className='discussions__item'>
									{<DiscussionCard
										defaultAddress={post.author[defaultAddressField]}
										comments={post.comments_aggregate.aggregate?.count
											? post.comments_aggregate.aggregate.count.toString()
											: 'no'}
										created_at={post.created_at}
										last_update={post.last_update?.last_update}
										title={post.title || 'No title'}
										username={post.author.username}
									/>}
								</li>
							</Link>
						;
					}
				)
			}
		</ul>
	);
};

export default styled(Discussions)`
	margin-block-start: 0;
	margin-block-end: 0;

	li {
		list-style-type: none;
	}

	.discussions__item {
		cursor: pointer;
		margin: 0 0 1rem 0;
		a:hover {
			text-decoration: none;
		}
	}
`;
