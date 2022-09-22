// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { GoCheck, GoX } from 'react-icons/go';
import { Icon } from 'semantic-ui-react';

import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
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
	TreasuryProposalPostAndCommentsQueryVariables,
	useAddCommentReplyMutation,
	useDeleteCommentMutation,
	useEditCommentMutation } from '../../generated/graphql';
import { NotificationStatus } from '../../types';
import Button from '../../ui-components/Button';
import { Form } from '../../ui-components/Form';
import Markdown from '../../ui-components/Markdown';
import copyToClipboard from '../../util/copyToClipboard';
import getNetwork from '../../util/getNetwork';
import ContentForm from '../ContentForm';
import CommentReactionBar from '../Reactionbar/CommentReactionBar';
import ReportButton from '../ReportButton';

interface Props {
	authorId: number,
	className?: string,
	comment: CommentFieldsFragment,
	commentId: string,
	content: string,
	refetch: (variables?:
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		ReferendumPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined
	) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

const EditableCommentContent = ({ authorId, className, content, commentId, refetch }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const { id } = useContext(UserDetailsContext);
	const [newContent, setNewContent] = useState(content || '');
	const toggleEdit = () => setIsEditing(!isEditing);
	const { queueNotification } = useContext(NotificationContext);
	const { control, errors, handleSubmit, setValue } = useForm();
	const router = useRouter();

	const [replyContent, setReplyContent] = useState('');
	const [isReplying, setIsReplying] = useState(false);
	const toggleReply = () => setIsReplying(!isReplying);
	const {
		control: replyControl,
		errors: replyErrors,
		handleSubmit: handleReplySubmit,
		setValue: setReplyValue
	} = useForm();

	useEffect(() => {
		isEditing && setValue('content',content);
	},[content, isEditing, setValue]);

	// For Replies
	useEffect(() => {
		isReplying && setReplyValue('replyContent',replyContent);
	},[replyContent, isReplying, setReplyValue]);

	const handleCancel = () => {
		toggleEdit();
		setNewContent(content || '');
	};

	const handleReplyCancel = () => {
		toggleReply();
		setReplyContent('');
	};

	const handleSave = () => {
		setIsEditing(false);
		editCommentMutation( {
			variables: {
				content: newContent,
				id: commentId
			} }
		)
			.then(({ data }) => {
				if (data?.update_comments && data.update_comments.affected_rows > 0){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your comment was edited.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => console.error('Error saving comment: ',e));
	};

	const handleReplySave = () => {
		if(id){
			setIsReplying(false);
			addCommentReplyMutation( {
				variables: {
					authorId: id,
					commentId: commentId,
					content: replyContent
				} }
			)
				.then(({ data }) => {
					if (data?.insert_replies && data?.insert_replies.affected_rows > 0){
						refetch();
						setReplyContent('');
						queueNotification({
							header: 'Success!',
							message: 'Your reply was added.',
							status: NotificationStatus.SUCCESS
						});
					}
				})
				.catch((e) => console.error('Error saving comment: ',e));
		}
	};

	const copyLink = () => {
		const url = `https://${getNetwork()}.polkassembly.io${router.asPath}#${commentId}`;

		copyToClipboard(url);

		queueNotification({
			header: 'Copied!',
			message: 'Comment link copied to clipboard.',
			status: NotificationStatus.SUCCESS
		});
	};
	const onContentChange = (data: Array<string>) => {setNewContent(data[0]); return data[0].length ? data[0] : null;};
	const onReplyContentChange = (data: Array<string>) => {setReplyContent(data[0]); return data[0].length ? data[0] : null;};

	const [editCommentMutation, { error, loading }] = useEditCommentMutation({
		variables: {
			content: newContent,
			id: commentId
		}
	});

	const [deleteCommentMutation] = useDeleteCommentMutation({
		variables: {
			id: commentId
		}
	});

	const deleteComment = () => {
		deleteCommentMutation( {
			variables: {
				id: commentId
			} }
		)
			.then(({ data }) => {
				if (data?.delete_comments?.affected_rows){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your comment was deleted.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => {
				console.error('Error deleting comment: ', e);

				queueNotification({
					header: 'Error!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
			});
	};

	const [addCommentReplyMutation, { error: errorReply, loading: loadingReply }] = useAddCommentReplyMutation({
		variables: {
			authorId: Number(id),
			commentId: commentId,
			content: replyContent
		}
	});

	return (
		<>
			<div className={className}>
				{error?.message && <div>{error.message}</div>}
				{
					isEditing
						?
						<Form standalone={false}>
							<Controller
								as={<ContentForm
									errorContent={errors.content}
								/>}
								name='content'
								control={control}
								onChange={onContentChange}
								rules={{ required: true }}
							/>
							<div className='button-container'>
								<Button secondary size='small' onClick={handleCancel}><GoX className='icon'/>Cancel</Button>
								<Button primary size='small' onClick={handleSubmit(handleSave)}><GoCheck className='icon' />Save</Button>
							</div>
						</Form>
						:
						<>
							<Markdown md={content} />
							<div className='actions-bar'>
								<CommentReactionBar className='reactions' commentId={commentId} />
								{id && <div className='vl'/>}
								{
									id &&
									<Button className={ isReplying ? 'social bg-blue-grey' : 'social' } onClick={toggleReply}>
										<Icon name='reply' className='icon' />Reply
									</Button>
								}
								{id && <div className='vl'/>}
								{id === authorId &&
									<Button className={'social'} disabled={loading} onClick={toggleEdit}>
										{
											loading
												? <><Icon name='spinner' className='icon'/>Editing</>
												: <><Icon name='edit' className='icon'/>Edit</>
										}
									</Button>
								}
								{id === authorId && <Button className={'social'} onClick={deleteComment}><Icon name='delete' className='icon'/>Delete</Button>}
								{id && !isEditing && <ReportButton type='comment' contentId={commentId} />}
								{<Button className={'social'} onClick={copyLink}><Icon name='chain' className='icon'/>Copy link</Button>}
							</div>
							{/* Add Reply Form*/}
							{errorReply?.message && <div>{errorReply.message}</div>}
							{
								isReplying && <Form className='replyForm' standalone={false}>
									<Controller
										as={<ContentForm
											errorContent={replyErrors.content}
										/>}
										name='replyContent'
										control={replyControl}
										onChange={onReplyContentChange}
										rules={{ required: true }}
									/>
									<div className='button-container'>
										<Button secondary size='small' disabled={ loadingReply } onClick={handleReplyCancel}><GoX className='icon'/>Cancel</Button>
										<Button primary size='small' disabled={ loadingReply } onClick={handleReplySubmit(handleReplySave)}><Icon name='reply' />Reply</Button>
									</div>
								</Form>
							}
						</>
				}
			</div>
		</>
	);
};

export default styled(EditableCommentContent)`

	.button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.actions-bar {
		display: flex;
		align-items: center;
	}

	.reactions {
		display: inline-flex;
		border: none;
		padding: 0.4rem 0;
		margin: 0rem;
	}

	.vl {
		display: inline-flex;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: grey_border;
		height: 2rem;
		margin: 0 1.2rem 0 0.8rem;
	}

	.replyForm {
		margin-top: 2rem;
	}

	.bg-blue-grey{
		background: #EBF0F5 !important;
	}
`;
