// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import { BN_MILLION, BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import BN from 'bn.js';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Card, Icon, Progress } from 'semantic-ui-react';
import styled from 'styled-components';

import { ApiContext } from '../../../context/ApiContext';
import { REACT_APP_SUBSCAN_API_KEY } from '../../../global/apiKeys';
import { chainProperties } from '../../../global/networkConstants';
import { useBlockTime } from '../../../hooks';
import HelperTooltip from '../../../ui-components/HelperTooltip';
import blockToDays from '../../../util/blockToDays';
import fetchTokenToUSDPrice from '../../../util/fetchTokenToUSDPrice';
import formatBnBalance from '../../../util/formatBnBalance';
import formatUSDWithUnits from '../../../util/formatUSDWithUnits';
import getNetwork from '../../../util/getNetwork';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
	value?: Balance;
	burn?: BN;
	spendPeriod: BN;
	treasuryAccount: Uint8Array;
}

const NETWORK = getNetwork();

const TreasuryOverviewCards = ({ className }: {className?: string}) => {
	const { api, apiReady } = useContext(ApiContext);
	const [currentBlock, setCurrentBlock] = useState<BN>(new BN(0));
	const [treasuryBalance, setTreasuryBalance] = useState<
		DeriveBalancesAccount | undefined
	>(undefined);

	const { blocktime } = useBlockTime();

	const [result, setResult] = useState<Result>(() => ({
		spendPeriod: BN_ZERO,
		treasuryAccount: u8aConcat('modl', 'py/trsry', EMPTY_U8A_32).subarray(
			0,
			32
		)
	}));

	const [resultValue, setResultValue] = useState<string | undefined>(undefined);
	const [resultBurn, setResultBurn] = useState<string | undefined>(undefined);
	const [availableUSD, setAvailableUSD] = useState<string>('');
	const [nextBurnUSD, setNextBurnUSD] = useState<string>('');
	const [currentTokenPrice, setCurrentTokenPrice] = useState<string>('');
	const [priceWeeklyChange, setPriceWeeklyChange] = useState<string | number>();
	const [spendPeriodElapsed, setSpendPeriodElapsed] = useState<number>();
	const [spendPeriodPercentage, setSpendPeriodPercentage] = useState<number>();

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.derive.chain.bestNumber((number) => {
			setCurrentBlock(number);
		});

		api.derive.balances
			?.account(u8aToHex(result.treasuryAccount))
			.then((treasuryBalance) => {
				setTreasuryBalance(treasuryBalance);
			});

		if (treasuryBalance) {
			setResult(() => ({
				burn:
					treasuryBalance.freeBalance.gt(BN_ZERO) &&
					!api.consts.treasury.burn.isZero()
						? api.consts.treasury.burn
							.mul(treasuryBalance.freeBalance)
							.div(BN_MILLION)
						: BN_ZERO,
				spendPeriod: api.consts.treasury
					? api.consts.treasury.spendPeriod
					: BN_ZERO,
				treasuryAccount: u8aConcat(
					'modl',
					api.consts.treasury && api.consts.treasury.palletId
						? api.consts.treasury.palletId.toU8a(true)
						: 'py/trsry',
					EMPTY_U8A_32
				),
				value: treasuryBalance.freeBalance.gt(BN_ZERO)
					? treasuryBalance.freeBalance
					: undefined
			}));

			if (result.value) {
				setResultValue(result.value.toString());
			}

			if (result.burn) {
				setResultBurn(result.burn.toString());
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, treasuryBalance, currentBlock]);

	// set availableUSD and nextBurnUSD whenever they or current price of the token changes
	useEffect(() => {
		let cancel = false;
		if (cancel || !currentTokenPrice) return;

		if(resultValue) {
			// replace spaces returned in string by format function
			const availableVal: number = parseFloat(formatBnBalance(
				resultValue.toString(),
				{
					numberAfterComma: 2,
					withThousandDelimitor: false,
					withUnit: false
				}
			));

			if(availableVal != 0) {
				setAvailableUSD(formatUSDWithUnits((availableVal * Number(currentTokenPrice)).toString()));
			}
		}

		if(resultBurn) {
			// replace spaces returned in string by format function
			const burnVal: number = parseFloat(formatBnBalance(
				resultBurn.toString(),
				{
					numberAfterComma: 2,
					withThousandDelimitor: false,
					withUnit: false
				}
			));

			if(burnVal != 0) {
				setNextBurnUSD(formatUSDWithUnits((burnVal * Number(currentTokenPrice)).toString()));
			}
		}

		return () => { cancel = true; };
	}, [resultValue, resultBurn, currentTokenPrice]);

	// fetch current price of the token
	useEffect(() => {
		let cancel = false;
		if(cancel) return;

		fetchTokenToUSDPrice(1).then((formattedUSD) => {
			setCurrentTokenPrice(parseFloat(formattedUSD).toFixed(2));
		});

		return () => {cancel = true;};
	}, []);

	// fetch a week ago price of the token and calc priceWeeklyChange
	useEffect(() => {
		let cancel = false;
		if(cancel || !currentTokenPrice) return;

		async function fetchWeekAgoTokenPrice() {
			if (cancel) return;
			const weekAgoDate = moment().subtract(7,'d').format('YYYY-MM-DD');

			try {
				const response = await fetch(
					`https://${NETWORK === 'kilt' ? 'spiritnet' : NETWORK}.api.subscan.io/api/scan/price/history`,
					{
						body: JSON.stringify({
							end: weekAgoDate,
							start: weekAgoDate
						}),
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'X-API-Key': REACT_APP_SUBSCAN_API_KEY || ''
						},
						method: 'POST'
					}
				);
				const responseJSON = await response.json();
				if (responseJSON['message'] == 'Success') {
					const weekAgoPrice = responseJSON['data']['average'];
					const currentTokenPriceNum : number = parseFloat(currentTokenPrice);
					const weekAgoPriceNum : number = parseFloat(weekAgoPrice);
					const percentChange = ((currentTokenPriceNum - weekAgoPriceNum) / weekAgoPriceNum) * 100;
					setPriceWeeklyChange(parseFloat(percentChange.toFixed(2)));
				}
			} catch(err) {
				setPriceWeeklyChange('N/A');
			}
		}

		fetchWeekAgoTokenPrice();
		return () => {cancel = true;};
	}, [currentTokenPrice]);

	useEffect(() => {
		if (!api || !apiReady || currentBlock.isZero()) {
			return;
		}

		const totalSpendPeriod: number = blockToDays(result.spendPeriod.toNumber(), blocktime);
		const spendPeriodElapsed: number = blockToDays(currentBlock.toNumber() % (result.spendPeriod.toNumber()), blocktime);
		// const spendPeriodRemaining: number = totalSpendPeriod - spendPeriodElapsed;
		setSpendPeriodElapsed(spendPeriodElapsed);

		// spendPeriodElapsed/totalSpendPeriod for opposite
		const percentage = ((spendPeriodElapsed/totalSpendPeriod) * 100).toFixed(0);
		setSpendPeriodPercentage(parseFloat(percentage));
	}, [api, apiReady, currentBlock, blocktime, result.spendPeriod]);

	return (
		<Card.Group id='card-group' className={className}>
			{/* Available Card */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						Available <HelperTooltip basic={true} position='top left' content='Funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.' />
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{result.value ? (
							<span>
								{formatUSDWithUnits(formatBnBalance(
									result.value.toString(),
									{
										numberAfterComma: 0,
										withThousandDelimitor: false,
										withUnit: false
									}
								))} {chainProperties[NETWORK]?.tokenSymbol}
							</span>
						) : (
							<div>
								<Icon loading name='circle notched' />
							</div>
						)}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{availableUSD
							? `~ $${availableUSD}`
							: 'loading...'
						}
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Current Price Card */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						<span className='desktop-text'>
							Current Price of {chainProperties[NETWORK].tokenSymbol}
						</span>

						<span className='mobile-text'>
							{chainProperties[NETWORK].tokenSymbol} Price
						</span>
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{currentTokenPrice
							? `$${currentTokenPrice}`
							: <div><Icon loading name='circle notched' /></div>
						}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{priceWeeklyChange ?
							<div>
								<span className='desktop-text'>
									Weekly Change &nbsp;{Math.abs(Number(priceWeeklyChange))}% {priceWeeklyChange < 0 ? <Icon color='red' name='caret down' /> : <Icon color='green' name='caret up' /> }
								</span>
								<span className='mobile-text'>
								Weekly &nbsp;{Math.abs(Number(Number(priceWeeklyChange).toFixed(0)))}% {priceWeeklyChange < 0 ? <Icon color='red' name='caret down' /> : <Icon color='green' name='caret up' /> }
								</span>
							</div> :
							'loading...'
						}
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Spend Period Remaining */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						<span className='desktop-text'>
							Spend Period Elapsed <HelperTooltip basic={true} content={'Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to '+ blockToDays(result.spendPeriod.toNumber(), blocktime) + ' days.'} />
						</span>
						<span className='mobile-text'>
						Spend Period
						</span>
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{spendPeriodElapsed && `${spendPeriodElapsed} days` }
					</Card.Header>

					<Card.Description className='treasury-card-desc progress-desc'>
						<div className='progressNumber'>{ spendPeriodPercentage }%</div><br/>
						<Progress percent={spendPeriodPercentage} />
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Next Burn */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						Next Burn <HelperTooltip basic={true} position='right center' content='If the Treasury ends a spend period without spending all of its funds, it suffers a burn of a percentage of its funds.' />
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{result.burn ? (
							<span>
								{formatUSDWithUnits(formatBnBalance(
									result.burn.toString(),
									{
										numberAfterComma: 0,
										withThousandDelimitor: false,
										withUnit: false
									}
								))} {chainProperties[NETWORK]?.tokenSymbol}
							</span>
						) : (
							<div>
								<Icon loading name='circle notched' />
							</div>
						)}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{nextBurnUSD
							? `~ $${nextBurnUSD}`
							: 'loading...'
						}
					</Card.Description>
				</Card.Content>
			</Card>
		</Card.Group>
	);
};

