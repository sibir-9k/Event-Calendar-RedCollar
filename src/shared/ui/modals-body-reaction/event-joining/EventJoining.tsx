import { FC } from 'react';
import './EventJoining.scss';
import { Button } from 'shared/ui/button/Button';
import RockHand from '../../../../../public/images/rock-hand.svg';

export const EventJoining: FC = () => {
	return (
		<>
			<div className="event-joining">
				<h2 className="title">Поздравлям!</h2>
				<div className="event-joining__top">
					<p>Вы теперь участник события:</p>
					<span className="name-red">Фестиваль «Будущее»</span>
				</div>
				<div className="event-joining__bottom">
					<div className="bottom-top">пятница | 21 сентября | 12:00</div>
					<div className="bottom">г. Москва, Ленинградский проспект, 80</div>
				</div>
			</div>
			<div className="rock-hand">
				<img src={RockHand} alt="" />
			</div>
			<Button>Отлично</Button>
		</>
	);
};
