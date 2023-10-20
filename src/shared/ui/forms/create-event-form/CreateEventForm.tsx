import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UploadFile } from 'shared/ui/upload-file/UploadFile';
import { CustomDatePicker } from 'shared/ui/date-picker/CustomDatePicker';
import { UserSelector } from 'shared/ui/user-selector/UserSelector';
import { apiToken, apiTokenUploadImage } from 'app/api/config';
import { Modal } from 'widgets/modal/Modal';
import { EventJoining } from 'shared/ui/modals-body-reaction/event-joining/EventJoining';
import { EventJoiningError } from 'shared/ui/modals-body-reaction/event-joining-error/EventJoiningError';
import AvatarUser from '@/public/images/user-avatar.svg';

import './CreateEventForm.scss';

interface Participants {
	id: number;
	username: string;
}

interface Photos {
	id: number;
	name: string;
	url: string;
	src: string;
}

interface CreateEventForm {
	append(arg0: string, file: never): unknown;
	title: string;
	description: string;
	dateStart: string;
	dateEnd: string;
	location: string;
	participants: Participants[];
	time: string;
	photos: Photos[];
}

interface CreateEventFormProps {
	setOpenCreateEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateEventForm: FC<CreateEventFormProps> = ({ setOpenCreateEvent }) => {
	const { register, handleSubmit } = useForm();
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [formSelectedUsers, setFormSelectedUsers] = useState([]);
	const [openEventJoining, setOpenEventJoining] = useState(false);
	const [openErrorEventJoining, setOpenErrorEventJoining] = useState(false);
	const [fullForm, setFullForm] = useState([]);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [organiserName, setOrganiserName] = useState('');
	const [preview, setPreview] = useState(null);
	const [selectedImage, setSelectedImage] = useState([]);

	useEffect(() => {
		getMe();
	}, []);

	const getMe = async () => {
		try {
			const response = await apiToken.get('users/me');
			setOrganiserName(response.data.username);
		} catch (error) {
			console.log;
		}
	};

	const closeModal = () => {
		if (openEventJoining) {
			setOpenEventJoining(false);
		}
		if (openErrorEventJoining) {
			setOpenErrorEventJoining(false);
		}
	};

	const updateEventWithPhoto = async (newEventId) => {
		try {
			const response = await apiToken.put(`events/${newEventId}`, {
				photos: selectedImage,
			});

			return response.status;
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit: SubmitHandler<CreateEventForm> = async (formData) => {
		const { title, description, location, time } = formData;
		const updTime: string[] = time.split(':');
		const hours = parseInt(updTime[0]);
		const minutes = parseInt(updTime[1]);
		const date = startDate?.setHours(hours, minutes, 0);

		const formDataImage = new FormData();
		Array.from([...uploadedImages]).forEach((file) => {
			formDataImage.append('files', file);
		});

		if (formDataImage.getAll('files').length !== 0) {
			try {
				const response = await apiTokenUploadImage.post('upload', formDataImage);
				const selectedPhotosId = response.data.map((photo: { id: number }) => photo.id);
				setSelectedImage(selectedPhotosId);
			} catch (error) {
				console.log(error);
			}
		}

		try {
			const response = await apiToken.post('/events', {
				title,
				description,
				dateStart: date,
				location,
				participants: formSelectedUsers,
			});

			if (response.status === 200 || response.status === 204) {
				await updateEventWithPhoto(response.data.id);
			}

			setFullForm(response.data);
			setOpenEventJoining(true);
			setOpenCreateEvent(false);
		} catch (error) {
			console.log(error);
			setOpenErrorEventJoining(true);
			setOpenCreateEvent(false);
		}
	};

	return (
		<>
			<form className="create-event" onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="create-event__wrapper">
					<div className="left-block">
						<input type="text" {...register('title')} placeholder="Название*" required />
						<input
							className="description"
							type="text"
							{...register('description')}
							placeholder="Описание*"
							required
						/>
						<UserSelector
							{...register('participants')}
							setFormSelectedUsers={setFormSelectedUsers}
						/>
					</div>

					<div className="right-block">
						<div className="date-picker">
							<CustomDatePicker
								{...register('dateStart')}
								selected={startDate}
								onChange={(date: Date | null) => setStartDate(date)}
								placeholder="Начало*"
							/>
							<CustomDatePicker
								{...register('dateEnd')}
								selected={endDate}
								onChange={(date: Date | null) => setEndDate(date)}
								placeholder="Конец"
							/>
						</div>
						<input {...register('time')} type="text" placeholder="Время*" required />
						<input {...register('location')} type="text" placeholder="Место проведения*" required />
						<div className="organiser">
							<img src={AvatarUser} className="user-avatar" />
							<div className="organiser__name">
								<span className="user-name">{organiserName}</span>
								<span className="organiser-label">Организатор</span>
							</div>
						</div>
					</div>
				</div>
				<div className="bottom-block">
					<UploadFile
						{...register('photos')}
						uploadedImages={uploadedImages}
						setUploadedImages={setUploadedImages}
						setPreview={setPreview}
					/>
				</div>
				<button className="create-btn">Создать</button>
			</form>
			{openEventJoining && (
				<Modal title="" closeModal={closeModal}>
					<EventJoining fullForm={fullForm} />
				</Modal>
			)}

			{openErrorEventJoining && (
				<Modal title="" closeModal={closeModal}>
					<EventJoiningError setOpenErrorEventJoining={setOpenErrorEventJoining} />
				</Modal>
			)}
		</>
	);
};
