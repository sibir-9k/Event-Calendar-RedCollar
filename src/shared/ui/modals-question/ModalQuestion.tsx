import { FC } from 'react';
import './ModalQuestion.scss';

interface ModalQuestionProps {
	setOpenQuestion: React.Dispatch<React.SetStateAction<boolean>>;
	setCloseQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalQuestion: FC<ModalQuestionProps> = ({ setOpenQuestion, setCloseQuestion }) => {
	return (
		<div className="btns-block">
			<button className="button-no" onClick={() => setOpenQuestion(false)}>
				Нет
			</button>
			<button type="button" className="button-yes" onClick={() => setCloseQuestion(true)}>
				Да
			</button>
		</div>
	);
};
