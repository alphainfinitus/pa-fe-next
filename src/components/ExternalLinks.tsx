// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';

import getNetwork from '../util/getNetwork';

interface Props {
	className?: string
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean;
	onchainId?: string | number | null | undefined
}

const service = {
	SUBSCAN: 'subscan'
};

const ExternalLinks = ({
	className,
	isMotion,
	isProposal,
	isReferendum,
	isTreasuryProposal,
	isTechCommitteeProposal,
	onchainId
}: Props) => {
	const network = getNetwork();

	const serviceMap = {
		[service.SUBSCAN]: (network: string) => {
			let url = '';
			const host = `https://${network}.subscan.io`;

			if (isReferendum) {
				url = `${host}/referenda/${onchainId}`;
			}
			if (isProposal) {
				url = `${host}/democracy_proposal/${onchainId}`;
			}
			if (isMotion) {
				url = `${host}/council/${onchainId}`;
			}
			if (isTreasuryProposal) {
				url = `${host}/treasury/${onchainId}`;
			}
			if (isTechCommitteeProposal) {
				url = `${host}/tech/${onchainId}`;
			}

			return url;
		}
	};

	const getLink = (service: string): string => {
		return serviceMap[service](network);
	};

	return (
		<div className={className}>
			<div>
				<a href={getLink(service.SUBSCAN)} rel="noopener noreferrer" target='_blank'>{'-> Show in Subscan'}</a>
			</div>
		</div>
	);
};

export default styled(ExternalLinks)`
	a {
		color: black_primary;
		font-weight: bold;
	}

	a:hover {
		text-decoration: underline;
	}
`;
