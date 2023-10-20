import { FC } from 'react';
import { Button } from 'shared/ui/button/Button';
import Unicorn from '@/public/images/unicorn.svg';
import './EventJoining.scss';


interface FullForm {
	startDate: string;
	locale: string;
	title: string;
}

interface EventCreateProps {
	fullForm: FullForm;
}

export const EventCreate: FC<EventCreateProps> = ({ fullForm }) => {
	return (
		<>
			<div className="event-joining">
				<h2 className="title">Ура!</h2>
				<div className="event-joining__top">
					<p>Вы добавили новое событие:</p>
					<span className="name-red">{fullForm.title}</span>
				</div>
				<div className="event-joining__bottom">
					<div className="bottom-top">{fullForm.startDate}</div>
					<div className="bottom-top"> пятница | 21 сентября | 12:00</div>
					<div className="bottom">{fullForm.locale}</div>
				</div>
			</div>
			<div className="rock-hand">
				<img src={Unicorn} alt="" />
			</div>
			<Button>Отлично</Button>
		</>
	);
};
