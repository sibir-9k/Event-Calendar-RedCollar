import { useState, useRef, SetStateAction } from 'react';
import './UploadFile.scss';

interface UploadFileProps {
	uploadedImages: File[];
	setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
	setImage: React.Dispatch<React.SetStateAction<File[]>>;
	setPreview: React.Dispatch<SetStateAction<null>>;
}

export function UploadFile({ setUploadedImages, setPreview }: UploadFileProps): JSX.Element {
	const [previewUrl, setPreviewUrl] = useState<string[]>([]);
	const fileInput = useRef<HTMLInputElement>(null);

	const handleFile = async (file: File) => {
		setUploadedImages((uploadedImages) => [...uploadedImages, file]);
		setPreviewUrl((previewUrl) => [...previewUrl, URL.createObjectURL(file)]);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
	};

	const handleOnDrop = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		const imageFile = e.dataTransfer.files?.[0];
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
