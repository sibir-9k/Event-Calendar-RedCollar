import { FC, useState, useEffect, forwardRef, ForwardedRef } from 'react';
import UserAvatar from '@/public/images/user-avatar.svg';
import { apiToken } from 'app/api/config';
import './UserSelector.scss';

interface User {
	id: string;
	username: string;
}

interface UserSelectorProps {
	setFormSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserSelector: FC<UserSelectorProps> = forwardRef(
	({ setFormSelectedUsers }: UserSelectorProps, ref: ForwardedRef<HTMLDivElement>) => {
		const [isOpen, setIsOpen] = useState(false);
		const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
		const [users, setUsers] = useState<User[]>([]);
		useEffect(() => {
			getListUsers();
		}, []);
		const getListUsers = async () => {
			try {
				const response = await apiToken.get('/users');
				setUsers(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const handleToggle = () => {
			setIsOpen(!isOpen);
		};
		const handleUserSelect = (user: User) => {
			const updatedSelectedUsers = [...selectedUsers, user];
			setSelectedUsers(updatedSelectedUsers);
			setUsers(users.filter((u) => u.id !== user.id));
			setFormSelectedUsers(updatedSelectedUsers);
		};
		const handleUserRemove = (user: User) => {
			const updatedSelectedUsers = selectedUsers.filter((u) => u.id !== user.id);
			setSelectedUsers(updatedSelectedUsers);
			setUsers([...users, user]);
			setFormSelectedUsers(updatedSelectedUsers);
		};
		return (
			<div>
				<div className="select-input" onClick={handleToggle}>
					{selectedUsers.length > 0
						? selectedUsers.map((user) => (
								<div className="selected-user" key={user.id} onClick={() => handleUserRemove(user)}>
									<img className="select-avatar" src={UserAvatar} alt={user.username} />
									<p>{user.username} ✕</p>
								</div>
						  ))
						: 'Участники'}
				</div>
				{isOpen && (
					<div className="users-list">
						{users.map((user) => (
							<div className="user" key={user.id} onClick={() => handleUserSelect(user)}>
								<img className="avatar" src={UserAvatar} alt={user.username} />
								{user.username}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
);
