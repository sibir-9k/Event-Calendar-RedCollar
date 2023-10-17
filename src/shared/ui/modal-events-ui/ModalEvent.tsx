import { FC, useState } from 'react';
import { ModalEventsDate } from '..';
import { ModalEventsSlider } from '..';
import { ModalEventsText } from '..';
import { ModalEventsUsers } from '..';
import './ModalEvent.scss';

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
		extendedProps: {
			location: string;
			dateStart: string;
			description: string;
			participants: Participants[];
			photos: Photos[];
		};
	};
	// eslint-disable-next-line @typescript-eslint/ban-types
	openAuthModal: Function;
}

export const ModalEvent: FC<ModalEventProps> = ({ event, openAuthModal }) => {
	const [isAuth, setIsAuth] = useState(false);

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
			{!isAuth && (
				<h4 className="modal-bottom">
					<button className="auth-btn" onClick={() => openAuthModal()}>
						Войдите
					</button>
					, чтобы присоединиться к событию
				</h4>
			)}
		</>
	);
};
