// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { ReactNode, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

interface Props{
	children?: ReactNode
	className?: string
	content?: string
	dismissable?: boolean
	name: string
	title: string
}

const InfoBox = ({ children, className, content, dismissable, name, title }: Props) => {
	const localStorageName = name + 'Visible';
	const [infoVisible, setInfoVisible] = useState<boolean>(false);

	useEffect(() => {
		const infoBoxVisible = localStorage.getItem(localStorageName);

		if (infoBoxVisible === null) {
			localStorage.setItem(localStorageName, 'true');
			setInfoVisible(true);
		}else{
			setInfoVisible(infoBoxVisible === 'true');
		}
	}, [localStorageName]);

	const handleClose = () => {
		if(typeof localStorage != 'undefined') {
			localStorage.setItem(localStorageName, 'false');
			setInfoVisible(false);
		}
	};

	return (
		<>
			{infoVisible &&
			<div className={className}>
				<h4>{title}</h4>
				{dismissable &&
				<div className='close'>
					<MdClose
						onClick={handleClose}
					/>
				</div>}
				<p>{content}</p>
				{children}
			</div>}
		</>
	);
};

export default styled(InfoBox)`
	background-color: white;
	color: black_text;
	font-size: sm;
	border-radius: 6px;
	box-shadow: box_shadow_card;
	padding: 2rem 3rem;
	position: relative;
	margin-bottom: 2rem;

	h4 {
		margin-bottom: 1.2rem;
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: lg;
		&:hover {
			color: grey_secondary;
			cursor: pointer;
		}
	}

	a {
		color: black_text;
		text-decoration: underline;
		&:hover {
			color: grey_primary;
			text-decoration: underline;
		}
	}
`;
