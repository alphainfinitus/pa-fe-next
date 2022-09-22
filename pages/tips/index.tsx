// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

import TipContainer from '../../src/screens/Tips/TipContainer';
import InfoBox from '../../src/ui-components/InfoBox';

const TipProposalFormButton = dynamic(() => import('../../src/components/CreateTipProposal/TipProposalFormButton'), {
	ssr: false
});

const OnchainTipContainer = ({ className } : {className?: string}) => {

	return (
		<>
			<Head>
				<title>Polkaassembly | Tips</title>
			</Head>

			<div className={className}>
				<Grid stackable verticalAlign='middle'>
					<Grid.Column floated='left' mobile={16} tablet={11} computer={10}>
						<h1>On-chain tip</h1>
					</Grid.Column>
					<Grid.Column floated='right' mobile={16} tablet={5} computer={4}>
						<TipProposalFormButton />
					</Grid.Column>
				</Grid>

				<Grid stackable reversed='mobile tablet'>
					<Grid.Column mobile={16} tablet={16} computer={10}>
						<TipContainer limit={25} />
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={6}>
						<InfoBox
							dismissable={true}
							content='This is the place to discuss on-chain tips.
							Tip posts are automatically generated as soon as they are created on-chain.
							Only the proposer is able to edit them.'
							name='onchainInfo'
							title='About On-chain tips'
						/>
					</Grid.Column>
				</Grid>
			</div>
		</>
	);

};

export default styled(OnchainTipContainer)`

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
