// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Note that clear is a status made up for Polkassembly
// for proposal that got cleared from the queue after a
// clearPublicProposal such as https://polkascan.io/kusama/democracy/referendum/57
export const proposalStatus = {
	CLEARED: 'Cleared',
	PROPOSED: 'Proposed',
	TABLED: 'Tabled'
};

export const referendumStatus = {
	CANCELLED: 'Cancelled',
	EXECUTED: 'Executed',
	NOTPASSED: 'NotPassed',
	PASSED: 'Passed',
	STARTED: 'Started',
	VETOED: 'Vetoed'
};

export const motionStatus = {
	APPROVED: 'Approved',
	CLOSED: 'Closed',
	DISAPPROVED: 'Disapproved',
	EXECUTED: 'Executed',
	PROPOSED: 'Proposed',
	VOTED: 'Voted'
};

export const tipStatus = {
	CLOSED: 'TipClosed',
	CLOSING: 'TipClosing',
	OPENED: 'TipOpened',
	RETRACTED: 'TipRetracted'
};

export const tipStatusMap = {
	[tipStatus.OPENED]: 'Opened',
	[tipStatus.CLOSING]: 'Closing',
	[tipStatus.CLOSED]: 'Rewarded',
	[tipStatus.RETRACTED]: 'Retracted'
};

export const bountyStatus = {
	AWARDED: 'BountyAwarded',
	BECAME_ACTIVE: 'BountyBecameActive',
	CANCELED: 'BountyCanceled',
	CLAIMED: 'BountyClaimed',
	EXTENDED: 'BountyExtended',
	PROPOSED: 'BountyProposed',
	REJECTED: 'BountyRejected'
};

export const bountyStatusMap = {
	[bountyStatus.AWARDED]: 'Awarded',
	[bountyStatus.BECAME_ACTIVE]: 'BecameActive',
	[bountyStatus.CANCELED]: 'Canceled',
	[bountyStatus.CLAIMED]: 'Claimed',
	[bountyStatus.EXTENDED]: 'Extended',
	[bountyStatus.PROPOSED]: 'Proposed',
	[bountyStatus.REJECTED]: 'Rejected'
};

export const childBountyStatus = {
	ADDED: 'Added',
	AWARDED: 'Awarded',
	CANCELED: 'Canceled',
	CLAIMED: 'Claimed'
};

export const childBountyStatusMap = {
	[childBountyStatus.ADDED]: 'Added',
	[childBountyStatus.AWARDED]: 'Awarded',
	[childBountyStatus.CANCELED]: 'Canceled',
	[childBountyStatus.CLAIMED]: 'Claimed'
};

export const approvalStatus = {
	APPROVED: 'approved',
	PENDING: 'pending',
	REJECTED: 'rejected'
};