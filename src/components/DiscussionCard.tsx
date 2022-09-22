// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import * as moment from 'moment';
import React, { useContext } from 'react';
import { Icon } from 'semantic-ui-react';

import { UserDetailsContext } from '../context/UserDetailsContext';
import CreationLabel from '../ui-components/CreationLabel';

const DiscussionCard = styled.div`
	padding: 2rem 3rem 1.5rem 3rem;
	background-color: white;
	border-radius: 3px;
	box-shadow: box_shadow_card;
	transition: box-shadow .1s ease-in-out;

	&.own-post {
		border-left-width: 4px;
		border-left-style: solid;
		border-left-color: pink_primary;
		padding: calc(2rem - 4px);
	}
	&:hover {
		box-shadow: box_shadow_card_hover;
		text-decoration: none;
	}
	h4 {
		font-family: font_default;
		font-size: md;
		margin-bottom: 0.3rem;
	}
	ul {
		color: grey_secondary;
		font-size: xs;
		font-family: font_default;
		font-weight: 500;
		li {
			display: inline;
			margin-right: 1.5rem;
		}
	}

	@media only screen and (max-width: 576px) {
		& {
			padding: 1.2rem 1.5rem;
		}
	}
`;

export interface DiscussionProps {
  created_at: Date
  defaultAddress?: string | null
  comments?: string
  title: string
  username: string
  last_update?: Date
}

export default function Discussion ({
	created_at,
	defaultAddress,
	comments,
	title,
	username,
	last_update
}:DiscussionProps) {
	const currentUser = useContext(UserDetailsContext);
	const ownPost = currentUser.username === username;

	return (
		<DiscussionCard className={ownPost ? 'own-post' : ''}>
			<h4>{title}</h4>
			<CreationLabel
				created_at={created_at}
				defaultAddress={defaultAddress}
				username={username}
			/>
			<ul>
				<li><Icon name='comment' /> {comments} comments</li>
				{comments !== 'no' && last_update && <li><Icon name='reply' />commented {moment.utc(last_update, 'YYYY-MM-DDTHH:mm:ss.SSS').fromNow()}</li>}
			</ul>
		</DiscussionCard>
	);
}
