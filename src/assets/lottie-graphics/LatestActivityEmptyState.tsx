// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Image from 'next/image';
import React, { ReactElement, useState } from 'react';
import Lottie from 'react-lottie-player';

import LatestActivityJson from './lottie-files/latest-activity.json';

interface Props {
	width?: number
}

function LatestActivityEmptyState({ width = 80 }: Props): ReactElement {

	const [playing, setPlaying] = useState(false);

	console.log(playing);

	return (
		<div>
			<div
				style={{
					left: '50%',
					opacity: '70%',
					position: 'absolute',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<Image
					src='/static/Slash.svg'
					alt='Slash'
					width={70}
					height={70}
				/>
			</div>
			<Lottie
				animationData={LatestActivityJson}
				style={{
					height: width,
					left: '50%',
					position: 'absolute',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					width: width
				}}
				onMouseEnter={() => setPlaying(true)}
				onMouseLeave={() => setPlaying(false)}
				play={playing}
				goTo={playing ? undefined : 50}
			/>
		</div>
	);
}

export default LatestActivityEmptyState;
