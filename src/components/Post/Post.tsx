// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Icon, Responsive } from 'semantic-ui-react';

import { UserDetailsContext } from '../../context/UserDetailsContext';
import {
	BountyPostAndCommentsQuery,
	BountyPostAndCommentsQueryHookResult,
	BountyPostFragment,
	ChildBountyPostAndCommentsQuery,
	ChildBountyPostAndCommentsQueryHookResult,
	ChildBountyPostFragment,
	DiscussionPostAndCommentsQuery,
	DiscussionPostAndCommentsQueryHookResult,
	DiscussionPostFragment,
	MotionPostAndCommentsQuery,
	MotionPostAndCommentsQueryHookResult,
	MotionPostFragment,
	OnchainLinkBountyFragment,
	OnchainLinkChildBountyFragment,
	OnchainLinkMotionFragment,
	OnchainLinkProposalFragment,
	OnchainLinkReferendumFragment,
	OnchainLinkTechCommitteeProposalFragment,
	OnchainLinkTipFragment,
	OnchainLinkTreasuryProposalFragment,
	ProposalPostAndCommentsQuery,
	ProposalPostAndCommentsQueryHookResult,
	ProposalPostFragment,
	ReferendumPostAndCommentsQuery,
	ReferendumPostAndCommentsQueryHookResult,
	ReferendumPostFragment,
	TechCommitteeProposalPostAndCommentsQuery,
	TechCommitteeProposalPostAndCommentsQueryHookResult,
	TechCommitteeProposalPostFragment,
	TipPostAndCommentsQuery,
	TipPostAndCommentsQueryHookResult,
	TipPostFragment,
	TreasuryProposalPostAndCommentsQuery,
	TreasuryProposalPostAndCommentsQueryHookResult,
	TreasuryProposalPostFragment } from '../../generated/graphql';
import Button from '../../ui-components/Button';
import Card from '../../ui-components/Card';
import ScrollToTop from '../../ui-components/ScrollToTop';
import getNetwork from '../../util/getNetwork';
import Comments from '../Comment/Comments';
import EditablePostContent from '../EditablePostContent';
import NoPostFound from '../NoPostFound';
import OptionPoll from '../OptionPoll';
import CreateOptionPoll from '../OptionPoll/CreateOptionPoll';
import PostReactionBar from '../Reactionbar/PostReactionBar';
import ReportButton from '../ReportButton';
import ShareButton from '../ShareButton';
import SubscriptionButton from '../SubscriptionButton/SubscriptionButton';
import Timeline from '../Timeline';
import TrackerButton from '../TrackerButton';
import Poll from './Poll';
import CreatePostComment from './PostCommentForm';
import PostBountyInfo from './PostGovernanceInfo/PostBountyInfo';
import PostChildBountiesList from './PostGovernanceInfo/PostChildBountiesList';
import PostChildBountyInfo from './PostGovernanceInfo/PostChildBountyInfo';
import PostMotionInfo from './PostGovernanceInfo/PostMotionInfo';
import PostProposalInfo from './PostGovernanceInfo/PostProposalInfo';
import PostReferendumInfo from './PostGovernanceInfo/PostReferendumInfo';
import PostTechCommitteeProposalInfo from './PostGovernanceInfo/PostTechCommitteeProposalInfo';
import PostTipInfo from './PostGovernanceInfo/PostTipInfo';
import PostTreasuryInfo from './PostGovernanceInfo/PostTreasuryInfo';

const GovenanceSideBar = dynamic(() => import('./GovernanceSideBar'), {
	ssr: false
});

const ClaimPayoutModal = dynamic(() => import('./ClaimPayoutModal'), {
	ssr: false
});

interface Props {
	className?: string
	data: (
		DiscussionPostAndCommentsQueryHookResult['data'] |
		ProposalPostAndCommentsQueryHookResult['data'] |
		ReferendumPostAndCommentsQueryHookResult['data'] |
		MotionPostAndCommentsQueryHookResult['data'] |
		TreasuryProposalPostAndCommentsQueryHookResult['data'] |
		TipPostAndCommentsQueryHookResult['data'] |
		BountyPostAndCommentsQueryHookResult['data'] |
		TechCommitteeProposalPostAndCommentsQueryHookResult['data'] |
		ChildBountyPostAndCommentsQueryHookResult['data']
	)
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean
	isTipProposal?: boolean
	isChildBounty?: boolean
	refetch: (variables?:any) =>
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<BountyPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TechCommitteeProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ChildBountyPostAndCommentsQuery>>
}

interface Redirection {
	link?: string;
	text?: string;
}

