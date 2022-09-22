// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { OnchainLinkMotionPreimageFragment, OnchainLinkTechCommitteeProposalFragment } from '../../../generated/graphql';
import AddressComponent from '../../../ui-components/Address';
import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';
import ExternalLinks from '../../ExternalLinks';
import ArgumentsTableJSONView from './ArgumentsTableJSONView';

interface Props {
	className?: string;
	onchainLink: OnchainLinkTechCommitteeProposalFragment
}

const PostTechCommitteeProposalInfo = ({ className, onchainLink }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_tech_committee_proposal: onchainTechCommitteeProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	if (!onchainTechCommitteeProposal?.[0]) {
		return null;
	}

	const { metaDescription, memberCount, method, proposalArguments, proposalHash, preimage } = onchainTechCommitteeProposal[0];

	return (
		<OnchainInfoWrapper className={className}>
			<h4>On-chain info</h4>
			<Grid>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Proposer</h6>
					<AddressComponent address={proposerAddress}/>
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Member count</h6>
					{memberCount}
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Proposal hash</h6>
					{proposalHash}
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Motion&apos;s method</h6>
					<span className={method === 'rejectProposal' ? 'bold-red-text' : ''}>{method}</span>
				</Grid.Column>
				<Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={16}>
						{proposalArguments && proposalArguments.length
							? <ArgumentsTableJSONView postArguments={proposalArguments} showAccountArguments={false} />
							: null}
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={16}>
						{ metaDescription &&
							<>
								<h6>Description</h6>
								{metaDescription}
							</>
						}
					</Grid.Column>
				</Grid.Row>
				<ProposalInfo preimage={preimage}/>
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<ExternalLinks isTechCommitteeProposal={true} onchainId={onchainLink.onchain_tech_committee_proposal_id} />
				</Grid.Column>
			</Grid>
		</OnchainInfoWrapper>
	);
};

const ProposalInfo = ({ preimage } : {preimage?: OnchainLinkMotionPreimageFragment | null}) => {
	if (!preimage) {
		return null;
	}

	const { metaDescription, method: preimageMethod, preimageArguments } = preimage;

	return (
		<Grid.Row className='motion-sub-info with-table'>
			{preimageMethod &&
				<>
					<Grid.Column mobile={16} tablet={16} computer={16}>
						<h6>Method</h6>
						{preimageMethod}
					</Grid.Column>
					<Grid.Column className='arguments-col' mobile={16} tablet={16} computer={16}>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true} />
							: null}
					</Grid.Column>
				</>
			}
			<Grid.Column mobile={16} tablet={16} computer={16}>
				{ metaDescription &&
					<>
						<h6>Description</h6>
						{metaDescription}
					</>
				}
			</Grid.Column>
		</Grid.Row>
	);
};

export default styled(PostTechCommitteeProposalInfo)`
	.bold-red-text {
		color: red_primary;
		font-weight: bold;
	}
`;