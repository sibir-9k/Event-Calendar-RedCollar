import { FC } from 'react';
import Unicorn from '@/public/images/unicorn.svg';
import './EventJoining.scss';
import { ModalEventsDate } from 'shared/ui';

interface FullForm {
	startDate: string;
	locale: string;
	title: string;
}

interface EventCreateProps {
	fullForm: FullForm;
}

export const EventCreate: FC<EventCreateProps> = ({ fullForm }) => {
	console.log(fullForm);
	return (
		<>
			<div className="event-joining">
				<h2 className="title">Ура!</h2>
				<div className="event-joining__top">
					<p>Вы добавили новое событие:</p>
					<span className="name-red">{fullForm.title}</span>
				</div>
				<div className="event-joining__bottom">
					{/* <ModalEventsDate eventDate={fullForm.startDate} /> */}
					<div className="bottom">{fullForm.locale}</div>
				</div>
			</div>
			<div className="rock-hand">
				<img src={Unicorn} alt="" />
			</div>
			<button className="custom-btn">Отлично</button>
		</>
	);
};
