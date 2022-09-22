// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext,useState } from 'react';
import { Grid } from 'semantic-ui-react';

import { ModalContext } from '../../src/context/ModalContext';
import { useRequestResetPasswordMutation } from '../../src/generated/graphql';
import Button from '../../src/ui-components/Button';
import FilteredError from '../../src/ui-components/FilteredError';
import { Form } from '../../src/ui-components/Form';

interface Props {
	className?: string
}

const RequestResetPassword = ({ className }:Props): JSX.Element => {
	const [email, setEmail] = useState<string | undefined>('');
	const router = useRouter();
	const { setModal } = useContext(ModalContext);
	const [requestResetPasswordMutation, { loading, error }] = useRequestResetPasswordMutation();

	const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
		event.preventDefault();
		event.stopPropagation();

		if (email){
			requestResetPasswordMutation({
				variables: {
					email
				}
			}).then(({ data }) => {
				if (data && data.requestResetPassword && data.requestResetPassword.message){
					router.push('/');
					setModal({ content: data.requestResetPassword.message ,title: 'Check your emails' });
				}
			}).catch((e) => {
				console.error('Request password reset error', e);
			});
		}
	};

	return (
		<>
			<Head>
				<title>Polkaassembly | Request Reset Password</title>
			</Head>

			<Grid className={className}>
				<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={5} widescreen={5}/>
				<Grid.Column mobile={16} tablet={12} computer={8} largeScreen={6} widescreen={6}>
					<Form>
						<h3>Request Password Reset</h3>
						<Form.Group>
							<Form.Field width={16}>
								<label>Email</label>
								<input
									onChange={onEmailChange}
									placeholder='email@example.com'
									type="text"
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
							Request reset
							</Button>
							{error?.message && <FilteredError text={error.message}/>}
						</div>
					</Form>
				</Grid.Column>
				<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={5} widescreen={5}/>
			</Grid>
		</>
	);
};

export default styled(RequestResetPassword)`
	.mainButtonContainer{
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
`;
