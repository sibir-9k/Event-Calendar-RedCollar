import { FC, useState } from 'react';
import { ModalEventsDate } from '..';
import { ModalEventsSlider } from '..';
import { ModalEventsText } from '..';
import { ModalEventsUsers } from '..';
// import { Button } from '../button/Button';
import './ModalEvent.scss';
import axios from 'axios';

interface Participants {
	id: number;
	username: string;
}

interface Photos {
	id: number;
	name: string;
	url: string;
	src: string;
}

interface ModalEventProps {
	event: {
		title: string;
		id: number;
		extendedProps: {
			location: string;
			dateStart: string;
			description: string;
			participants: Participants[];
			photos: Photos[];
		};
	};
	openAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
	isAuthUser: boolean;
}

export const ModalEvent: FC<ModalEventProps> = ({ event, openAuthModal, isAuthUser }) => {
	const [subscribedEvent, setSubscribedEvent] = useState(false);

	const joiningEvent = async () => {
		const token = localStorage.getItem('token');
		const idEvent = Number(event.id);

		try {
			const response = await axios.post(
				`https://planner.rdclr.ru/api/events/${idEvent}/join`,
				{},
				{
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const result = response.data;
			console.log(result);
			setSubscribedEvent(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className="modal-info">
				<ModalEventsDate eventDate={event.extendedProps} />
				<ModalEventsText eventDescription={event.extendedProps.description} />
			</div>
			{event.extendedProps.participants && (
				<ModalEventsUsers eventParticipants={event.extendedProps.participants} eventID={event.id} />
			)}
			{event.extendedProps.photos && <ModalEventsSlider eventPhoto={event.extendedProps.photos} />}
			{!isAuthUser ? (
				<h4 className="modal-bottom">
					<button className="auth-btn" onClick={() => openAuthModal()}>
						Войдите
					</button>
					, чтобы присоединиться к событию
				</h4>
			) : (
				<button className="custom-btn" onClick={() => joiningEvent()}>
					Присоединиться к событию
				</button>
			)}
			{subscribedEvent}
		</>
	);
};
