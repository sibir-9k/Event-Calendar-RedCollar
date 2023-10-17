import { FC, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import LeftArrow from '../../../../../public/images/left-arrow.svg';
import RightArrow from '../../../../../public/images/right-arrow.svg';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ModalEventsSlider.scss';

interface Photos {
	id: number;
	url: string;
	name: string;
}

interface ModalEventSliderProps {
	eventPhoto: Photos[];
}

export const ModalEventsSlider: FC<ModalEventSliderProps> = ({ eventPhoto }) => {
	const sliderRef = useRef<any>(null);

	if (eventPhoto.length === 0) return null;

	const handlePrev = () => {
		if (sliderRef.current) {
			sliderRef.current.swiper.slidePrev();
		}
	};

	const handleNext = () => {
		if (sliderRef.current) {
			sliderRef.current.swiper.slideNext();
		}
	};

	return (
		<div className="modal-slider">
			<div className="slider-top">
				<h3 className="slider-title">Галерея</h3>
				<div className="custom-navigation">
					<button className="prev-button" onClick={() => handlePrev()}>
						<img src={LeftArrow} alt="left" />
					</button>
					<button className="next-button" onClick={() => handleNext()}>
						<img src={RightArrow} alt="right" />
					</button>
				</div>
			</div>

			<Swiper
				modules={[Pagination, Navigation]}
				navigation={{
					prevEl: '.prev-button',
					nextEl: '.next-button',
				}}
				spaceBetween={16}
				slidesPerView={3.5}
				pagination={{ clickable: true }}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}>
				{eventPhoto.map((photo: Photos) => {
					return (
						<SwiperSlide key={photo.id}>
							<img src={`https://planner.rdclr.ru${photo.url}`} alt={photo.name} />
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
};
