import { FC, useEffect, useState } from 'react';
import { api } from 'app/api/config';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal } from 'widgets/modal/Modal';
import { ModalEvent } from 'shared/ui';
import { EmailForm } from 'shared/ui/forms/auth-form/EmailForm';
import { CreateEventForm } from 'shared/ui/forms/create-event-form/CreateEventForm';

import './Calendar.scss';
import { EventInput } from '@fullcalendar/core/index.js';

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

interface Event extends EventInput {
	title: string;
	id: number;
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
	const [events, setEvents] = useState<EventInput[]>([]);
	const [checkEmailInDB, setCheckEmailInDB] = useState(false);
	const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);

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

	const openAuthModal = (value) => {
		setCurrentEvent(null);
		setIsAuthModalOpen(value);
	};


	useEffect(() => {
		async function getEvents() {
			try {
				const response = await api.get('events?populate=*');
				const data = response.data.data;
				data.forEach((event: { start: string; dateStart: string; className?: string }) => {
					event.start = event.dateStart.split('T')[0];
					if (new Date(event.start) < new Date()) {
						event.className = 'past';
					}
				});
				setEvents(data as EventInput[]);
			} catch (error) {
				console.error(error);
			}
		}

		getEvents();
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEventClick = (info: any): void => {
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
					<ModalEvent event={currentEvent} openAuthModal={openAuthModal} isAuthUser={isAuthUser} />
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
