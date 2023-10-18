import { FC, forwardRef } from 'react';
import ru from 'date-fns/locale/ru';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';

registerLocale('ru', ru);
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
	selected: Date | null;
	onChange: (date: Date | null) => void;
	placeholder: string;
}

export const CustomDatePicker: FC<CustomDatePickerProps> = forwardRef(
	({ selected, onChange, placeholder }, ref) => {
		setDefaultLocale('ru');
		return (
			<div className="input-wrapper">
				<DatePicker
					selected={selected}
					onChange={onChange}
					locale={ru}
					dateFormat="dd.MM.yyyy"
					placeholderText={placeholder}
					required
					ref={ref}
				/>
			</div>
		);
	}
);