const Post = ( { className, data, isBounty = false, isChildBounty = false, isMotion = false, isProposal = false, isReferendum = false, isTipProposal = false, isTreasuryProposal = false, isTechCommitteeProposal = false, refetch }: Props ) => {
	const post = data && data.posts && data.posts[0];
	const { id, addresses } = useContext(UserDetailsContext);
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing(!isEditing);

	const network = getNetwork();

	useEffect(() => {
		const users: string[] = [];

		if (post?.author?.username) {
			users.push(post?.author?.username);
		}

		post?.comments.forEach(c => {
			if (c.author?.username && !users.includes(c.author?.username)) {
				users.push(c.author?.username);
			}
		});
		global.window.localStorage.setItem('users', users.join(','));
	}, [post]);

	const isOnchainPost = isMotion || isProposal || isReferendum || isTreasuryProposal || isBounty || isTechCommitteeProposal || isTipProposal;

	let onchainId: string | number | null | undefined;
	let referendumPost: ReferendumPostFragment | undefined;
	let proposalPost: ProposalPostFragment | undefined;
	let motionPost: MotionPostFragment | undefined;
	let treasuryPost: TreasuryProposalPostFragment | undefined;
	let tipPost: TipPostFragment | undefined;
	let bountyPost: BountyPostFragment | undefined;
	let childBountyPost: ChildBountyPostFragment | undefined;
	let techCommitteeProposalPost: TechCommitteeProposalPostFragment | undefined;
	let definedOnchainLink: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkReferendumFragment | OnchainLinkProposalFragment | OnchainLinkTipFragment | OnchainLinkTreasuryProposalFragment | undefined;
	let postStatus: string | undefined;
	let redirection: Redirection = {};

	if (post && isTechCommitteeProposal) {
		techCommitteeProposalPost = post as TechCommitteeProposalPostFragment;
		definedOnchainLink = techCommitteeProposalPost.onchain_link as OnchainLinkTechCommitteeProposalFragment;
		onchainId = definedOnchainLink.onchain_tech_committee_proposal_id;
		postStatus = techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.[0].status;
	}

	if (post && isBounty) {
		bountyPost = post as BountyPostFragment;
		definedOnchainLink = bountyPost.onchain_link as OnchainLinkBountyFragment;
		onchainId = definedOnchainLink.onchain_bounty_id;
		postStatus = bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.[0].status;
	}

	if (post && isChildBounty) {
		childBountyPost = post as ChildBountyPostFragment;
		definedOnchainLink = childBountyPost.onchain_link as OnchainLinkChildBountyFragment;
		onchainId = definedOnchainLink.onchain_child_bounty_id;
		postStatus = childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.[0].status;
	}

	if (post && isReferendum) {
		referendumPost = post as ReferendumPostFragment;
		definedOnchainLink = referendumPost.onchain_link as OnchainLinkReferendumFragment;
		onchainId = definedOnchainLink.onchain_referendum_id;
		postStatus = referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.[0].status;
	}

	if (post && isProposal) {
		proposalPost = post as ProposalPostFragment;
		definedOnchainLink = proposalPost.onchain_link as OnchainLinkProposalFragment;
		onchainId = definedOnchainLink.onchain_proposal_id;
		postStatus = proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isMotion) {
		motionPost = post as MotionPostFragment;
		definedOnchainLink = motionPost.onchain_link as OnchainLinkMotionFragment;
		onchainId = definedOnchainLink.onchain_motion_id;
		postStatus = motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isTreasuryProposal) {
		treasuryPost = post as TreasuryProposalPostFragment;
		definedOnchainLink = treasuryPost.onchain_link as OnchainLinkTreasuryProposalFragment;
		onchainId = definedOnchainLink.onchain_treasury_proposal_id;
		postStatus = treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.[0].status;
		if (definedOnchainLink.onchain_motion_id || definedOnchainLink.onchain_motion_id === 0){
			redirection = {
				link: `/motion/${definedOnchainLink.onchain_motion_id}`,
				text: `Motion #${definedOnchainLink.onchain_motion_id}`
			};
		}
	}

	if (post && isTipProposal) {
		tipPost = post as TipPostFragment;
		definedOnchainLink = tipPost.onchain_link as OnchainLinkTipFragment;
		onchainId = definedOnchainLink.onchain_tip_id;
		postStatus = tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.[0].status;
	}

	const isDiscussion = (post: TechCommitteeProposalPostFragment | BountyPostFragment | ChildBountyPostFragment | TipPostFragment | TreasuryProposalPostFragment | MotionPostFragment | ProposalPostFragment | DiscussionPostFragment | ReferendumPostFragment): post is DiscussionPostFragment => {
		if (!isTechCommitteeProposal && !isReferendum && !isProposal && !isMotion && !isTreasuryProposal && !isTipProposal && !isBounty && !isChildBounty) {
			return (post as DiscussionPostFragment) !== undefined;
		}

		return false;
	};

	if (!post) return <NoPostFound
		isMotion={isMotion}
		isProposal={isProposal}
		isReferendum={isReferendum}
		isTreasuryProposal={isTreasuryProposal}
		isTipProposal={isTipProposal}
		isBounty={isBounty}
		isTechCommitteeProposal={isTechCommitteeProposal}
		isChildBounty={isChildBounty}
	/>;

	const isBountyProposer = isBounty && bountyPost?.onchain_link?.proposer_address && addresses?.includes(bountyPost.onchain_link.proposer_address);
	const isChildBountyProposer = isChildBounty && childBountyPost?.onchain_link?.proposer_address && addresses?.includes(childBountyPost.onchain_link.proposer_address);
	const isProposalProposer = isProposal && proposalPost?.onchain_link?.proposer_address && addresses?.includes(proposalPost.onchain_link.proposer_address);
	const isReferendumProposer = isReferendum && referendumPost?.onchain_link?.proposer_address && addresses?.includes(referendumPost.onchain_link.proposer_address);
	const isMotionProposer = isMotion && motionPost?.onchain_link?.proposer_address && addresses?.includes(motionPost.onchain_link.proposer_address);
	const isTreasuryProposer = isTreasuryProposal && treasuryPost?.onchain_link?.proposer_address && addresses?.includes(treasuryPost.onchain_link.proposer_address);
	const isTipProposer = isTipProposal && tipPost?.onchain_link?.proposer_address && addresses?.includes(tipPost.onchain_link.proposer_address);
	const isTechCommitteeProposalProposer = isTechCommitteeProposal && techCommitteeProposalPost?.onchain_link?.proposer_address && addresses?.includes(techCommitteeProposalPost.onchain_link.proposer_address);
	const canEdit = !isEditing && (
		post.author?.id === id ||
		isProposalProposer ||
		isReferendumProposer ||
		isMotionProposer ||
		isTreasuryProposer ||
		isTipProposer ||
		isBountyProposer ||
		isTechCommitteeProposalProposer ||
		isChildBountyProposer
	);

	const Sidebar = () => <>
		<GovenanceSideBar
			isBounty={isBounty}
			isChildBounty={isChildBounty}
			isMotion={isMotion}
			isProposal={isProposal}
			isReferendum={isReferendum}
			isTipProposal={isTipProposal}
			isTreasuryProposal={isTreasuryProposal}
			isTechCommitteeProposal={isTechCommitteeProposal}
			onchainId={onchainId}
			onchainLink={definedOnchainLink}
			status={postStatus}
			canEdit={canEdit}
			startTime={post.created_at}
		/>
		{isDiscussion(post) && <Poll postId={post.id} canEdit={post.author?.id === id} />}
		<OptionPoll postId={post.id} canEdit={post.author?.id === id} />
	</>;

	return (
		<>
			<Head>
				<title>{post?.title || 'Polkassembly'}</title>
				<meta name="description" content={`${post?.content || `Polkassembly, discussion platform for ${network} governance`}`} />
			</Head>

			<Grid className={className}>
				<Grid.Column mobile={16} tablet={16} computer={10} largeScreen={10}>
					{redirection.link &&
						<Link href={redirection.link} passHref>
							<a className='redirection'>
								<Card className='redirectionCard'>
									<Icon name='forward'/> This proposal has become <span className='redirectionText'>{redirection.text}</span>
								</Card>
							</a>
						</Link>
					}
					{ post && isChildBounty && postStatus === 'PendingPayout' && (
						<Card className='claimPayoutCard'>
							<span>The child bounty payout is ready to be claimed&nbsp;&nbsp;</span>
							<ClaimPayoutModal
								parentBountyId={(definedOnchainLink as OnchainLinkChildBountyFragment).onchain_child_bounty[0]?.parentBountyId}
								childBountyId={(definedOnchainLink as OnchainLinkChildBountyFragment).onchain_child_bounty[0]?.childBountyId}
							/>
						</Card>
					)}
					<div className='post_content'>
						<EditablePostContent
							isEditing={isEditing}
							isTipProposal={isTipProposal}
							onchainId={onchainId}
							post={post}
							postStatus={postStatus}
							refetch={refetch}
							toggleEdit={toggleEdit}
						/>
						<div className='actions-bar'>
							<PostReactionBar className='reactions' postId={post.id} />
							{id && <div className='vl'/>}
							{id && !isEditing && <SubscriptionButton postId={post.id}/>}
							{canEdit && <Button className={'social'} onClick={toggleEdit}><Icon name='edit' className='icon'/>Edit</Button>}
							{id && !isEditing && !isOnchainPost && <ReportButton type='post' contentId={`${post.id}`} />}
							{canEdit && !isEditing && <CreateOptionPoll postId={post.id} />}
							{id && onchainId && isOnchainPost && !isEditing && (
								<TrackerButton
									onchainId={onchainId}
									isBounty={isBounty}
									isMotion={isMotion}
									isProposal={isProposal}
									isReferendum={isReferendum}
									isTipProposal={isTipProposal}
									isTreasuryProposal={isTreasuryProposal}
									isTechCommitteeProposal={isTechCommitteeProposal}
								/>)
							}
							<ShareButton title={post.title} />
						</div>
					</div>
					{ isTechCommitteeProposal && (
						<>
							<PostTechCommitteeProposalInfo
								onchainLink={definedOnchainLink as OnchainLinkTechCommitteeProposalFragment}
							/>
							<Timeline
								statuses={techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isBounty && (
						<>
							<PostBountyInfo
								onchainLink={definedOnchainLink as OnchainLinkBountyFragment}
							/>
							<PostChildBountiesList
								onchainId={Number(onchainId)}
							/>
							<Timeline
								statuses={bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isChildBounty && (
						<>
							<PostChildBountyInfo
								onchainLink={definedOnchainLink as OnchainLinkChildBountyFragment}
							/>
							<Timeline
								statuses={childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isMotion && (
						<>
							<PostMotionInfo
								onchainLink={definedOnchainLink as OnchainLinkMotionFragment}
							/>
							<Timeline
								statuses={motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isProposal && (
						<>
							<PostProposalInfo
								onchainLink={definedOnchainLink as OnchainLinkProposalFragment}
							/>
							<Timeline
								statuses={proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isReferendum && (
						<>
							<PostReferendumInfo
								onchainLink={definedOnchainLink as OnchainLinkReferendumFragment}
							/>
							<Timeline
								statuses={referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isTreasuryProposal && (
						<>
							<PostTreasuryInfo
								onchainLink={definedOnchainLink as OnchainLinkTreasuryProposalFragment}
							/>
							<Timeline
								statuses={treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{ isTipProposal && (
						<>
							<PostTipInfo
								onchainLink={definedOnchainLink as OnchainLinkTipFragment}
							/>
							<Timeline
								statuses={tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.map(s => ({
									blockNumber: s.blockNumber?.number || 0,
									status: s.status || ''
								})) || []}
							/>
						</>)
					}
					{redirection.link &&
						<Card className='timelineCard'>
							<Icon name='forward'/> Became <Link href={redirection.link} passHref><a className='redirection'><span className='redirectionText'>{redirection.text}</span></a></Link>
						</Card>
					}
					<Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
						<Sidebar />
					</Responsive>
					{ !!post.comments?.length &&
						<Comments
							comments={post.comments}
							refetch={refetch}
						/>
					}
					{ id && <CreatePostComment postId={post.id} refetch={refetch} /> }
				</Grid.Column>
				<Grid.Column mobile={16} tablet={16} computer={6} largeScreen={6}>
					<Responsive minWidth={Responsive.onlyComputer.minWidth}>
						<Sidebar />
					</Responsive>
					<ScrollToTop/>
				</Grid.Column>
			</Grid>
		</>
	);
};

export default styled(Post)`

	.post_content {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		padding: 3rem 3rem 0.8rem 3rem;
		margin-bottom: 1rem;
	}

	.actions-bar {
		display: flex;
		align-items: center;
	}

	.reactions {
		display: inline-flex;
		border: none;
		padding: 0.4rem 0;
		margin: 0rem;
	}

	.vl {
		display: inline-flex;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: grey_border;
		height: 2rem;
		margin: 0 1.2rem 0 0.8rem;
	}

	@media only screen and (max-width: 576px) {
		.post_content {
			padding: 2rem;
			border-radius: 0px;
		}
	}

	a.social {
		color: grey_primary;
		font-size: 1.3rem;
		font-weight: 500;

		i {
			font-size: 1.5rem;
		}
	}

	.redirectionCard, .claimPayoutCard {
		color: black_text;
		background-color: grey_border;
		padding: 2rem 3rem 2rem 3rem;
		border-radius: 3px;
		font-size: md;
		margin-bottom: 1rem;
		text-align: center;

		@media only screen and (max-width: 768px) {
			padding: 2rem;
			font-size: sm;
		}

		.redirectionText {
			color: pink_primary;

			&:hover {
				text-decoration: none;
				color: pink_secondary;
			}
		}
	}

	.claimPayoutCard {
		display: flex;
		align-items: center;
		justify-content: center;
		
		span {
			margin-top: 4px;
		}
	}

	.timelineCard {
		a {
			color: pink_secondary;
			font-size: 1.3rem;

			i {
				font-size: 1.5rem;
			}
		}
	}
`;
