// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { Checkbox, CheckboxProps, Grid, Icon } from 'semantic-ui-react';

import ContentForm from '../../../src/components/ContentForm';
import TitleForm from '../../../src/components/TitleForm';
import { NotificationContext } from '../../../src/context/NotificationContext';
import { UserDetailsContext } from '../../../src/context/UserDetailsContext';
import { useCreatePollMutation, useCreatePostMutation, usePostSubscribeMutation } from '../../../src/generated/graphql';
import { usePollEndBlock } from '../../../src/hooks';
import TopicsRadio from '../../../src/screens/CreatePost/TopicsRadio';
import { NotificationStatus } from '../../../src/types';
import Button from '../../../src/ui-components/Button';
import FilteredError from '../../../src/ui-components/FilteredError';
import { Form } from '../../../src/ui-components/Form';

interface Props {
	className?: string
}

const CreatePost = ({ className }:Props): JSX.Element => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [hasPoll, setHasPoll] = useState(false);
	const { queueNotification } = useContext(NotificationContext);
	const [selectedTopic, setSetlectedTopic] = useState(1);
	const currentUser = useContext(UserDetailsContext);
	const { control, errors, handleSubmit } = useForm();

	const pollEndBlock = usePollEndBlock();
	const [createPostMutation, { loading, error }] = useCreatePostMutation();
	const [createPollMutation] = useCreatePollMutation();
	const [postSubscribeMutation] = usePostSubscribeMutation();
	const [isSending, setIsSending] = useState(false);
	const router = useRouter();

	const createSubscription = (postId: number) => {
		if (!currentUser.email_verified) {
			return;
		}

		if (!currentUser?.notification?.postCreated) {
			return;
		}

		postSubscribeMutation({
			variables: {
				postId
			}
		})
			.then(({ data }) => {
				if (data && data.postSubscribe && data.postSubscribe.message) {
					console.log(data.postSubscribe.message);
				}
			})
			.catch((e) => console.error('Error subscribing to post',e));
	};

	const createPoll = (postId: number) => {
		if (!hasPoll) {
			return;
		}

		if (!pollEndBlock) {
			queueNotification({
				header: 'Failed to get end block number. Poll creation failed!',
				message: 'Failed',
				status: NotificationStatus.ERROR
			});
			return;
		}

		createPollMutation({
			variables: {
				blockEnd: pollEndBlock,
				postId
			}
		})
			.catch((e) => console.error('Error subscribing to post',e));
	};

	const handleSend = () => {
		if (currentUser.id && title && content && selectedTopic){
			setIsSending(true);
			createPostMutation({ variables: {
				content,
				title,
				topicId: selectedTopic,
				userId: currentUser.id
			} }).then(({ data }) => {
				if (data?.insert_posts?.affected_rows && data?.insert_posts?.affected_rows > 0 && data?.insert_posts?.returning?.length && data?.insert_posts?.returning?.[0]?.id) {
					const postId = data?.insert_posts?.returning?.[0]?.id;
					router.push(`/post/${postId}`);
					queueNotification({
						header: 'Thanks for sharing!',
						message: 'Post created successfully.',
						status: NotificationStatus.SUCCESS
					});
					createSubscription(postId);
					createPoll(postId);
				} else {
					throw Error('Error in post creation');
				}
			}).catch( e => console.error(e));
		} else {
			console.error('Current userid, title, content or selected topic missing',currentUser.id, title, content, selectedTopic);
		}
	};

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>[]) => {setTitle(event[0].currentTarget.value); return event[0].currentTarget.value;};
	const onContentChange = (data: Array<string>) => {setContent(data[0]); return data[0].length ? data[0] : null;};
	const onPollChanged = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => { setHasPoll(data.checked || false);};

	return (
		<>
			<Head>
				<title>Polkassembly | Create Post</title>
			</Head>

			<Grid>
				<Grid.Column mobile={16} tablet={16} computer={12} largeScreen={10} widescreen={10}>
					<Form className={className}>
						<h3>New post</h3>
						<Controller
							as={<TitleForm
								errorTitle={errors.title}
							/>}
							control={control}
							name='title'
							onChange={onTitleChange}
							rules={{ required: true }}
						/>
						<Controller
							as={<ContentForm
								errorContent={errors.content}
							/>}
							control={control}
							name='content'
							onChange={onContentChange}
							rules={{ required: true }}
						/>

						<Form.Group>
							<Form.Field>
								<Checkbox label='Add a poll to this discussion' checked={hasPoll} toggle onChange={onPollChanged} />
							</Form.Field>
						</Form.Group>

						<TopicsRadio
							onTopicSelection={(id: number) => setSetlectedTopic(id)}
						/>

						<div className={'mainButtonContainer'}>
							<Button
								primary
								onClick={handleSubmit(handleSend)}
								disabled={isSending || loading}
								type='submit'
							>
								{isSending || loading ? <><Icon name='spinner'/>Creating</> : 'Create'}
							</Button>
						</div>
						{error?.message && <FilteredError text={error.message}/>}
					</Form>
				</Grid.Column>
				<Grid.Column only='computer' computer={4} largeScreen={6} widescreen={6}/>
			</Grid>
		</>
	);
};

export default styled(CreatePost)`
	.mainButtonContainer{
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 3rem;
	}
`;
