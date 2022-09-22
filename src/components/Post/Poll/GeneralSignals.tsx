// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useCallback, useContext, useState } from 'react';

import BlockCountdown from '../../../components/BlockCountdown';
import { UserDetailsContext } from '../../../context/UserDetailsContext';
import { PollQuery, PollQueryVariables, PollVotesQuery, PollVotesQueryVariables, useAddPollVoteMutation, useDeleteVoteMutation, useEditPollMutation } from '../../../generated/graphql';
import useCurrentBlock from '../../../hooks/useCurrentBlock';
import usePollEndBlock from '../../../hooks/usePollEndBlock';
import { Vote } from '../../../types';
import AyeNayButtons from '../../../ui-components/AyeNayButtons';
import ButtonLink from '../../../ui-components/ButtonLink';
import Card from '../../../ui-components/Card';
import FilteredError from '../../../ui-components/FilteredError';
import { Form } from '../../../ui-components/Form';
import GeneralChainSignalBar from '../../../ui-components/GeneralChainSignalBar';
import HelperTooltip from '../../../ui-components/HelperTooltip';

interface Props {
	ayes: number
	className?: string
	endBlock: number
	nays: number
	ownVote?: Vote | null
	pollId: number
	canEdit: boolean
	pollRefetch: (variables?: PollQueryVariables | undefined) => Promise<ApolloQueryResult<PollQuery>>
	votesRefetch: (variables?: PollVotesQueryVariables | undefined) => Promise<ApolloQueryResult<PollVotesQuery>>
}

const CouncilSignals = ({ ayes, className, endBlock, nays, ownVote, pollId, canEdit, pollRefetch, votesRefetch }: Props) => {
	const { id } = useContext(UserDetailsContext);
	const [error, setErr] = useState<Error | null>(null);
	const [addPollVoteMutation] = useAddPollVoteMutation();
	const [editPollMutation] = useEditPollMutation();
	const [deleteVoteMutation] = useDeleteVoteMutation();

	const currentBlockNumber = useCurrentBlock()?.toNumber() || 0;
	const pollEndBlock = usePollEndBlock();
	const canVote =  endBlock > currentBlockNumber;

	const cancelVote = useCallback(async () => {
		if (!id) {
			return;
		}

		try {
			await deleteVoteMutation({
				variables: {
					pollId,
					userId: id
				}
			});

			votesRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, deleteVoteMutation, pollId, votesRefetch]);

	const castVote = useCallback(async (vote: Vote) => {
		if (!id) {
			return;
		}

		try {
			await addPollVoteMutation({
				variables: {
					pollId,
					userId: id,
					vote
				}
			}).catch(console.error);

			votesRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, addPollVoteMutation, pollId, votesRefetch]);

	const extendsPoll = useCallback(async () => {
		if (!id) {
			return;
		}

		try {
			await editPollMutation({
				variables: {
					blockEnd: pollEndBlock,
					id: pollId
				}
			});

			pollRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, editPollMutation, pollEndBlock, pollId, pollRefetch]);

	return (
		<Card className={className}>
			<h3>Poll Signals <HelperTooltip content='This represents the off-chain votes of Polkassembly users including council members' /></h3>
			<GeneralChainSignalBar
				ayeSignals={ayes}
				naySignals={nays}
			/>
			<div>
				{error?.message && <FilteredError className='info' text={error.message}/>}
			</div>
			<Form standalone={false}>
				<AyeNayButtons
					className={`signal-btns ${ownVote}`}
					disabled={!id || !!ownVote || !canVote}
					onClickAye={() => castVote(Vote.AYE)}
					onClickNay={() => castVote(Vote.NAY)}
				/>
				<div>
					{ownVote && canVote &&
						<>
							<ButtonLink className='info text-muted cancelVoteLink' onClick={cancelVote}>
								Cancel {ownVote.toLowerCase()} vote
							</ButtonLink>
							<span className='separator'>•</span>
						</>
					}
					{canVote
						? <span>Poll ends in <BlockCountdown endBlock={endBlock}/></span>
						: <span>Poll ended. {canEdit
							? <ButtonLink className='info' onClick={extendsPoll}>Extend Poll</ButtonLink>
							: ''}
						</span>
					}
				</div>
			</Form>
		</Card>
	);
};

export default styled(CouncilSignals)`
	.separator {
		margin-left: 1rem;
		margin-right: 1rem;
	}

	.blockCountdown {
		display: inline;
		font-weight: 500;
	}

	.info {
		margin: 1em 0;
	}

	.errorText {
		color: red_secondary;
	}

	.signal-btns {
		margin-top: 2rem !important;
	}

	.AYE {
		.ui.button.ui.primary.positive.button {
			background-color: green_secondary !important;
			opacity: 1 !important;
		}
	}

	.NAY {
		.ui.button.ui.primary.negative.button{
			background-color: red_secondary !important;
			opacity: 1 !important;
		}
	}
`;
