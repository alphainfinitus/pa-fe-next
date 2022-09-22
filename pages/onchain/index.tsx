// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';

import BountyContainer from '../../src/screens/OnChain/Bounties';
import MotionContainer from '../../src/screens/OnChain/Motions';
import ProposalContainer from '../../src/screens/OnChain/Proposals';
import ReferendaContainer from '../../src/screens/OnChain/Referenda';
import TechCommitteeProposalsContainer from '../../src/screens/OnChain/TechCommitteeProposals';
import TipContainer from '../../src/screens/OnChain/Tips';
import TreasuryContainer from '../../src/screens/OnChain/Treasury';
import InfoBox from '../../src/ui-components/InfoBox';

const OnchainPostsContainer = ({ className } : {className?: string}) => {

	const limit = 10;

	return (
		<>
			<Head>
				<title>Polkaassembly | OnChain</title>
			</Head>

			<div className={className}>
				<h1>Latest on-chain activity</h1>
				<Grid stackable reversed='mobile tablet'>
					<Grid.Column mobile={16} tablet={16} computer={10}>
						<h3>Referenda</h3>
						<ReferendaContainer className='referendaContainer' limit={limit} />
						<Link href='/referenda' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all referenda</a></Link>
						<h3>Proposals</h3>
						<ProposalContainer className='proposalContainer' limit={limit} />
						<Link href='/proposals' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all proposals</a></Link>
						<h3>Motions</h3>
						<MotionContainer className='motionContainer' limit={limit} />
						<Link href='/motions' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all motions</a></Link>
						<h3>Treasury proposals</h3>
						<TreasuryContainer className='treasuryContainer' limit={limit} />
						<Link href='/treasury-proposals' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all treasury proposals</a></Link>
						<h3>Technical Committee Proposals</h3>
						<TechCommitteeProposalsContainer className='techCommitteeProposalsContainer' limit={limit} />
						<Link href='/tech-comm-proposals' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all technical committee proposals proposals</a></Link>
						<h3>Tips</h3>
						<TipContainer className='tipContainer' limit={limit} />
						<Link href='/tips' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all tips</a></Link>
						<h3>Bounties</h3>
						<BountyContainer className='bountyContainer' limit={limit} />
						<Link href='/bounties' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all bounties</a></Link>
						<h3>Child Bounties</h3>
						<BountyContainer className='bountyContainer' limit={limit} />
						<Link href='/child-bounties' passHref><a className='full-listing-link'><Icon name='arrow right'/>See all Child bounties</a></Link>
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={6}>
						<InfoBox
							dismissable={true}
							content='This is the place to discuss on-chain proposals, referenda, motions, tips, bounties, child bounties, treasury proposals and technical committee proposals.
							On-chain posts are automatically generated as soon as they are created on the chain.
							Only the proposer is able to edit them.'
							name='onchainInfo'
							title='About on-chain posts'
						/>
					</Grid.Column>
				</Grid>
			</div>
		</>
	);

};

export default styled(OnchainPostsContainer)`

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
