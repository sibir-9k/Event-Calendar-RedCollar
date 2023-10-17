import { FC } from 'react';
import './ModalEventsDate.scss';

interface ModalEventsDateProps {
	eventDate: {
		location: string;
		dateStart: string;
	};
}

export const ModalEventsDate: FC<ModalEventsDateProps> = ({ eventDate }) => {
	function formatDate(dateString: string) {
		const date = new Date(dateString);

		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			hour: 'numeric',
			minute: 'numeric',
		};

		const formattedDate = date.toLocaleString('ru-RU', options);
		return formattedDate;
	}

	const formattedDate = formatDate(eventDate.dateStart);
	const weekDay = formattedDate.split(' ')[0];
	const day = formattedDate.split(' ')[1] + ' ' + formattedDate.split(' ')[2];
	const time = formattedDate.split(' ')[4];

	return (
		<div className="modal-date">
			<div className="date-top">
				<span>{weekDay}</span>
				<span>{day}</span>
				<span>{time}</span>
			</div>
			<div className="date-bottom">{eventDate.location}</div>
		</div>
	);
};
