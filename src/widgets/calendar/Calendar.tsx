import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal } from 'widgets/modal/Modal';
import { ModalEvent } from 'shared/ui';
import { EmailForm } from 'shared/ui/forms/auth-form/EmailForm';
import userAvatar from '../../../public/images/user-avatar.svg';

import './Calendar.scss';
import {
	CreateEventForm,
	CreateEventFrom,
} from 'shared/ui/forms/create-event-form/CreateEventForm';

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

interface Event {
	title: string;
	extendedProps: {
		location: string;
		dateStart: string;
		description: string;
		participants: Participants[];
		photos: Photos[];
	};
}

export const Calendar: FC<Event> = () => {
	const [isAuthUser, setIsAuthUser] = useState(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [checkEmailInDB, setCheckEmailInDB] = useState(false);
	const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [userAvatar, setUserAvatar] = useState('');
	const [openCreateEvent, setOpenCreateEvent] = useState(false);

	// 1 способ
	const closeModal = () => {
		if (currentEvent) {
			setCurrentEvent(null);
		}

		if (isAuthModalOpen) {
			setIsAuthModalOpen(false);
			setCheckEmailInDB(true);
		}

		if (openCreateEvent) {
			setOpenCreateEvent(false);
		}
	};

	const openAuthModal = () => {
		setCurrentEvent(null);
		setIsAuthModalOpen(true);
	};

	useEffect(() => {
		async function getEvents() {
			try {
				const response = await axios.get('https://planner.rdclr.ru/api/events?populate=*');
				const data = response.data.data;
				data.forEach((event: { start: string; dateStart: string; className?: string }) => {
					event.start = event.dateStart.split('T')[0];
					if (new Date(event.start) < new Date()) {
						event.className = 'past';
					}
				});
				setEvents(data);
			} catch (error) {
				console.error(error);
			}
		}

		getEvents();
	}, []);

	const handleEventClick = (info): void => {
		setCurrentEvent(info.event);
	};

	const сustomButton = {
		text: 'Войти',
		click: function () {
			setIsAuthModalOpen(true);
		},
	};
	const createEventButton = {
		text: '+',
		click: function () {
			setOpenCreateEvent(true);
		},
	};

	function renderEventContent(arg: { event: { classNames: string[]; title: string } }) {
		return <div className={`fc-event-title ${arg?.event?.classNames[0]}`}>{arg.event.title}</div>;
	}

	return (
		<>
			{isAuthUser ? (
				<FullCalendar
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					locale="ru"
					firstDay={1}
					selectable={true}
					titleFormat={{ month: 'long' }}
					height={821}
					customButtons={{
						createEventButton,
						// userAvatarButton: {
						// 	text: `<img src="${userAvatar}" alt="User Avatar" />`,
						// 	click: function () {
						// 		// Действия при нажатии на иконку с аватаром пользователя
						// 	},
						// },
					}}
					events={events}
					eventClick={handleEventClick}
					headerToolbar={{
						start: '',
						center: '',
						end: 'title prev,next createEventButton userAvatarButton',
					}}
					eventContent={renderEventContent}
					eventClassNames={(arg) => {
						const classNames = [];
						if (arg.event.extendedProps.className === 'past') {
							classNames.push('past');
						}
						return classNames;
					}}
				/>
			) : (
				<FullCalendar
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					locale="ru"
					firstDay={1}
					selectable={true}
					titleFormat={{ month: 'long' }}
					height={821}
					customButtons={{ сustomButton }}
					events={events}
					eventClick={handleEventClick}
					headerToolbar={{
						start: '',
						center: '',
						end: 'title prev,next сustomButton',
					}}
					eventContent={renderEventContent}
					eventClassNames={(arg) => {
						const classNames = [];
						if (arg.event.extendedProps.className === 'past') {
							classNames.push('past');
						}
						return classNames;
					}}
				/>
			)}
			{currentEvent && (
				<Modal title={currentEvent.title} closeModal={closeModal}>
					<ModalEvent event={currentEvent} openAuthModal={openAuthModal} />
				</Modal>
			)}
			{isAuthModalOpen && (
				<Modal title="Войти" closeModal={closeModal}>
					<EmailForm
						checkEmail={checkEmailInDB}
						setCheckEmail={setCheckEmailInDB}
						setIsAuthUser={setIsAuthUser}
						setIsAuthModalOpen={setIsAuthModalOpen}
					/>
				</Modal>
			)}
			{openCreateEvent && (
				<Modal title="Создание события" closeModal={closeModal}>
					<CreateEventForm />
				</Modal>
			)}
		</>
	);
};
