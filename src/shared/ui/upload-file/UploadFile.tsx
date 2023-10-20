// import styles from './fileInput.module.scss';
import { useState, useRef } from 'react';
import './UploadFile.scss';
import { apiTokenUploadImage } from 'app/api/config';

interface UploadFileProps {
	uploadedImages: File[];
	setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
	setImage: React.Dispatch<React.SetStateAction<File[]>>;
}

export function UploadFile({
	uploadedImages,
	setUploadedImages,
	setPreview,
}: UploadFileProps): JSX.Element {
	const [previewUrl, setPreviewUrl] = useState<string[]>([]);
	const fileInput = useRef<HTMLInputElement>(null);

	const handleFile = async (file) => {
		// const formData = new FormData();

		// console.log(file);

		setUploadedImages((uploadedImages) => [...uploadedImages, file]);
		setPreviewUrl((previewUrl) => [...previewUrl, URL.createObjectURL(file)]);

		// previewUrl.forEach((file) => {
		// 	formData.append('files', file);
		// });

		// console.log(formData.getAll('files'));


		// try {
		// 	const response = await apiTokenUploadImage.post('upload', formData);
		// 	const result = response.data;
		// 	console.log(result);
		// 	setUploadedImages((uploadedImages) => [...uploadedImages, file]);
		// 	setPreviewUrl((previewUrl) => [...previewUrl, URL.createObjectURL(file)]);
		// } catch (error) {
		// 	console.log(error);
		// }
	};

	// const handleFile = async (file) => {
	// 	const formData = new FormData();

	// 	console.log(file);

	// 	// Add the file to the uploadedImages array
	// 	setUploadedImages((uploadedImages) => [...uploadedImages, file]);

	// 	// Create a preview URL for the file and add it to the previewUrl array
	// 	setPreviewUrl((previewUrl) => [...previewUrl, URL.createObjectURL(file)]);

	// 	console.log(previewUrl);

	// 	// Append each preview URL to the formData
	// 	previewUrl.forEach((url) => {
	// 		formData.append('files', url);
	// 	});

	// 	console.log(formData);

	// 	// Send the formData to the server and the database
	// 	try {
	// 		const response = await apiTokenUploadImage.post('upload', formData);
	// 		const result = response.data;
	// 		console.log(result);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
	};

	const handleOnDrop = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		const imageFile = e.dataTransfer.files[0];
		handleFile(imageFile);
	};

	const handleDeletePreviewImg = (e: React.MouseEvent<HTMLDivElement>): void => {
		const url = (e.target as HTMLImageElement).src;
		const newPreviewUrls = previewUrl.filter((item) => item !== url);
		setPreview(newPreviewUrls);
	};

	const preview =
		previewUrl &&
		previewUrl.map((item, index) => {
			return (
				<div className="img" key={index} onClick={handleDeletePreviewImg}>
					<img src={item} alt="image" />
				</div>
			);
		});

	return (
		<div className="wr">
			<div
				className="drag-drop"
				onDragOver={handleDragOver}
				onDrop={handleOnDrop}
				onClick={() => fileInput.current?.click()}>
				<input
					className="input"
					type="file"
					accept="image/*"
					ref={fileInput}
					onChange={(e) => handleFile(e.target.files[0])}
				/>
				<span className="text">Выберите фото или перетащите сюда</span>
			</div>
			<div className="imgs">{preview}</div>
		</div>
	);
}
