// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumVote } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';
import { getFailingThreshold, getPassingThreshold } from '@polkassembly/util';
import styled from '@xstyled/styled-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useMemo,useState } from 'react';
import { Grid } from 'semantic-ui-react';

import { ApiContext } from '../../../../context/ApiContext';
import { UserDetailsContext } from '../../../../context/UserDetailsContext';
import { LoadingStatusType, VoteThreshold } from '../../../../types';
import Card from '../../../../ui-components/Card';
import HelperTooltip from '../../../../ui-components/HelperTooltip';
import Loader from '../../../../ui-components/Loader';
import PassingInfo from '../../../../ui-components/PassingInfo';
import VoteProgress from '../../../../ui-components/VoteProgress';
import formatBnBalance from '../../../../util/formatBnBalance';

interface Props {
	className?: string
	referendumId: number
	threshold?: VoteThreshold
	setLastVote: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const ZERO = new BN(0);

const sizing = ['0.1x', '1x', '2x', '3x', '4x', '5x', '6x'];
const LOCKS = [1, 10, 20, 30, 40, 50, 60];

const ReferendumVoteInfo = ({ className, referendumId, threshold, setLastVote }: Props) => {
	const { api, apiReady } = useContext(ApiContext);
	const [turnout, setTurnout] = useState(ZERO);
	const [totalIssuance, setTotalIssuance] = useState(ZERO);
	const [ayeVotes, setAyeVotes] = useState(ZERO);
	const [nayVotes, setNayVotes] = useState(ZERO);
	const [votedAccounts, setVotedAccounts] = useState([{ 'accountId': '', 'balance': '','label': '', 'voted': '' }]);
	const [nayVotesWithoutConviction, setNayVotesWithoutConviction] = useState(ZERO);
	const [ayeVotesWithoutConviction, setAyeVotesWithoutConviction] = useState(ZERO);
	const [isPassing, setIsPassing] = useState<boolean | null>(null);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const turnoutPercentage = useMemo( () => {
		if (totalIssuance.isZero()) {
			return 0;
		}
		// BN doens't handle floats. If we devide a number by a bigger number (12/100 --> 0.12), the result will be 0
		// therefore, we first multiply by 10 000, which gives (120 000/100 = 1200) go to Number which supports floats
		// and devide by 100 to have percentage --> 12.00%
		return turnout.muln(10000).div(totalIssuance).toNumber()/100;
	} , [turnout, totalIssuance]);

	const { addresses } = useContext(UserDetailsContext);

	const getBalance = (balance: Balance, convictions: number) => {
		const votedBalance = balance.muln(LOCKS[convictions]).div(new BN(10));
		return formatBnBalance(votedBalance, {});
	};

	const getThreshold = useMemo(
		() => {
			if (!threshold || isPassing === null) return ZERO;
			// if the referendum is passing, we're interesed in the failing threshold
			if (isPassing) {
				const res = getFailingThreshold({ ayes: ayeVotes, ayesWithoutConviction: ayeVotesWithoutConviction, threshold, totalIssuance });
				return res.isValid && res.failingThreshold ? res.failingThreshold : ZERO;
			} else {
				const res = getPassingThreshold({ nays: nayVotes, naysWithoutConviction: nayVotesWithoutConviction, threshold, totalIssuance });
				return res.isValid && res.passingThreshold ? res.passingThreshold : ZERO;
			}
		},
		[ayeVotes, ayeVotesWithoutConviction, isPassing, nayVotes, nayVotesWithoutConviction, threshold, totalIssuance]
	);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.democracy.referendums((referendums) => {
			const referendum = referendums.filter(re => re.index.toNumber() === referendumId)[0];

			if (referendum) {
				setIsPassing(referendum.isPassing);
				const totalAye: BN = referendum.allAye.reduce((acc: BN, curr: DeriveReferendumVote) => {
					return acc.add(new BN(curr.balance));
				}, ZERO);
				const totalNay: BN = referendum.allNay.reduce((acc: BN, curr: DeriveReferendumVote) => {
					return acc.add(new BN(curr.balance));
				}, ZERO);

				setNayVotesWithoutConviction(totalNay);
				setAyeVotesWithoutConviction(totalAye);

				let voteObj: any = {};
				const acc: any = [];

				if(addresses){
					referendum.votes.forEach(vote => {
						if(addresses.includes(vote.accountId.toHuman())) {
							voteObj = { 'accountId': vote.accountId.toHuman(),'balance': getBalance(vote.balance, vote.vote.conviction.toNumber()), 'label': `${sizing[vote.vote.conviction.toNumber()]}${vote.isDelegating ? '/d' : ''} - `, 'voted': vote.vote.isAye ? 'aye' : 'nay' };
							acc.push(voteObj);
						}
					});
					setVotedAccounts(acc);
				}
			}
		}).then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	}, [api, apiReady, referendumId, addresses]);

	useEffect(() => {
		if(votedAccounts.length>0){
			setLastVote(votedAccounts[votedAccounts.length - 1].voted == '' ? null : votedAccounts[votedAccounts.length - 1].voted);
		}
	}, [setLastVote, votedAccounts]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.query.democracy.referendumInfoOf(referendumId, (info: any) => {
			const _info = info.unwrapOr(null);

			if (_info?.isOngoing){
				setAyeVotes(_info?.asOngoing.tally.ayes);
				setNayVotes(_info?.asOngoing.tally.nays);
				setTurnout(_info?.asOngoing.tally.turnout);
			}

			setLoadingStatus({ isLoading: false, message: '' });
		})
			.then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	}, [api, apiReady, referendumId]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.query.balances.totalIssuance((result: any) => {
			setTotalIssuance(result);
		})
			.then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	},[api, apiReady]);

	return (
		<>
			<PassingInfo isPassing={isPassing}/>
			<Card className={loadingStatus.isLoading ? `LoaderWrapper ${className}` : className}>
				{loadingStatus.isLoading
					? <Loader text={loadingStatus.message} timeout={30000} timeoutText='Api is unresponsive.'/>
					: <>
						{
							isPassing === null
								? <Loader className={'progressLoader'} text={'Loading vote progress'} timeout={90000} timeoutText='Vote calculation failed' delayText='The results should be available soon!' delayTextTimeout={30000}/>
								: <VoteProgress
									ayeVotes={ayeVotes}
									className='vote-progress'
									isPassing={isPassing}
									threshold={getThreshold as BN}
									nayVotes={nayVotes}
									thresholdType={threshold}
								/>
						}

						<Grid columns={3} divided>
							<Grid.Row>
								<Grid.Column>
									<h6>Turnout {turnoutPercentage > 0 && <span className='turnoutPercentage'>({turnoutPercentage}%)</span>}</h6>
									<div>{formatBnBalance(turnout, { numberAfterComma: 2, withUnit: true })}</div>
								</Grid.Column>
								<Grid.Column>
									<h6>Aye <HelperTooltip content='Aye votes without taking conviction into account'/></h6>
									<div>{formatBnBalance(ayeVotesWithoutConviction, { numberAfterComma: 2, withUnit: true })}</div>
								</Grid.Column>
								<Grid.Column>
									<h6>Nay <HelperTooltip content='Nay votes without taking conviction into account'/></h6>
									<div>{formatBnBalance(nayVotesWithoutConviction, { numberAfterComma: 2, withUnit: true })}</div>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</>
				}
			</Card>
		</>
	);
};

export default styled(ReferendumVoteInfo)`
	padding-bottom: 1rem;

	.vote-progress {
		margin-bottom: 5rem;
	}

	.LoaderWrapper {
		height: 15rem;
		position: absolute;
		width: 100%;
	}

	.turnoutPercentage {
		font-weight: normal;
		font-size: sm;
	}

	.progressLoader{
		position: inherit;
		height: 10rem;
		.loader {
			margin-top: -4.5rem !important;
		}
	}
`;