export default styled(TreasuryOverviewCards)`
	&&& {
		overflow-x: hidden !important;
		flex-wrap: nowrap;
		max-width: 99.9%;
		margin-left: 0 !important;

		@media only screen and (min-width: 767px) {
			&:hover {
				overflow-x: auto !important;
			}
		}

		@media only screen and (max-width: 767px) {
			max-width: 98%;
			display: grid;
			column-gap: 16px;
			grid-template-columns: auto auto;
			overflow-x: visible !important;
			margin-left: auto !important;
			margin-right: auto !important;
		}

		.treasury-card{
			display: inline-block;
			border-radius: 0.5em;

			width: 98%;
			min-width: min-content;
			white-space: nowrap;
			margin-right: 16px !important;
			margin-left: 0 !important;

			&:first-child{
				margin-left: 1px !important;
			}

			.mobile-text {
				display: none;
			}

			@media only screen and (max-width: 767px) {
				padding-bottom: 12px;
				min-width: 14px;
				max-height: 120px;

				.mobile-text {
					display: block;
				}
				
				.desktop-text {
					display: none;
				}
			}
			
			@media only screen and (min-width: 945px) {
				width: 23%;
				max-width: 320px;
			}
			.content{
				padding-bottom: 0 !important;
			}
			
			.treasury-card-meta {
				color: #333 !important;
				font-size: 15px;
			}
	
			.treasury-card-header {
				margin-top: 0.4em !important;
				font-size: 24px !important;
				font-family: 'Roboto';
				font-weight: 500 !important;

				@media only screen and (max-width: 767px) {
					font-size: 18px !important;
				}
			}
	
			.treasury-card-desc{
				&:not(.progress-desc){
					margin-top: 0.9em !important;
					border-top: 1px solid #eee;
					padding-top: 0.7em;
				}
				
				color: #000 !important;
	
				.bar {
					background-color: #E5007A !important;
					border-radius: 1em;
					height: 8px;
					margin-top: 0.5em;
				}

				.progressNumber{
					float: right;
					color: #787878;
					font-size: 14px;
				}
	
			}
		}
		
	}
`;
