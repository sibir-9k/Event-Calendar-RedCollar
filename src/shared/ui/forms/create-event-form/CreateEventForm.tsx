import { FC, SetStateAction, useEffect, useState } from 'react';
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
import { ModalQuestion } from 'shared/ui';

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

interface ICreateEventForm {
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
	setOpenSuccessfullyEvent: React.Dispatch<React.SetStateAction<boolean>>;
	setFullForm: React.Dispatch<SetStateAction<never[]>>;
	setOpenErrorEvent: React.Dispatch<React.SetStateAction<boolean>>;
	openQustion: boolean;
	setOpenQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
	id: string;
	username: string;
}

export const CreateEventForm: FC<CreateEventFormProps> = ({
	setOpenCreateEvent,
	setOpenSuccessfullyEvent,
	setFullForm,
	setOpenErrorEvent,
	openQustion,
	setOpenQuestion,
}) => {
	const { register, handleSubmit, formState } = useForm();
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [formSelectedUsers, setFormSelectedUsers] = useState<User[]>([]);
	const [openEventJoining, setOpenEventJoining] = useState(false);
	const [openErrorEventJoining, setOpenErrorEventJoining] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<File[]>([]);
	const [organiserName, setOrganiserName] = useState('');
	const [selectedImage, setSelectedImage] = useState([]);

	const { errors } = formState;

	useEffect(() => {
		getMe();
	}, []);

	const getMe = async () => {
		try {
			const response = await apiToken.get('users/me');
			setOrganiserName(response.data.username);
		} catch (error) {
			console.log(error);
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

	const updateEventWithPhoto = async (newEventId: unknown) => {
		try {
			const response = await apiToken.put(`events/${newEventId}`, {
				photos: selectedImage,
			});

			return response.status;
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit: SubmitHandler<ICreateEventForm> = async (formData) => {
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
			setOpenSuccessfullyEvent(true);
			setOpenEventJoining(true);
			setOpenCreateEvent(false);
		} catch (error) {
			console.log(error);
			setOpenErrorEventJoining(true);
			setOpenCreateEvent(false);
			setOpenErrorEvent(true);
		}
	};

	return (
		<>
			<form className="create-event" onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="create-event__wrapper">
					<div className="left-block">
						<div>
							<input
								type="text"
								{...register('title', { required: 'Заполните поле' })}
								placeholder="Название*"
							/>
							{errors?.title && <p className="error">{errors.title.message?.toString()}</p>}
						</div>
						<div>
							<textarea
								className="description"
								{...register('description', {
									required: 'Заполните поле',
								})}
								placeholder="Описание*"
								required
							/>
							{errors?.description && (
								<p className="error">{errors.description.message?.toString()}</p>
							)}
						</div>
						<UserSelector
							{...register('participants')}
							setFormSelectedUsers={setFormSelectedUsers}
						/>
					</div>

					<div className="right-block">
						<div className="date-picker">
							<div>
								<CustomDatePicker
									{...register('dateStart', { required: 'Заполните поле' })}
									selected={startDate}
									onChange={(date: Date | null) => setStartDate(date)}
									placeholder="Начало*"
								/>
								{errors?.dateStart && (
									<p className="error">{errors.dateStart.message?.toString()}</p>
								)}
							</div>

							<CustomDatePicker
								{...register('dateEnd')}
								selected={endDate}
								onChange={(date: Date | null) => setEndDate(date)}
								placeholder="Конец"
							/>
						</div>
						<div>
							<input
								{...register('time', { required: 'Заполните поле' })}
								type="text"
								placeholder="Время*"
								required
							/>
							{errors?.time && <p className="error">{errors.time.message?.toString()}</p>}
						</div>
						<div>
							<input
								{...register('location', { required: 'Заполните поле' })}
								type="text"
								placeholder="Место проведения*"
								required
							/>
							{errors?.location && <p className="error">{errors.location.message?.toString()}</p>}
						</div>

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
					/>
				</div>
				<button type="submit" className="create-btn">
					Создать
				</button>
			</form>
			{openQustion && (
				<Modal title="Передумали создавать событие?" closeModal={() => setOpenQuestion(false)}>
					<ModalQuestion
						setOpenQuestion={setOpenQuestion}
						setOpenCreateEvent={setOpenCreateEvent}
					/>
				</Modal>
			)}
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
