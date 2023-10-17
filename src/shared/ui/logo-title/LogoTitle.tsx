import { FC } from 'react';
import logo from '../../../../public/images/logo.svg';
import './LogoTitle.scss';

export const LogoTitle: FC = () => {
	return (
		<div className="logo-title">
			<img className="logo" src={logo} alt="Logo RedCollar" />
			<h3 className="title">red collar</h3>
		</div>
	);
};
