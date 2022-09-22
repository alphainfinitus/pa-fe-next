// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';

import LatestActivityPostReactions from '../../../components/Reactionbar/LatestActivityPostReactions';
import { noTitle } from '../../../global/noTitle';
import Address from '../../../ui-components/Address';
import StatusTag from '../../../ui-components/StatusTag';

interface LatestActivityTableRowProps {
	postId: number
	address: string
	className?: string
	created_at?: Date
	method?: string
	onchainId?: string | number | null
	status?: string | null
	tipReason?: string
	title?: string | null
	postType: 'discussion' | 'referenda' | 'proposal' | 'motion' | 'treasury proposal' | 'tech committee proposal' | 'bounty' | 'tip' | 'child bounty'
	username?: string | null
	hideSerialNum?: boolean
}

const LatestActivityTableRow = function ({
	postId,
	address,
	className,
	created_at,
	method,
	onchainId,
	status,
	tipReason,
	title,
	postType,
	username,
	hideSerialNum
}:LatestActivityTableRowProps) {
	const [postTypeIcon, setPostTypeIcon] = useState<any>();
	const [postSerialID, setPostSerialID] = useState<any>();

	useEffect(() => {
		let icon;
		let serialID:any = 0;

		switch (postType){
		case 'discussion':
			icon = <Image alt='Discussion' src='/static/sidebar/discussions.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'referenda':
			icon = <Image alt='Referend' src='/static/sidebar/referenda.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'proposal':
			icon = <Image alt='Proposal' src='/static/sidebar/proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'motion':
			icon = <Image alt='Motion' src='/static/sidebar/motion.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'treasury proposal':
			icon = <Image alt='Treasury Proposal' src='/static/sidebar/treasury_proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'tech committee proposal':
			icon = <Image alt='Tech Committee Proposal' src='/static/sidebar/proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'bounty':
			icon = <Image alt='Bounty' src='/static/sidebar/bounties.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'child bounty':
			icon = <Image alt='Child Bounty' src='/static/sidebar/bounties.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'tip':
			icon = <Image alt='Tip' src='/static/sidebar/tips.svg' width={20} height={20} />;
			serialID = null;
			break;
		}

		setPostTypeIcon(icon);
		setPostSerialID(serialID);
	},[postType, onchainId]);

	const mainTitle = title || method || noTitle;

	// truncate mainTitle
	const trimmedMainTitle = mainTitle.length > 80 ? `${mainTitle.substring(0, Math.min(80, mainTitle.length))}...`  : mainTitle.substring(0, Math.min(80, mainTitle.length));

	const subTitle = title && tipReason && method && <h5>{title}</h5>;
	// const currentBlock = useCurrentBlock()?.toNumber() || 0;

	const relativeCreatedAt = created_at ? moment(created_at).startOf('day').fromNow() : null;

	const gotoPost = () => {
		let path: string = '';

		switch (postType){
		case 'discussion':
			path = 'post';
			break;
		case 'referenda':
			path = 'referendum';
			break;
		case 'proposal':
			path = 'proposal';
			break;
		case 'motion':
			path = 'motion';
			break;
		case 'treasury proposal':
			path = 'treasury';
			break;
		case 'tech committee proposal':
			path = 'tech';
			break;
		case 'bounty':
			path = 'bounty';
			break;
		case 'child bounty':
			path = 'child_bounty';
			break;
		case 'tip':
			path = 'tip';
			break;
		}

		return `/${path}/${onchainId}`;
	};

	return (
		<Link href={gotoPost()}>
			<Table.Row className={className}>
				{!hideSerialNum ? <Table.Cell className='sub-title-text serial-num'>
					{ postSerialID }
				</Table.Cell> : null}
				<Table.Cell className={!hideSerialNum ? 'pl-0' : ''}>
					<div className='main-title-text'>
						<h4>
							<div>
								{trimmedMainTitle}
							</div>
						</h4>
					</div>
					{subTitle && <div className='sub-title-text'>{subTitle}</div>}
				</Table.Cell>
				<Table.Cell>
					{!address ? <span className='username'> { username } </span> :
						<Address
							address={address}
							className='address'
							displayInline={true}
							disableIdenticon={true}
						/>
					}
					<div className='sub-title-text'>
						Posted { relativeCreatedAt }
					</div>
				</Table.Cell>
				<Table.Cell className='postType-cell'>
					<div className='flex'>
						<div className='postTypeIcon'>{postTypeIcon}</div>
						{ postType == 'tech committee proposal' || postType == 'treasury proposal' ? 'Proposal': postType }
					</div>
				</Table.Cell>
				<Table.Cell>{status && <StatusTag className='statusTag' status={status} />}</Table.Cell>
				<Table.Cell className='action-btn-cell'>
					<LatestActivityPostReactions className='reactions' gotoPost={gotoPost} postId={postId} />
				</Table.Cell>
			</Table.Row>
		</Link>
	);
};

export default styled(LatestActivityTableRow)`
	cursor: pointer !important;
	min-height: 89px;
	height: 89px;
	
	td {
		padding-top: 0.5em !important;
		padding-bottom: 0.5em !important;
	}

	.serial-num {
		padding-right: 0 !important;
		padding: 0 !important;
		text-align: center !important;
	}

	@media only screen and (min-width: 992px) {
		min-height: 76px;
		height: 76px;
		
		.pl-0 {
			padding-left: 0 !important;
		}
	}

	.main-title-text h4 {
		color: #75767C !important;
		font-size: 16px;
		font-weight: 400;
	}

	.sub-title-text {
		font-size: 14px;
		margin-top: 0.5em;
		color: #A4A4A4;
	}

	.username {
		color: #75767C !important;
		font-weight: 400;
		font-size: 16px !important;
	}

	.address{
		.identityName{
			font-size: 16px !important;
		}
	}

	.action-btn-cell {
		display: flex;
		cursor: default !important;
		padding-top: 1.3em !important;
		white-space: nowrap;
	}

	.action-btn {
		background: transparent;
	}

	.postType-cell {
		text-transform: capitalize;
		color: #75767C;
		font-size: 16px !important;
		white-space: nowrap;

		.flex {
			display: flex;

			.postTypeIcon {
				margin-right: 4px
			}
		}
	}

	.statusTag {
		font-size: 16px !important;
		font-weight: 400 !important;
	}
`;
