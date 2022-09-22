// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Divider } from 'semantic-ui-react';

import LatestActivityPostReactions from '../../../components/Reactionbar/LatestActivityPostReactions';
import { noTitle } from '../../../global/noTitle';
import Address from '../../../ui-components/Address';
import StatusTag from '../../../ui-components/StatusTag';

interface LatestActivityCardProps {
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

const LatestActivityCard = function ({
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
}:LatestActivityCardProps) {
	const [postTypeIcon, setPostTypeIcon] = useState<any>();
	const [postSerialID, setPostSerialID] = useState<any>();

	useEffect(() => {
		let icon;
		let serialID:any = 0;

		switch (postType){
		case 'discussion':
			icon = <Image alt='Discussions' src='/static/sidebar/discussions.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'referenda':
			icon = <Image alt='Discussions' src='/static/sidebar/referenda.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'proposal':
			icon = <Image alt='Discussions' src='/static/sidebar/proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'motion':
			icon = <Image alt='Discussions' src='/static/sidebar/motion.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'treasury proposal':
			icon = <Image alt='Discussions' src='/static/sidebar/treasury_proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'tech committee proposal':
			icon = <Image alt='Discussions' src='/static/sidebar/proposals.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'bounty':
			icon = <Image alt='Discussions' src='/static/sidebar/bounties.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'child bounty':
			icon = <Image alt='Discussions' src='/static/sidebar/bounties.svg' width={20} height={20} />;
			serialID = onchainId;
			break;
		case 'tip':
			icon = <Image alt='Discussions' src='/static/sidebar/tips.svg' width={20} height={20} />;
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
			path = 'childBounty';
			break;
		case 'tip':
			path = 'tip';
			break;
		}

		return `/${path}/${onchainId}`;
	};

	return (
		<Link href={gotoPost()}>
			<div className={`${className} post-card`}>
				<div className="post-head">
					<div className="post-type">
						{postTypeIcon} <span>{ postType == 'tech committee proposal' ? 'Proposal': postType == 'treasury proposal' ? 'Treasury' : postType }</span> {!hideSerialNum && postSerialID ? <><span className="dot-divider"></span> #{postSerialID}</> : null}
					</div>
					<div className="post-status">
						{status && <StatusTag className='statusTag' status={status} />}
					</div>
				</div>

				<div className="post-content">
					<div className="post-title">
						{trimmedMainTitle} {subTitle}
					</div>
					<div className="post-meta">
						{!address ? <span className='username'> { username } </span> :
							<Address
								address={address}
								className='address'
								displayInline={true}
								disableIdenticon={true}
							/>
						}
						<span className="dot-divider"></span>
						<span className='created-at-text'> { relativeCreatedAt } </span>
					</div>
				</div>

				<Divider />

				<div className="post-actions">
					<LatestActivityPostReactions className='reactions' gotoPost={gotoPost} postId={postId} />
				</div>
			</div>
		</Link>
	);
};

export default styled(LatestActivityCard)`
	cursor: pointer !important;
	background: #fff;
	width: 98%;
	height: 100%;
	margin-top: 16px;
	margin-right: auto;
	margin-left: auto;
	padding: 15px 15px 5px 15px;
	border-radius: 10px;
	border: 1px solid #D5DBDE;

	.post-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;

		.post-type {
			display: flex;
			align-items: center;
			text-transform: capitalize;

			i {
				margin-top: -4px;
			}

			& > * {
				margin-right: 10px;
			}
		}
	}

	.post-content {
		margin-bottom: 12px;

		.post-title {
			font-size: 16px;
			color: #75767C;
			font-weight: 500;
			margin-bottom: 12px;
		}

		.post-meta {
			display: flex;
			align-items: center;
			font-size: 14px !important;
			color: #ADADAD !important;

			.dot-divider {
				margin-top: -2px;
			}

			& > * {
				margin-right: 10px;
			}

			.created-at-text {
				white-space: nowrap;
			}
		}
	}

	.post-actions {
		display: flex;
		justify-content: flex-end;
	}

	.username {
		color: #75767C !important;
		font-weight: 400;
		font-size: 16px !important;
	}

	.address{
		.identityName{
			font-size: 14px !important;
			color: #ADADAD !important;
		}
	}

	.statusTag {
		font-size: 16px !important;
		font-weight: 400 !important;
	}

				
`;
