// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext,useState } from 'react';
import { Grid,Header, Icon } from 'semantic-ui-react';

import { NotificationContext } from '../../src/context/NotificationContext';
import { useResetPasswordMutation } from '../../src/generated/graphql';
import { NotificationStatus } from '../../src/types';
import Button from '../../src/ui-components/Button';
import FilteredError from '../../src/ui-components/FilteredError';
import { Form } from '../../src/ui-components/Form';

interface Props {
	className?: string
}

const ResetPassword = ({ className }:Props): JSX.Element => {
	const router = useRouter();
	const { token:queryToken, userId } = router.query;
	const token = `${queryToken}`;
	const [newPassword, setNewPassword ] = useState('');
	const { queueNotification } = useContext(NotificationContext);
	const [resetPassword, { loading, error }] = useResetPasswordMutation({
		variables: {
			newPassword,
			token,
			userId: Number(userId)
		}
	});

	const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.currentTarget.value);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
		event.preventDefault();
		event.stopPropagation();

		if (newPassword){
			resetPassword({
				variables: {
					newPassword,
					token,
					userId: Number(userId)
				}
			}).then(({ data }) => {
				if (data && data.resetPassword && data.resetPassword.message) {
					queueNotification({
						header: 'Success!',
						message: data.resetPassword.message,
						status: NotificationStatus.SUCCESS
					});
					router.push('/login');
				}
			}).catch((e) => {
				console.error('Reset password error', e);
			});
		}
	};

	const renderNoTokenUserIdError = () => {
		if (token && userId) return null;

		return (
			<Header as='h2' icon>
				<Icon name='ambulance' />
				Password reset token and/or userId missing
			</Header>
		);
	};

	return (
		<>
			<Head>
				<title>Polkaassembly | Reset Password</title>
			</Head>

			<Grid className={className}>
				<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={5} widescreen={6}/>
				<Grid.Column mobile={16} tablet={12} computer={8} largeScreen={6} widescreen={4}>
					{renderNoTokenUserIdError()}
					{ token && userId && <Form>
						<h3>Set new password</h3>
						<Form.Group>
							<Form.Field width={16}>
								<label>New password</label>
								<input
									onChange={handleNewPasswordChange}
									type="password"
								/>
							</Form.Field>
						</Form.Group>

						<div className={'mainButtonContainer'}>
							<Button
								primary
								disabled={loading}
								onClick={handleClick}
								type="submit"
							>
								Set new password
							</Button>
							{error?.message && <FilteredError text={error.message}/>}
						</div>
					</Form>}
				</Grid.Column>
				<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={5} widescreen={6}/>
			</Grid>
		</>
	);
};

export default styled(ResetPassword)`
	.mainButtonContainer{
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
`;
