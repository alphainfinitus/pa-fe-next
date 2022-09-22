// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Grid } from 'semantic-ui-react';

import Button from '../src/ui-components/Button';

interface Props {
	className?: string
}

const NotFound = ({ className }:Props): JSX.Element => {
	const router = useRouter();
	const navigateHome = () => {
		router.push('/');
	};

	return (
		<Grid className={className} stackable reversed='mobile tablet'>
			<Grid.Column>
				<h1>You broke the chain</h1>
				<br/>
				<br/>
				<>
					<Image alt={'broken chain'} width={100} height={100} src='/broken-chain.png'/>
				</>
				<br/>
				<br/>
				<h2>404 Not found!</h2>
				<br/>
				<br/>
				<>
					<Button primary onClick={navigateHome}>Go Back to Home!</Button>
				</>
			</Grid.Column>
		</Grid>
	);
};

export default styled(NotFound)`
	text-align: center
`;
