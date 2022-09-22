// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useEffect, useRef } from 'react';

import {
	CommentFieldsFragment,
	DiscussionPostAndCommentsQuery,
	DiscussionPostAndCommentsQueryVariables,
	MotionPostAndCommentsQuery,
	MotionPostAndCommentsQueryVariables,
	ProposalPostAndCommentsQuery,
	ProposalPostAndCommentsQueryVariables,
	ReferendumPostAndCommentsQuery,
	ReferendumPostAndCommentsQueryVariables,
	TipPostAndCommentsQuery,
	TipPostAndCommentsQueryVariables,
	TreasuryProposalPostAndCommentsQuery,
	TreasuryProposalPostAndCommentsQueryVariables } from '../../generated/graphql';
import Avatar from '../../ui-components/Avatar';
import CreationLabel from '../../ui-components/CreationLabel';
import UpdateLabel from '../../ui-components/UpdateLabel';
import getDefaultAddressField from '../../util/getDefaultAddressField';
import EditableCommentContent from './EditableCommentContent';
import Replies from './Replies';

interface Props{
	className?: string,
	comment: CommentFieldsFragment,
	refetch: (variables?:
		ReferendumPostAndCommentsQueryVariables |
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

export const Comment = ({ className, comment, refetch } : Props) => {
	const { author, content, created_at, id, replies, updated_at } = comment;
	const commentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const hash = window.location.hash;

		if (hash === `#${id}`) {
			window.scrollTo(0, commentRef.current?.offsetTop || 0);
		}
	}, [id]);

	if (!author || !author.id || !author.username || !content) return <div>Comment not available</div>;

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div id={id} ref={commentRef} className={className}>
			<Avatar
				className='avatar'
				username={author.username}
				size={'lg'}
			/>
			<div className='comment-box'>
				<CreationLabel
					className='creation-label'
					created_at={created_at}
					defaultAddress={defaultAddress}
					text={'commented'}
					username={author.username}
				>
					<UpdateLabel
						created_at={created_at}
						updated_at={updated_at}
					/>
				</CreationLabel>
				<EditableCommentContent
					authorId={author.id}
					className='comment-content'
					comment={comment}
					commentId={id}
					content={content}
					refetch={refetch}
				/>
				<Replies className='comment-content' repliesArr={replies} refetch={refetch} />
			</div>
		</div>
	);
};

export default styled(Comment)`
	display: flex;

	.avatar {
		display: inline-block;
		flex: 0 0 4rem;
		margin-right: 2rem;
		@media only screen and (max-width: 576px) {
			display: none;
		}
	}

	.comment-box {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		margin-bottom: 1rem;
		width: calc(100% - 60px);
		word-break: break-word;

		@media only screen and (max-width: 576px) {
			width: 100%;
			border-radius: 0px;
		}
	}

	.creation-label {
		display: inline-flex;
		padding: 1rem 0 0.8rem 2rem;
		margin-bottom: 0;
	}

	.comment-content {
		padding: 0.8rem 2rem;
		width: 100%;
	}
`;
