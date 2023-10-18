import { FC } from 'react';
import './ModalQuestion.scss';

interface ModalQuestionProps {
	setOpenAskQuestion: React.Dispatch<React.SetStateAction<boolean>>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	leaveEvent: Function;
}

export const ModalQuestion: FC<ModalQuestionProps> = ({ setOpenAskQuestion, leaveEvent }) => {
	return (
		<div>
			<button className="button-no" onClick={() => setOpenAskQuestion(false)}>
				Нет
			</button>
			<button className="button-yes" onClick={() => leaveEvent()}>
				Да
			</button>
		</div>
	);
};
