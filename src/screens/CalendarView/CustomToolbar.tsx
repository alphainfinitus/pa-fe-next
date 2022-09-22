// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownProps, Popup } from 'semantic-ui-react';

import NetworkSelect from './NetworkSelect';

function CustomToolbar(props: any) {
	let months = [
		{ key: '0', text: 'January', value: 0 },
		{ key: '1', text: 'February', value: 1 },
		{ key: '2', text: 'March', value: 2 },
		{ key: '3', text: 'April', value: 3 },
		{ key: '4', text: 'May', value: 4 },
		{ key: '5', text: 'June', value: 5 },
		{ key: '6', text: 'July', value: 6 },
		{ key: '7', text: 'August', value: 7 },
		{ key: '8', text: 'September', value: 8 },
		{ key: '9', text: 'October', value: 9 },
		{ key: '10', text: 'November', value: 10 },
		{ key: '11', text: 'December', value: 11 }
	];

	const viewStateOptions = [
		{ key: 'month', text: 'Month', value: 'month' },
		{ key: 'week', text: 'Week', value: 'week' },
		{ key: 'day', text: 'Day', value: 'day' },
		{ key: 'agenda', text: 'Agenda', value: 'agenda' }
	];

	if(props.small) {
		months = [
			{ key: '0', text: 'Jan', value: 0 },
			{ key: '1', text: 'Feb', value: 1 },
			{ key: '2', text: 'Mar', value: 2 },
			{ key: '3', text: 'Apr', value: 3 },
			{ key: '4', text: 'May', value: 4 },
			{ key: '5', text: 'Jun', value: 5 },
			{ key: '6', text: 'Jul', value: 6 },
			{ key: '7', text: 'Aug', value: 7 },
			{ key: '8', text: 'Sep', value: 8 },
			{ key: '9', text: 'Oct', value: 9 },
			{ key: '10', text: 'Nov', value: 10 },
			{ key: '11', text: 'Dec', value: 11 }
		];
	}

	const [viewState, setViewState] = useState<string>('month');
	const [selectedMonth, setSelectedMonth] = useState<number>(props.date.getMonth());

	function addMonths(date:any, months: any) {
		const d = date.getDate();
		date.setMonth(date.getMonth() + months);
		if (date.getDate() != d) {
			date.setDate(0);
		}

		setSelectedMonth(date.getMonth());
		return date;
	}

	function addWeeks(date: any, weeks: any) {
		date.setDate(date.getDate() + 7 * weeks);
		setSelectedMonth(date.getMonth());
		return date;
	}

	function addDays(date: any, days: any) {
		date.setDate(date.getDate() + days);
		setSelectedMonth(date.getMonth());
		return date;
	}

	const goToBack = () => {
		if (viewState === 'month' || viewState === 'agenda') {
			props.onNavigate('prev', addMonths(props.date, -1));
		} else if (viewState === 'week') {
			props.onNavigate('prev', addWeeks(props.date, -1));
		} else {
			props.onNavigate('prev', addDays(props.date, -1));
		}
	};

	const goToNext = () => {
		if (viewState === 'month' || viewState === 'agenda') {
			props.onNavigate('next', addMonths(props.date, +1));
		} else if (viewState === 'week') {
			props.onNavigate('next', addWeeks(props.date, +1));
		} else {
			props.onNavigate('next', addDays(props.date, +1));
		}
	};

	const goToToday = () => {
		const now = new Date();
		props.date.setMonth(now.getMonth());
		props.date.setYear(now.getFullYear());
		props.date.setDate(now.getDate());
		setSelectedMonth(now.getMonth());
		props.setMiniCalendarToToday();
		props.onNavigate('current');
	};

	const onSelectMonthChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedMonth(Number(data.value));
		const now = new Date();
		props.date.setMonth(data.value);
		props.date.setYear(now.getFullYear());
		props.date.setDate(now.getDate());
		props.onNavigate('current');
	};

	const onViewStateChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setViewState(`${data.value}`);
		props.onView(`${data.value}`);
	};

	useEffect(() => {
		setSelectedMonth(props.date.getMonth());
		const now = new Date();
		props.date.setMonth(props.date.getMonth());
		props.date.setYear(now.getFullYear());
		props.onNavigate('current');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setViewState(`${props.view}`);
	},[props.view]);

	function createEventButton(disabled:boolean = false){
		return <Button basic className={`${disabled ? 'btn-disabled' : ''} create-event-btn`} onClick={() => { if(!disabled) props.setSidebarCreateEvent(true); } }>Create Event</Button>;
	}

	return (
		props.date && <div className={`custom-calendar-toolbar ${props.small || props.width < 768 ? 'small' : ''}`} style={ !props.small && !(props.width <= 991) ? { marginLeft: -props.leftPanelWidth } : { marginLeft: 0 } }>
			{!props.small && !(props.width < 768) ?
				<>
					<NetworkSelect selectedNetwork={props.selectedNetwork} setSelectedNetwork={props.setSelectedNetwork} />
					<div className='select-div'>
						<label>Type</label>
						<Dropdown compact value={viewState} onChange={onViewStateChange} options={viewStateOptions} />
					</div>
					<span className='date-text'>{moment(props.date).format('MMMM YYYY')}</span>
					<Button onClick={goToBack} icon='chevron left' />
					<Button onClick={goToNext} icon='chevron right' />

					{/* <Button className='search-btn' icon='search' /> */}
					<div className="right-actions">
						<Button basic className='today-btn' onClick={goToToday}>Today</Button>

						{
							!props.isLoggedIn ?
								<Popup content='Please login to create an event' position='left center' size='large' trigger={createEventButton(true)} />
								:
								createEventButton()
						}
					</div>
				</>
				:
				<>
					<div className='d-flex'>
						<Dropdown compact className='select-month-dropdown' value={selectedMonth} onChange={onSelectMonthChange} options={months} />

						<div className='mobile-cal-nav'>
							<Button onClick={goToBack} icon='chevron left' />
							<Button onClick={goToNext} icon='chevron right' />
						</div>
					</div>

					<span className='year-text'>{moment(props.date).format('YYYY')}</span>

					<div className='actions-right'>
						{/* <Button className='search-btn' icon='search' /> */}
						<Image src='/static/calendar_today.png' className='today-btn-img' onClick={goToToday} height={16} width={16} title='Today' alt='Today' />
						<Dropdown upward={false} compact className='select-view-dropdown' value={viewState} onChange={onViewStateChange} options={viewStateOptions} />

						{!props.small ?
							!props.isLoggedIn ?
								<Popup content='Please login to create an event' position='left center' size='large' trigger={createEventButton(true)} />
								:
								createEventButton()
							: null
						}

						{/* {!props.small && <Button basic className='create-event-btn' onClick={() => props.setSidebarCreateEvent(true)}>Create Event</Button>} */}
					</div>
				</>
			}
		</div>
	);
}

export default CustomToolbar;