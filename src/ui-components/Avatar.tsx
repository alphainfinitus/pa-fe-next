// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';

interface Props {
    className?: string
	username: string | null
	size?: 'sm' | 'md' | 'lg'
}

const Avatar = ({ className, username, size }: Props) => {

	return (
		<div className={size? `${className} ${size}` : className}>
			{username?.substring(0, 1)}
		</div>
	);
};

export default styled(Avatar)`
	border-radius: 50%;
	display: inline-block;
	vertical-align: top;
	overflow: hidden;
	text-transform: uppercase;
	text-align: center;
	background-color: grey_primary;
	color: white;
	&.sm {
		width: 2rem;
		height: 2rem;
		font-size: xs;
	}
	&.md {
		width: 3rem;
		height: 3rem;
		font-size: md;
	}
	&.lg {
		width: 4rem;
		height: 4rem;
		font-size: lg;
		line-height: 4rem;
	}
`;
