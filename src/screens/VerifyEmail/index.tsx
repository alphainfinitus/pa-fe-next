// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { useRouter } from 'next/router';
import React, { useContext,useEffect } from 'react';
import { Grid,Header, Icon, Segment } from 'semantic-ui-react';

import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useVerifyEmailMutation } from '../../generated/graphql';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

interface Props {
	className?: string,
	token: string
}

const VerifyEmail = ({ className, token }:Props): JSX.Element => {
	const router = useRouter();
	const currentUser = useContext(UserDetailsContext);
	const { queueNotification } = useContext(NotificationContext);
	const [verifyEmailMutation, { error }] = useVerifyEmailMutation({
		variables: {
			token: token
		}
	});

	useEffect(() => {
		verifyEmailMutation().then(({ data }) => {
			if (data?.verifyEmail?.token) {
				handleTokenChange(data.verifyEmail.token, currentUser);
			}

			if (data?.verifyEmail?.message) {
				queueNotification({
					header: 'Success!',
					message: data.verifyEmail.message,
					status: NotificationStatus.SUCCESS
				});
			}

			router.push('/');
		}).catch((e) => {
			console.error('Email verification error', e);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] /* dependencied are empty as mutation needs to fired only once */);

	return (
		<>
			{ error?.message
				? <Grid className={className}>
					<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={5} widescreen={5}/>
					<Grid.Column mobile={16} tablet={12} computer={8} largeScreen={6} widescreen={6}>
						<Segment>
							<Header as='h2' icon>
								<Icon name='ambulance' />
								<FilteredError text={'Invalid request, please check link and try again'}/>
							</Header>
						</Segment>
					</Grid.Column>
				</Grid>
				: <Loader/>
			}
		</>);
};

export default styled(VerifyEmail)`
	text-align: center
`;
