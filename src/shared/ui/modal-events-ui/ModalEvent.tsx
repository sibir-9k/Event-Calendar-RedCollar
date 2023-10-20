import { FC, useState } from 'react';
import { ModalEventsDate } from '..';
import { ModalEventsSlider } from '..';
import { ModalEventsText } from '..';
import { ModalEventsUsers } from '..';

import { Modal } from 'widgets/modal/Modal';
import { ModalQuestion } from '../modals-question/ModalQuestion';
import { apiToken } from 'app/api/config';
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
		id: string;
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
	const [subscribedEvent, setSubscribedEvent] = useState(true);
	const [openAskQuestion, setOpenAskQuestion] = useState(false);

	const joiningEvent = async () => {
		const idEvent = Number(event.id);
		try {
			const response = await apiToken.post(`events/${idEvent}/join`, {});
			const result = response.data;
			setSubscribedEvent(true);
		} catch (error) {
			console.log(error);
		}
	};

	const closeModal = () => {
		if (openAskQuestion) {
			setOpenAskQuestion(false);
		}
	};

	const leaveEvent = async () => {
		const idEvent = Number(event.id);
		try {
			const response = await apiToken.post(`events/${idEvent}/leave`, {});
			const result = response.data;
			console.log(result);
			setOpenAskQuestion(false);
			setSubscribedEvent(false);
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

			{!subscribedEvent ? (
				<h4 className="modal-bottom">
					Вы присоединились к событию. Если передумали, можете
					<button className="exit-btn" onClick={() => setOpenAskQuestion(true)}>
						{' '}
						отменить участие.
					</button>
				</h4>
			) : !isAuthUser ? (
				<h4 className="modal-bottom">
					<button className="auth-btn" onClick={() => openAuthModal(true)}>
						Войдите
					</button>
					, чтобы присоединиться к событию
				</h4>
			) : (
				<button className="custom-btn" onClick={() => joiningEvent()}>
					Присоединиться к событию
				</button>
			)}

			{openAskQuestion && (
				<Modal title="Вы действительно хотите отменить участие?" closeModal={closeModal}>
					<ModalQuestion setOpenAskQuestion={setOpenAskQuestion} leaveEvent={leaveEvent} />
				</Modal>
			)}
		</>
	);
};
