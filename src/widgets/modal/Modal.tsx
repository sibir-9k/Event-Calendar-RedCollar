import { FC, ReactNode } from 'react';
// import { ModalEventsDate, ModalEventsSlider, ModalEventsText, ModalEventsUsers } from 'shared/ui';
import CloseBtn from '../../../public/images/close.svg';

import './Modal.scss';

interface ModalProps {
	title: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	closeModal: Function;
	children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ title, closeModal, children }) => {
	return (
		<>
			<div className="modal">
				<div className="modal-block">
					<button className="btn-close" onClick={() => closeModal()}>
						<img src={CloseBtn} alt="" />
					</button>
					{title && <div className="modal-title">{title}</div>}
					{children}
				</div>
			</div>
		</>
	);
};
