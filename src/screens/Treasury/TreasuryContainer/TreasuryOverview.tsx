// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import { BN_MILLION, BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

import { ApiContext } from '../../../context/ApiContext';
import { useBlockTime } from '../../../hooks';
import Card from '../../../ui-components/Card';
import HelperTooltip from '../../../ui-components/HelperTooltip';
import Loader from '../../../ui-components/Loader';
import blockToTime from '../../../util/blockToTime';
import fetchTokenToUSDPrice from '../../../util/fetchTokenToUSDPrice';
import formatBnBalance from '../../../util/formatBnBalance';
import formatUSDWithUnits from '../../../util/formatUSDWithUnits';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
	value?: Balance;
	burn?: BN;
	spendPeriod: BN;
	treasuryAccount: Uint8Array;
}

const TreasuryOverview = () => {
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
	const [currentTokenPrice, setCurrentTokenPrice] = useState<string>('');
	const [availableUSD, setAvailableUSD] = useState<String>('');
	const [nextBurnUSD, setNextBurnUSD] = useState<String>('');

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

	return (
		<>
			{treasuryBalance ? (
				<Card>
					<Grid columns={3} divided stackable>
						<Grid.Row>
							{/* Available Column */}
							<Grid.Column>
								{/* <h6>Available</h6>
								{result.value ? <div>{(Math.abs(Number(result.value.toString())) / 1.0e+6).toLocaleString() + 'M'}</div> : <div><Loader/></div>} */}
								<Grid columns={2} stackable>
									<Grid.Row
										only={'mobile tablet'}
										textAlign={'center'}
									>
										<Grid.Column width={4}>
											<Icon
												corner
												circular
												size='large'
												name='database'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Available
											<HelperTooltip content='Available funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.' />
											{result.value ? (
												<h6>
													{formatBnBalance(
														result.value.toString(),
														{
															numberAfterComma: 0,
															withUnit: true
														}
													)}
												</h6>
											) : (
												<div>
													<Loader />
												</div>
											)}
											{availableUSD
												? `~ $${availableUSD}`
												: 'loading...'}
										</Grid.Column>
									</Grid.Row>

									<Grid.Row
										only={'computer'}
										textAlign={'left'}
									>
										<Grid.Column width={4}>
											<Icon
												circular
												size='large'
												name='database'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Available
											<HelperTooltip content='Available funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.' />
											{result.value ? (
												<h6>
													{formatBnBalance(
														result.value.toString(),
														{
															numberAfterComma: 0,
															withUnit: true
														}
													)}
												</h6>
											) : (
												<div>
													<Loader />
												</div>
											)}
											{availableUSD
												? `~ $${availableUSD}`
												: 'loading...'}
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>

							{/* Spend Period Column */}
							<Grid.Column>
								<Grid columns={2} stackable>
									<Grid.Row
										only={'mobile tablet'}
										textAlign={'center'}
									>
										<Grid.Column width={4}>
											<Icon
												corner
												circular
												size='large'
												name='clock'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Spend Period
											<HelperTooltip content='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.' />
											<h6>
												{blockToTime(
													result.spendPeriod.toNumber(),
													blocktime
												)}
											</h6>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row
										only={'computer'}
										textAlign={'left'}
									>
										<Grid.Column width={4}>
											<Icon
												corner
												circular
												size='large'
												name='clock'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Spend Period
											<HelperTooltip content={ 'Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.' } />
											<h6>
												{blockToTime(
													result.spendPeriod.toNumber(),
													blocktime
												)}
											</h6>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>

							{/* Next Burn Column */}
							<Grid.Column>
								<Grid columns={2} stackable>
									<Grid.Row
										only={'mobile tablet'}
										textAlign={'center'}
									>
										<Grid.Column width={4}>
											<Icon
												corner
												circular
												size='large'
												name='fire'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Next Burn
											<HelperTooltip content='If the Treasury ends a spend period without spending all of its funds, it suffers a burn of a percentage of its funds.' />
											{result.burn ? (
												<h6>
													{formatBnBalance(
														result.burn.toString(),
														{
															numberAfterComma: 2,
															withUnit: true
														}
													)}
												</h6>
											) : (
												<div>
													<Loader />
												</div>
											)}
											{nextBurnUSD
												? `~ $${nextBurnUSD}`
												: 'loading...'}
										</Grid.Column>
									</Grid.Row>
									<Grid.Row
										only={'computer'}
										textAlign={'left'}
									>
										<Grid.Column width={4}>
											<Icon
												corner
												circular
												size='large'
												name='fire'
											/>
										</Grid.Column>

										<Grid.Column width={12}>
											Next Burn
											<HelperTooltip content='If the Treasury ends a spend period without spending all of its funds, it suffers a burn of a percentage of its funds.' />
											{result.burn ? (
												<h6>
													{formatBnBalance(
														result.burn.toString(),
														{
															numberAfterComma: 2,
															withUnit: true
														}
													)}
												</h6>
											) : (
												<div>
													<Loader />
												</div>
											)}
											{nextBurnUSD
												? `~ $${nextBurnUSD}`
												: 'loading...'}
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card>
			) : (
				<Loader />
			)}
		</>
	);
};

export default TreasuryOverview;
