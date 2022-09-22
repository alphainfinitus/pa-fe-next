// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { isWeb3Injected, web3Enable } from '@polkadot/extension-dapp';
import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { DropdownProps, Icon } from 'semantic-ui-react';

import { ApiContext } from '../../../context/ApiContext';
import { OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment } from '../../../generated/graphql';
import { APPNAME } from '../../../global/appName';
import { motionStatus, proposalStatus, referendumStatus, tipStatus } from '../../../global/statuses';
import { VoteThreshold, Wallet } from '../../../types';
import { Form } from '../../../ui-components/Form';
import getEncodedAddress from '../../../util/getEncodedAddress';
import ExtensionNotDetected from '../../ExtensionNotDetected';
import MotionVoteInfo from './Motions/MotionVoteInfo';
import VoteMotion from './Motions/VoteMotion';
import ProposalDisplay from './Proposals';
import ReferendumVoteInfo from './Referenda/ReferendumVoteInfo';
import VoteReferendum from './Referenda/VoteReferendum';
import EndorseTip from './Tips/EndorseTip';
import TipInfo from './Tips/TipInfo';
import EditProposalStatus from './TreasuryProposals/EditProposalStatus';

interface Props {
	canEdit?: boolean | '' | undefined
	className?: string
	isBounty?: boolean
	isChildBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTipProposal?: boolean
	isTechCommitteeProposal?: boolean
	onchainId?: string | number | null
	onchainLink?: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkProposalFragment | OnchainLinkReferendumFragment | OnchainLinkTreasuryProposalFragment | OnchainLinkTipFragment
	status?: string
	startTime: string
}

