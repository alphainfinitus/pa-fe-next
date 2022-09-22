// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Image from 'next/image';
import React from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { chainProperties, network } from '../global/networkConstants';
import getNetwork from '../util/getNetwork';

const NETWORK = getNetwork();
const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    text-transform: capitalize;

    span {
			border-radius: 50%;
			margin-right: 0.5rem !important;
    }
`;

const StyledNetworkItem = ({ showNetwork }: {showNetwork: string}) => {
	return <StyledDiv>
		<Image
			src={chainProperties[showNetwork]?.logo ? chainProperties[showNetwork].logo : '/static/parachain-logos/chain-logo.jpg'}
			alt={showNetwork}
			width={36}
			height={40}
		/>
		{showNetwork}
	</StyledDiv>;
};

const NetworkOptions: DropdownItemProps[] = [];

for (const key of Object.keys(network)) {
	const optionObj = {
		image: { avatar: true, src: chainProperties[network[key as keyof typeof network]]?.logo ? chainProperties[network[key as keyof typeof network]].logo : '/static/parachain-logos/chain-logo.jpg' },
		key: network[key as keyof typeof network],
		text: network[key as keyof typeof network] == 'hydradx' ? 'HydraDX' : network[key as keyof typeof network],
		value: network[key as keyof typeof network]
	};

	NetworkOptions.push(optionObj);
}

interface Props {
    className?: string
		setSidebarHiddenFunc?: () => void
}

const NetworkDropdown = ({ className, setSidebarHiddenFunc }: Props) =>  {

	const navigate = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		if (data.value === NETWORK){
			return null;
		}

		if (data.value === 'moonbase' || data.value === 'moonriver' || data.value === 'moonbeam' || data.value === 'kilt' || data.value === 'automata') {
			window.location.href = `https://${data.value}.polkassembly.network`;
		} else {
			window.location.href = `https://${data.value}.polkassembly.io`;
		}
		return null;
	};

	return <Dropdown
		onClick={setSidebarHiddenFunc}
		className={className}
		pointing='top'
		onChange={navigate}
		options={NetworkOptions}
		trigger={<StyledNetworkItem showNetwork={NETWORK}/>}
		value={NETWORK}
		scrolling
	/>;
};

export default styled(NetworkDropdown)`
    color: #fff;
    display: flex !important;
    align-items: center;
		margin: 0 1.2rem;

		@media only screen and (max-width: 768px) {
			font-size: 13px;
		}

		i.icon {
			color: #fff !important;
		}

		.menu {
			z-index: 201 !important;
			min-height: 70vh !important;

			div.item {
				margin: 0.5em 1.5em 0.5 0 !important;
				width: 100%;

				span.text {
					text-transform: capitalize;
					font-size: 1.5rem !important;
				}
			}

		}
`;
