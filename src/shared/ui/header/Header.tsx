import { FC } from 'react';
import { LogoTitle } from '../logo-title/LogoTitle';
import './Header.scss';

export const Header: FC = () => {
	return (
		<div className="header">
			<LogoTitle />
			<h2 className="header-title">
				planner <p className="red">event</p>
			</h2>
		</div>
	);
};
