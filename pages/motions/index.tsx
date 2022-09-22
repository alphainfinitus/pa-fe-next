// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import React from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

import MotionsContainer from '../../src/screens/Motions/MotionsContainer';
import InfoBox from '../../src/ui-components/InfoBox';

const OnchainPostsContainer = ({ className } : {className?: string}) => {

	return (
		<>
			<Head>
				<title>Polkaassembly | Motions</title>
			</Head>

			<div className={className}>
				<h1>On-chain motions</h1>
				<Grid stackable reversed='mobile tablet'>
					<Grid.Column mobile={16} tablet={16} computer={10}>
						<MotionsContainer limit={25} />
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={6}>
						<InfoBox
							dismissable={true}
							content='This is the place to discuss on-chain motions.
						On-chain posts are automatically generated as soon as they are created on the chain.
						Only the proposer is able to edit them.'
							name='onchainInfo'
							title='About On-chain Motions'
						/>
					</Grid.Column>
				</Grid>
			</div>
		</>
	);

};

export default styled(OnchainPostsContainer)`

	h1 {
		@media only screen and (max-width: 576px) {
			margin: 3rem 1rem 1rem 1rem;
		}

		@media only screen and (max-width: 768px) and (min-width: 576px) {
			margin-left: 1rem;
		}

		@media only screen and (max-width: 991px) and (min-width: 768px) {
			margin-left: 1rem;
		}
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		.ui[class*="tablet reversed"].grid {
			flex-direction: column-reverse;
		}
	}
`;
