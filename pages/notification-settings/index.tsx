// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect,useState } from 'react';
import { Checkbox, CheckboxProps,Grid } from 'semantic-ui-react';

import { NotificationContext } from '../../src/context/NotificationContext';
import { UserDetailsContext } from '../../src/context/UserDetailsContext';
import { useChangeNotificationPreferenceMutation } from '../../src/generated/graphql';
import { handleTokenChange } from '../../src/services/auth.service';
import { NotificationStatus } from '../../src/types';
import Button from '../../src/ui-components/Button';
import FilteredError from '../../src/ui-components/FilteredError';
import { Form } from '../../src/ui-components/Form';

interface Props {
	className?: string
}

const Settings = ({ className }:Props): JSX.Element => {
	const currentUser = useContext(UserDetailsContext);
	const [changed, setChanged] = useState<boolean>(false);
	const [postParticipated, setPostParticipated] = useState<boolean>(false);
	const [postCreated, setPostCreated] = useState<boolean>(false);
	const [newProposal, setNewProposal] = useState<boolean>(false);
	const [ownProposal, setOwnProposal] = useState<boolean>(false);
	const [changeNotificationPreferenceMutation, { error }] = useChangeNotificationPreferenceMutation();
	const { queueNotification } = useContext(NotificationContext);
	const { notification, email_verified } = currentUser;

	useEffect(() => {
		setPostParticipated(notification?.postParticipated || false);
		setPostCreated(notification?.postCreated || false);
		setNewProposal(notification?.newProposal || false);
		setOwnProposal(notification?.ownProposal || false);
	}, [notification]);

	const updatePreference = () => {
		changeNotificationPreferenceMutation({
			variables: {
				newProposal,
				ownProposal,
				postCreated,
				postParticipated
			}
		})
			.then(({ data }) => {
				if (data && data.changeNotificationPreference && data.changeNotificationPreference.message) {
					queueNotification({
						header: 'Success!',
						message: data.changeNotificationPreference.message,
						status: NotificationStatus.SUCCESS
					});
					setChanged(false);
				}
				if (data?.changeNotificationPreference?.token) {
					handleTokenChange(data.changeNotificationPreference.token, currentUser);
				}
			}).catch((e) => {
				queueNotification({
					header: 'Failed!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
				console.error('change name error', e);
			});
	};

	const handlePostParticipatedChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setPostParticipated(data.checked || false);
		setChanged(true);
	};

	const handlePostCreatedChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setPostCreated(data.checked || false);
		setChanged(true);
	};

	const handleNewProposalChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setNewProposal(data.checked || false);
		setChanged(true);
	};

	const handleOwnProposalChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setOwnProposal(data.checked || false);
		setChanged(true);
	};

	return (
		<>
			<Head>
				<title>Polkaassembly | Notification Settings</title>
			</Head>

			<Grid>
				<Grid.Column className={className} mobile={16} tablet={12} computer={12} largeScreen={10} widescreen={10}>
					<h2>Notification Preferences</h2>
					{!email_verified && <div className='errorText'>Please set and verify an email <Link href="/settings" passHref><a>in your settings</a></Link> to receive be able to set notifications.</div>}
					<Form standalone={false}>
						<Form.Group>
							<Form.Field>
								<Checkbox label='Subscribe to post you participate in' disabled={!email_verified} checked={!!email_verified && postParticipated} toggle onChange={handlePostParticipatedChange} />
							</Form.Field>
						</Form.Group>
						<Form.Group>
							<Form.Field>
								<Checkbox label='Subscribe to post you created' disabled={!email_verified} checked={!!email_verified && postCreated} toggle onChange={handlePostCreatedChange} />
							</Form.Field>
						</Form.Group>
						<Form.Group>
							<Form.Field>
								<Checkbox label='Notified for new proposal in council/motion/referendum' disabled={!email_verified} checked={!!email_verified && newProposal} toggle onChange={handleNewProposalChange} />
							</Form.Field>
						</Form.Group>
						<Form.Group>
							<Form.Field>
								<Checkbox label='Notified for your own proposals' disabled={!email_verified} checked={!!email_verified && ownProposal} toggle onChange={handleOwnProposalChange} />
							</Form.Field>
						</Form.Group>
						{changed ?
							<Form.Group>
								<Form.Field width={6}>
									{error?.message && <FilteredError text={error.message}/>}
									<Button
										secondary
										onClick={updatePreference}
										type="submit"
									>
									Save
									</Button>
								</Form.Field>
							</Form.Group>
							: null}
					</Form>
				</Grid.Column>
				<Grid.Column only='computer' computer={4} largeScreen={6} widescreen={6}/>
			</Grid>
		</>
	);
};

export default styled(Settings)`
	background-color: white;
	padding: 2rem 3rem 3rem 3rem!important;
	border-radius: 0.3rem;
	box-shadow: box_shadow_card;

	.button {
		margin-top: 0.2rem;
	}

	.ui.form:not(.unstackable)
	.fields:not(.unstackable)>.ten.wide.field {

		@media only screen and (max-width: 767px)  {
			width: 70%!important;
		}

		@media only screen and (max-width: 576px) {
			width: 60%!important;
		}
	}

	.ui.form:not(.unstackable)
	.fields:not(.unstackable)>.six.wide.field {

		@media only screen and (max-width: 767px)  {
			width: 30%!important;
		}

		@media only screen and (max-width: 576px) {
			width: 40%!important;
		}
	}

	@media only screen and (max-width: 576px) {
		padding: 2rem!important;

		.ui.form {
			margin-top: 0rem;
			padding: 0rem;
		}

		button {
			padding: 0.8rem 1rem;
			border-radius: 0.5rem;
		}
	}

	.errorText {
		color: red_secondary;
		a {
			color: grey_primary;
			text-decoration: underline;
			&:hover {
				color: grey_secondary;
				text-decoration: none;
			}
		}
	}
`;
