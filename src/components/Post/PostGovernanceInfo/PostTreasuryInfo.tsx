// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { OnchainLinkTreasuryProposalFragment } from '../../../generated/graphql';
import { chainProperties } from '../../../global/networkConstants';
import AddressComponent from '../../../ui-components/Address';
import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';
import getNetwork from '../../../util/getNetwork';
import ExternalLinks from '../../ExternalLinks';

interface Props{
	onchainLink: OnchainLinkTreasuryProposalFragment
}

const currentNetwork = getNetwork();

const PostTreasuryInfo = ({ onchainLink }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_treasury_spend_proposal: onchainTreasuryProposal,
		proposer_address: proposerAddress
	} = onchainLink;
	const beneficiary = onchainTreasuryProposal?.[0]?.beneficiary;
	const value = onchainTreasuryProposal?.[0]?.value;
	const bond = onchainTreasuryProposal?.[0]?.bond;

	return (
		<OnchainInfoWrapper>
			<h4>On-chain info</h4>
			<Grid>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Proposer</h6>
					<AddressComponent address={proposerAddress}/>
				</Grid.Column>
				{bond && currentNetwork &&
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Bond</h6>
					{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
				</Grid.Column>}
				{beneficiary &&
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Beneficiary</h6>
					<AddressComponent address={beneficiary}/>
				</Grid.Column>}
				{value && currentNetwork &&
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Value</h6>
					{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
				</Grid.Column>}
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<ExternalLinks isTreasuryProposal={true} onchainId={onchainLink.onchain_treasury_proposal_id} />
				</Grid.Column>
			</Grid>
		</OnchainInfoWrapper>
	);
};

export default PostTreasuryInfo;
