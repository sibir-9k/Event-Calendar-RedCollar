import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { api, apiToken } from 'app/api/config';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal } from 'widgets/modal/Modal';
import { EventCreate, EventJoiningError, ModalEvent } from 'shared/ui';
import { EmailForm } from 'shared/ui/forms/auth-form/EmailForm';
import { CreateEventForm } from 'shared/ui/forms/create-event-form/CreateEventForm';
import { EventInput } from '@fullcalendar/core/index.js';
import './Calendar.scss';

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
	id: string;
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
	const [myId, setMyId] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);
	const [openSuccessfullyEvent, setOpenSuccessfullyEvent] = useState(false);
	const [fullForm, setFullForm] = useState([]);
	const [openErrorEvent, setOpenErrorEvent] = useState(false);
	const [openQustion, setOpenQuestion] = useState(false);

	const closeModal = () => {
		if (currentEvent !== null) {
			setCurrentEvent(null);
		}

		if (isAuthModalOpen) {
			setIsAuthModalOpen(false);
			setCheckEmailInDB(true);
		}

		if (openCreateEvent) {
			setOpenQuestion(true);
		}

		if (openSuccessfullyEvent) {
			setOpenSuccessfullyEvent(false);
		}

		if (openErrorEvent) {
			setOpenErrorEvent(false);
		}
	};

	const openAuthModal = (value: boolean) => {
		setCurrentEvent(null);
		setIsAuthModalOpen(value);
	};

	const getMyInfo = async () => {
		const response = await apiToken.get('users/me');

		setMyId(response.data.id);
	};

	useEffect(() => {
		getMyInfo();
	}, []);

	useEffect(() => {
		async function getEvents() {
			try {
				const response = await api.get('events?pagination[pageSize]=50&populate=*');
				const data = response.data.data;
				data.forEach(
					(event: {
						[x: string]: any;
						owner: any;
						start: string;
						dateStart: string;
						className?: string;
					}) => {
						event.start = event.dateStart.split('T')[0];
						if (new Date(event.start) < new Date()) {
							event.className = 'past';
						}
					}
				);

				setEvents(data as EventInput[]);
			} catch (error) {
				console.error(error);
			}
		}
		getEvents();

		return getEvents;
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEventClick = useCallback((info: EventClickArg) => {
		setCurrentEvent(info.event);
	}, []);

	const сustomButton = useMemo(
		() => ({
			text: 'Войти',
			click: () => {
				setIsAuthModalOpen(true);
			},
		}),
		[]
	);

	const createEventButton = useMemo(
		() => ({
			text: '+',
			click: () => {
				setOpenCreateEvent(true);
			},
		}),
		[]
	);

	function renderEventContent(arg: {
		event: { classNames: string[]; title: string; extendedProps: { owner: { id: number } } };
	}) {
		const { event } = arg;
		const classNames = [...event.classNames];

		if (event.extendedProps.owner?.id === myId) {
			classNames.push('owner');
		} else {
			const isGuest = arg.event.extendedProps.participants?.some(
				(participant) => participant.id === myId
			);
			if (isGuest) {
				classNames.push('guest');
			}
		}

		return <div className={`fc-event-title ${classNames.join(' ')}`}>{event.title}</div>;
	}

	const eventClassNames = (arg: { event: { extendedProps: { className: string } } }) => {
		const classNames = [];
		if (arg.event.extendedProps.className === 'past') {
			classNames.push('past');
		}
		return classNames;
	};

	console.log(closeQuestion);

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
					eventClassNames={eventClassNames}
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
					eventClassNames={eventClassNames}
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
					<CreateEventForm
						setOpenQuestion={setOpenQuestion}
						openQustion={openQustion}
						setOpenCreateEvent={setOpenCreateEvent}
						setOpenSuccessfullyEvent={setOpenSuccessfullyEvent}
						setFullForm={setFullForm}
						setOpenErrorEvent={setOpenErrorEvent}
					/>
				</Modal>
			)}
			{openSuccessfullyEvent && (
				<Modal title="" closeModal={closeModal}>
					<EventCreate fullForm={fullForm} />
				</Modal>
			)}
			{openErrorEvent && (
				<Modal title="" closeModal={closeModal}>
					<EventJoiningError setOpenErrorEvent={setOpenErrorEvent} />
				</Modal>
			)}
		</>
	);
};
