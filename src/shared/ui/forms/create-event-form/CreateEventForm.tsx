import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import './CreateEventForm.scss';
import { UploadFile } from './UploadFile/UploadFile';
import { CustomDatePicker } from './DatePicker/DatePicker';

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
	title: string;
	description: string;
	dateStart: string;
	dateEnd: string;
	location: string;
	participants: Participants[];
	time: string;
	photos: Photos[];
}

export const CreateEventForm: FC = () => {
	const { register, handleSubmit } = useForm();
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const onSubmit: SubmitHandler<CreateEventForm> = (formData) => {
		console.log(formData);
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
						<input type="text" {...register('participants')} placeholder="Участники" />
						<UploadFile register={register} name="photos" />
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
					</div>
				</div>
				<button className="create-btn">Создать</button>
			</form>
			{/* {uploadedImages.length > 0 && (
				<div className="uploaded-images">
					{uploadedImages.map((url, index) => (
						<img key={index} src={url} alt={`Uploaded Image ${index}`} width="200" height="100" />
					))}
				</div>
			)} */}
		</>
	);
};
