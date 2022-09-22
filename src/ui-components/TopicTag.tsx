// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Label } from 'semantic-ui-react';

interface Props{
	className?: string,
	topic: string
}

const TopicTag = ({ className, topic }: Props) => {

	return (
		<Label
			className={`${className} ${topic}`}
			content={topic}
		/>
	);
};

export default styled(TopicTag)`
	&.ui.label {
		font-size: xs;
		font-weight: 500;
		background-color: grey_primary;
		color: grey_text;
		border-style: solid;
		border-width: 1px;
		border-radius: 0.2rem;
		letter-spacing: 0.05rem;
		text-transform: capitalize;
		padding: 0.4rem 0.6rem;

		@media only screen and (max-width: 576px) {
			padding: 0.2rem 0.4rem;
		}
	}
	&.Democracy {
		background-color: blue_primary !important;
		color: white;
	}
	&.Council {
		background-color: pink_secondary !important;
		color: white;
	}
	&.Treasury {
		background-color: pink_primary !important;
		color: white;
	}
	&.Tech {
		background-color: pink_primary !important;
		color: white;
	}
`;