const GovenanceSideBar = ({ canEdit, className, isMotion, isProposal, isReferendum, isTipProposal, isTreasuryProposal, onchainId, onchainLink, startTime, status }: Props) => {
	const [address, setAddress] = useState<string>('');
	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const [accountsMap, setAccountsMap] = useState<{[key:string]:string}>({});
	const [signersMap, setSignersMap] = useState<{[key:string]: Signer}>({});

	const { api, apiReady } = useContext(ApiContext);
	const [lastVote, setLastVote] = useState<string | null | undefined>(undefined);

	const canVote = !!status && !![proposalStatus.PROPOSED, referendumStatus.STARTED, motionStatus.PROPOSED, tipStatus.OPENED].includes(status);

	const onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const addressValue = data.value as string;
		setAddress(addressValue);
	};

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const signer: Signer = signersMap[accountsMap[address]];
		api?.setSigner(signer);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	const getWalletAccounts = async (chosenWallet: Wallet): Promise<InjectedAccount[] | undefined> => {
		const injectedWindow = window as Window & InjectedWindow;

		let wallet = isWeb3Injected
			? injectedWindow.injectedWeb3[chosenWallet]
			: null;

		if (!wallet) {
			wallet = Object.values(injectedWindow.injectedWeb3)[0];
		}

		if (!wallet) {
			return;
		}

		let injected: Injected | undefined;

		try {
			injected = await new Promise((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					reject(new Error('Wallet Timeout'));
				}, 60000); // wait 60 sec

				wallet!.enable(APPNAME).then(value => {
					clearTimeout(timeoutId);
					resolve(value);
				}).catch(error => {
					reject(error);
				});
			});
		} catch (err) {
			console.log('Error fetching wallet accounts : ', err);
		}

		if(!injected) {
			return;
		}

		const accounts = await injected.accounts.get();

		if (accounts.length === 0) return;

		accounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		return accounts;
	};

	const getAccounts = async (): Promise<undefined> => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotFound(true);
			return;
		} else {
			setExtensionNotFound(false);
		}

		let accounts: InjectedAccount[] = [];
		let polakadotJSAccounts : InjectedAccount[] | undefined;
		let subwalletAccounts: InjectedAccount[] | undefined;
		let talismanAccounts: InjectedAccount[] | undefined;

		const signersMapLocal = signersMap as {[key:string]: Signer};
		const accountsMapLocal = accountsMap as {[key:string]: string};

		for (const extObj of extensions) {
			if(extObj.name == 'polkadot-js') {
				signersMapLocal['polkadot-js'] = extObj.signer;
				polakadotJSAccounts = await getWalletAccounts(Wallet.POLKADOT);
			} else if(extObj.name == 'subwallet-js') {
				signersMapLocal['subwallet-js'] = extObj.signer;
				subwalletAccounts = await getWalletAccounts(Wallet.SUBWALLET);
			} else if(extObj.name == 'talisman') {
				signersMapLocal['talisman'] = extObj.signer;
				talismanAccounts = await getWalletAccounts(Wallet.TALISMAN);
			}
		}

		if(polakadotJSAccounts) {
			accounts = accounts.concat(polakadotJSAccounts);
			polakadotJSAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'polkadot-js';
			});
		}

		if(subwalletAccounts) {
			accounts = accounts.concat(subwalletAccounts);
			subwalletAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'subwallet-js';
			});
		}

		if(talismanAccounts) {
			accounts = accounts.concat(talismanAccounts);
			talismanAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'talisman';
			});
		}

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			return;
		} else {
			setAccountsNotFound(false);
			setAccountsMap(accountsMapLocal);
			setSignersMap(signersMapLocal);
		}

		setAccounts(accounts);
		if (accounts.length > 0) {
			setAddress(accounts[0].address);
			const signer: Signer = signersMapLocal[accountsMapLocal[accounts[0].address]];
			api.setSigner(signer);
		}

		return;
	};

	if (extensionNotFound) {
		return (
			<div className={className}>
				<div className='card'>
					<ExtensionNotDetected />
				</div>
			</div>
		);
	}

	if (accountsNotFound) {
		return (
			<div className={className}>
				<div className='card'>
					<div className='text-muted'>You need at least one account in Polkadot-js extenstion to use this feature.</div>
					<div className='text-muted'>Please reload this page after adding accounts.</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{ canVote
				? <div className={className}>
					<Form standalone={false}>
						{isMotion && <>
							{(onchainId || onchainId === 0) &&
								<MotionVoteInfo
									motionId={onchainId as number}
								/>
							}
							{canVote &&
								<VoteMotion
									accounts={accounts}
									address={address}
									getAccounts={getAccounts}
									motionId={onchainId as number}
									motionProposalHash={(onchainLink as OnchainLinkMotionFragment)?.onchain_motion?.[0]?.motionProposalHash}
									onAccountChange={onAccountChange}
								/>
							}
						</>}
						{isProposal &&
							<ProposalDisplay
								accounts={accounts}
								address={address}
								canVote={canVote}
								getAccounts={getAccounts}
								onAccountChange={onAccountChange}
								proposalId={onchainId  as number}
							/>
						}
						{isTreasuryProposal &&
							<EditProposalStatus
								proposalId={onchainId  as number}
								canEdit={canEdit}
								startTime={startTime}
							/>
						}
						{isReferendum &&
							<>
								{(onchainId || onchainId === 0) &&
									<ReferendumVoteInfo
										referendumId={onchainId as number}
										threshold={((onchainLink as OnchainLinkReferendumFragment).onchain_referendum[0]?.voteThreshold) as VoteThreshold}
										setLastVote={setLastVote}
									/>
								}

								<div className='vote-div vote-card'>
									{lastVote != undefined ? lastVote == null ?
										<div className='vote-reminder-text'>You haven&apos;t voted yet, vote now and do your bit for the community</div>
										:
										<div className='last-vote-text-cont'>
											You Voted: { lastVote == 'aye' ? <Icon name='thumbs up' className='green-text' /> : <Icon name='thumbs down' className='red-text' /> }
											<span className={`last-vote-text ${lastVote == 'aye' ? 'green-text' : 'red-text'}`}>{lastVote}</span>
										</div>
										: <div className="spacer"></div>
									}

									{canVote && <VoteReferendum
										lastVote={lastVote}
										setLastVote={setLastVote}
										accounts={accounts}
										address={address}
										getAccounts={getAccounts}
										onAccountChange={onAccountChange}
										referendumId={onchainId  as number}
									/>
									}
								</div>
							</>
						}
						{isTipProposal && canVote &&
						<div>
							<TipInfo onChainId={onchainId as string}/>
							<EndorseTip
								accounts={accounts}
								address={address}
								getAccounts={getAccounts}
								tipHash={onchainId as string}
								onAccountChange={onAccountChange}
							/>
						</div>
						}
					</Form>
				</div>
				: null
			}
		</>
	);
};

export default styled(GovenanceSideBar)`

	@media only screen and (max-width: 768px) {
		.ui.form {
			padding: 0rem;
		}
	}

	.vote-div {

		&.vote-card {
			background: #fff;
			padding: 14px 28px;
			box-shadow: rgba(83, 89, 92, 0.15) 0px 2px 4px 0px;
		}
		
		.vote-reminder-text, .last-vote-text-cont {
			color: #000000;
			font-size: 16px;
			margin-bottom: 16px;
			display: flex;
			align-items: center;

			.green-text {
				color: #4DD18F;
			}

			.red-text {
				color: #D94C3D;
			}
			
			.icon {
				margin-left: 12px;
				margin-right: 4px;
				margin-top: -4px;
			}

			.last-vote-text {
				text-transform: capitalize;
				font-weight: 500;
			}

			.last-vote-date {
				font-size: 14px;
				font-weight: 400;
				color: #909090;
				margin-left: 6px;
			}
		}

		.spacer {
			margin-top: 9px;
		}
	}
`;
