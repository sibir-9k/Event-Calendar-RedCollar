import { FC } from 'react';
// import { Button } from 'shared/ui/button/Button';
import Bird from '@/public/images/bird.svg';
import './EventJoiningError.scss';

interface EventJoiningErrorProps {
	setOpenErrorEventJoining: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventJoiningError: FC<EventJoiningErrorProps> = ({ setOpenErrorEventJoining }) => {
	return (
		<>
			<div className="event-joining-error">
				<h2 className="title-error">
					Что-то пошло <br /> не так
				</h2>
				<p className="error-text">Попробуйте позже</p>
			</div>
			<div className="bird">
				<img src={Bird} alt="" />
			</div>
			<button onClick={() => setOpenErrorEventJoining(false)}>Хорошо</button>
		</>
	);
};
