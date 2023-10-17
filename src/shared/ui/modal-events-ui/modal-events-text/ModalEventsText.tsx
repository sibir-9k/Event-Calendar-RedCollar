import { FC } from 'react';
import './ModalEventsText.scss';

interface ModalEventsTextProps {
	eventDescription: string;
}

export const ModalEventsText: FC<ModalEventsTextProps> = ({ eventDescription }) => {
	return <span className="modal-text">{eventDescription}</span>;
};
