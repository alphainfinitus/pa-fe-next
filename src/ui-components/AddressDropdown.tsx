// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import React, { useState } from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import Address from '../ui-components/Address';

interface Props{
	accounts: InjectedAccount[]
	className?: string
	defaultAddress: string
	filterAccounts?: string[]
    onAccountChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
}

const AddressDropdown = ({ accounts, className, defaultAddress, filterAccounts, onAccountChange }: Props) => {
	const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
	const filteredAccounts = !filterAccounts
		? accounts
		: accounts.filter( elem =>
			filterAccounts.includes(elem.address)
		);

	const dropdownList: {[index: string]: string} = {};
	const addressOptions: DropdownItemProps[] = [];

	filteredAccounts.forEach(account => {
		addressOptions.push({
			children: <Address
				extensionName={account.name}
				address={account.address}
			/>,
			value: account.address
		});

		if (account.address && account.name){
			dropdownList[account.address] = account.name;
		}

	}
	);

	const _onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedAddress(data.value?.toString() || '');
		onAccountChange(event, data);
	};

	return <Dropdown
		className={className}
		pointing='top'
		onChange={_onAccountChange}
		options={addressOptions}
		trigger={<div className='address-wrapper'>
			<Address
				extensionName={dropdownList[selectedAddress]}
				address={defaultAddress}
			/>
		</div>}
		value={selectedAddress}
	/>;
};

export default styled(AddressDropdown)`
	width: 100%;
	padding: 1.4rem .4rem .8rem 1.2rem;

	.address-wrapper {
		display: inline-block;
	}

	.visible.menu.transition {
		width: 100%;
		border-radius: 0;
		max-height: 20rem;
		overflow: auto;
	}

	.dropdown.icon {
		position: absolute;
		right: 0rem;
		top: -0.5rem;
		padding: 1.6rem 0.8rem;
		float: right;
	}
`;
