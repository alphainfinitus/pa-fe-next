// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { Grid } from 'semantic-ui-react';

import InfoBox from '../../src/ui-components/InfoBox';

const BountyContainer = dynamic(() => import('../../src/screens/Tracker/Bounties'), {
	ssr: false
});

const MotionContainer = dynamic(() => import('../../src/screens/Tracker/Motions'), {
	ssr: false
});

const ProposalContainer = dynamic(() => import('../../src/screens/Tracker/Proposals'), {
	ssr: false
});

const ReferendaContainer = dynamic(() => import('../../src/screens/Tracker/Referenda'), {
	ssr: false
});

const TechCommitteeProposalsContainer = dynamic(() => import('../../src/screens/Tracker/TechCommitteeProposals'), {
	ssr: false
});

const TipContainer = dynamic(() => import('../../src/screens/Tracker/Tips'), {
	ssr: false
});

const TreasuryContainer = dynamic(() => import('../../src/screens/Tracker/Treasury'), {
	ssr: false
});

const TrackerContainer = ({ className } : {className?: string}) => {

	return (
		<>
			<Head>
				<title>Polkaassembly | Personal Tracker</title>
			</Head>
			<div className={className}>
				<h1>Personal Tracker</h1>
				<Grid stackable reversed='mobile tablet'>
					<Grid.Column mobile={16} tablet={16} computer={10}>
						<h3>Referenda</h3>
						<ReferendaContainer className='referendaContainer' />
						<h3>Proposals</h3>
						<ProposalContainer className='proposalContainer' />
						<h3>Motions</h3>
						<MotionContainer className='motionContainer' />
						<h3>Treasury proposals</h3>
						<TreasuryContainer className='treasuryContainer' />
						<h3>Technical Committee Proposals</h3>
						<TechCommitteeProposalsContainer className='techCommitteeProposalsContainer' />
						<h3>Tips</h3>
						<TipContainer className='tipContainer' />
						<h3>Bounties</h3>
						<BountyContainer className='bountyContainer' />
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={6}>
						<InfoBox
							dismissable={true}
							content='This is a place to keep track of on chain posts.'
							name='onchainInfo'
							title='About tracker'
						/>
					</Grid.Column>
				</Grid>
			</div>
		</>
	);

};

export default styled(TrackerContainer)`

	.referendaContainer, .proposalContainer, .motionContainer, .treasuryContainer, .tipContainer, .bountyContainer, .techCommitteeProposalsContainer {
		margin-bottom: 2rem;
	}

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

	.full-listing-link {
		display: flex;
		color: black_text;
		font-weight: 500;
		margin-bottom: 4rem;
	}
`;
