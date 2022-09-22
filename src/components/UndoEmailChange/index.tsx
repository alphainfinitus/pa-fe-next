// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { useRouter } from 'next/router';
import React, { useContext,useEffect } from 'react';
import { Grid,Header, Icon, Segment } from 'semantic-ui-react';

import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useUndoEmailChangeMutation } from '../../generated/graphql';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

interface Props {
	className?: string;
	token: string;
}

const UndoEmailChange = ({ className, token }:Props): JSX.Element => {
	const router = useRouter();
	const currentUser = useContext(UserDetailsContext);
	const { queueNotification } = useContext(NotificationContext);
	const [undoEmailChangeMutation, { error }] = useUndoEmailChangeMutation({
		variables: {
			token: token
		}
	});

	useEffect(() => {
		undoEmailChangeMutation().then(({ data }) => {
			if (data?.undoEmailChange?.token) {
				handleTokenChange(data.undoEmailChange.token, currentUser);
			}

			if (data?.undoEmailChange?.message) {
				queueNotification({
					header: 'Success!',
					message: data.undoEmailChange.message,
					status: NotificationStatus.SUCCESS
				});
			}

			router.push('/');
		}).catch((e) => {
			console.error('Undo email Change error', e);
		});
	},[currentUser, queueNotification, router, undoEmailChangeMutation]);

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
		</>
	);
};

export default styled(UndoEmailChange)`
	text-align: center
`;
