import { FC } from 'react';
import './ModalQuestion.scss';

interface ModalQuestionProps {
	setOpenQuestion: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenCreateEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalQuestion: FC<ModalQuestionProps> = ({ setOpenQuestion, setOpenCreateEvent }) => {
	return (
		<div className="btns-block">
			<button className="button-no" onClick={() => setOpenQuestion(false)}>
				Нет
			</button>
			<button
				type="button"
				className="button-yes"
				onClick={() => {setOpenQuestion(false); setOpenCreateEvent(false)}}>
				Да
			</button>
		</div>
	);
};
