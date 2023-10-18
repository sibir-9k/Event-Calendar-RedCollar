import { DragEvent, FC, useState, useRef, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import './CreateEventForm.scss';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './DatePicker.scss';
// import ru from '@fullcalendar/core/locales/ru.js';
registerLocale('ru', ru);

export const CreateEventForm: FC = () => {
	const { register, handleSubmit } = useForm();
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [drag, setDrag] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	setDefaultLocale('ru');

	const dragStartHandler = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDrag(true);
	};

	const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDrag(false);
	};

	const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		let filesPictures = [...e.dataTransfer.files];

		const formData = new FormData();
		filesPictures.map((picture) => {
			formData.append('file', picture);
		});

		// Upload the files to the server and get the URLs of the uploaded images
		// You can use a library like axios to make the API request
		// Here, I'm assuming you have a function called uploadImages that returns a Promise with the URLs
		uploadImages(formData);
	};

	const uploadImages = async (formData: FormData) => {
		const token = localStorage.getItem('token');
		try {
			const response = await axios.post(`https://planner.rdclr.ru/api/upload`, formData, {
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					Authorization: `Bearer ${token}`,
				},
			});
			const result = response.data;
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	const openFileExplorer = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			// Handle the selected files here
			console.log(files);
		}
	};

	return (
		<>
			<form className="create-event">
				<div className="create-event__wrapper">
					<div className="left-block">
						<input type="text" {...register('title')} placeholder="Название" />
						<input
							className="description"
							type="text"
							{...register('description')}
							placeholder="Описание"
						/>
						<input type="text" {...register('participants')} placeholder="Участники" />
						<div
							className="drag"
							onDragStart={(e) => dragStartHandler(e)}
							onDragLeave={(e) => dragLeaveHandler(e)}
							onDragOver={(e) => dragStartHandler(e)}
							onDrop={(e) => onDropHandler(e)}
							onClick={openFileExplorer}>
							Выберите фото или перетащите сюда
						</div>
						<input
							type="file"
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleFileSelect}
							multiple
						/>
					</div>
					<div className="right-block">
						<div className="date-picker">
							<DatePicker
								{...register('dayStartEvent')}
								selected={startDate}
								onChange={(date: SetStateAction<Date>) => setStartDate(date)}
								locale={ru}
								required
							/>
							<DatePicker
								{...register('dayEndEvent')}
								selected={endDate}
								onChange={(date: SetStateAction<Date>) => setEndDate(date)}
								locale={ru}
								required
							/>
						</div>
						<input {...register('time')} type="text" placeholder="Время" />
						<input {...register('venue')} type="text" placeholder="Место проведения" />
					</div>
				</div>
				<button>Создать</button>
			</form>
			{uploadedImages.length > 0 && (
				<div className="uploaded-images">
					{uploadedImages.map((url, index) => (
						<img key={index} src={url} alt={`Uploaded Image ${index}`} width="200" height="100" />
					))}
				</div>
			)}
		</>
	);
};
