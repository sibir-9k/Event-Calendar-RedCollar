import { FC, useState, useRef } from 'react';
import axios from 'axios';

export const UploadFile: FC = () => {
	const [drag, setDrag] = useState(false);
	const fileInputRef = useRef(null);
	const [uploadedImages, setUploadedImages] = useState([]);

	const dragStartHandler = (e) => {
		e.preventDefault();
		setDrag(true);
	};

	const dragLeaveHandler = (e) => {
		e.preventDefault();
		setDrag(false);
	};

	const onDropHandler = (e) => {
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

	const uploadImages = async (formData) => {
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

	const handleFileSelect = (e) => {
		const files = e.target.files;
		if (files) {
			// Handle the selected files here
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
