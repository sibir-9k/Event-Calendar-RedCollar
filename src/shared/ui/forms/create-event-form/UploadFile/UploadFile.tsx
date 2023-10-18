import { FC, useState, useRef, ChangeEvent, DragEvent } from 'react';
import { apiToken } from 'app/api/config';

interface UploadFileProps {
	register: unknown;
	name: string;
}

export const UploadFile: FC<UploadFileProps> = ({ register, name }) => {
  
	const [drag, setDrag] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	// const [uploadedImages, setUploadedImages] = useState([]);

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
		const filesPictures = [...e.dataTransfer.files];

		const formData = new FormData();
		filesPictures.map((picture) => {
			formData.append('file', picture);
		});

		uploadImages(formData);
	};

	const uploadImages = async (formData: FormData) => {
		try {
			const response = await apiToken.post(`upload`, formData);
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

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			console.log(files);
		}
	};

	return (
		<div
			className="drag"
			onDragStart={(e) => dragStartHandler(e)}
			onDragLeave={(e) => dragLeaveHandler(e)}
			onDragOver={(e) => dragStartHandler(e)}
			onDrop={(e) => onDropHandler(e)}
			onClick={openFileExplorer}>
			Выберите фото или перетащите сюда
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileSelect}
				multiple
			/>
		</div>
	);
};
