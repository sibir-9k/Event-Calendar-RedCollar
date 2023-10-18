import { FC } from 'react';
import AvatarUser from '@/public/images/user-avatar.svg';
import './ModalEventUsers.scss';

interface EventParticipant {
	username: string;
	id: number;
}

interface ModalEventsUsersProps {
	eventParticipants: EventParticipant[];
	eventID: number;
}

export const ModalEventsUsers: FC<ModalEventsUsersProps> = ({ eventParticipants, eventID }) => {
	if (eventParticipants.length === 0) return null;
	const organiser = eventParticipants.find((user) => Number(eventID) === user.id);

	return (
		<div className="modal-users">
			<h3 className="users-title">Участники</h3>
			<div className="users">
				{organiser && (
					<div className="organiser">
						<img src={AvatarUser} alt={organiser.username} className="user-avatar" />
						<div className="organiser__name">
							<span className="user-name">{organiser.username}</span>
							<span className="organiser-label">Организатор</span>
						</div>
					</div>
				)}
				<div className="users-list">
					{eventParticipants.slice(1, 4).map((user: EventParticipant) => (
						<div className="user" key={user.id}>
							<img src={AvatarUser} alt={user.username} className="user-avatar" />
							<span className="user-name">{user.username}</span>
						</div>
					))}
					{eventParticipants.length > 5 && (
						<div className="user-mask">
							<span>+{eventParticipants.length - 5}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
