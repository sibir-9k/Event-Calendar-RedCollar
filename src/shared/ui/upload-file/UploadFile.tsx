import { useState, useRef } from 'react';
import './UploadFile.scss';

interface UploadFileProps {
	uploadedImages: File[];
	setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export function UploadFile({ setUploadedImages }: UploadFileProps): JSX.Element {
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
		const imageFile = e.dataTransfer?.files?.[0];
		handleFile(imageFile);
	};

	const handleDeletePreviewImg = (e: React.MouseEvent<HTMLDivElement>): void => {
		const url = (e.target as HTMLImageElement).src;
		const newPreviewUrls = previewUrl.filter((item) => item !== url);
		setPreviewUrl(newPreviewUrls);
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
					onChange={(e) => {
						if (e.target.files !== null) {
							const file = e.target.files[0] as File;
							handleFile(file);
						}
					}}
				/>
				<span className="text">Выберите фото или перетащите сюда</span>
			</div>
			<div className="imgs">{preview}</div>
		</div>
	);
}
