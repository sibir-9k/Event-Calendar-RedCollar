import { FC, useState } from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import InfoIcon from '../../../../../public/images/warning.svg';
import OpenEye from '../../../../../public/images/open-eye.svg';
import CloseEye from '../../../../../public/images/close-eye.svg';

import '../FormsStyle.scss';

interface RegistrationForm {
	name: string;
	password: string;
	confirmPassword: string;
}

interface RegistrationFormProps {
	emailRegistration: string;
	setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAuthUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegistrationForm: FC<RegistrationFormProps> = ({
	emailRegistration,
	setIsAuthModalOpen,
	setIsAuthUser,
}) => {
	const [passwordValid, setPasswordValid] = useState(false);
	const [disabledBtn, setDisabledBtn] = useState(true);
	const [openPassword, setOpenPassword] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegistrationForm>();

	const onSubmit: SubmitHandler<RegistrationForm> = async (formDataReg) => {
		try {
			const response = await axios.post(
				`https://planner.rdclr.ru/api/auth/local/register`,
				{
					username: formDataReg.name,
					email: emailRegistration,
					password: formDataReg.password,
				},
				{
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
					},
				}
			);

			const result = response.data;
			setIsAuthUser(true);
			setIsAuthModalOpen(false);
			console.log(result);
		} catch (error) {}
		// setIsFormFilled(true);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		console.log(name, value);
		if (name === 'password') {
			if (value.length > 0 && watch('password') !== '' && watch('confirmPassword') !== '') {
				setDisabledBtn(false);
			} else {
				setDisabledBtn(true);
			}
		}
		setPasswordValid(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;?!*+%<>@[\]{}\\/\\_{}$#])[A-Za-z\d.,:;?!*+%<>@[\]{}\/\\_{}$#]{8,32}$/.test(
				value
			)
		);
	};

	const warningText = `В пароле используйте от 8 до 32 символов: строчные и прописные латинские буквы (A-z), цифры (0-9) и спец символы ( . , : ; ? ! * + % - < > @ [ ] { } / \ _ {} $ # )`;

	return (
		<div className="regist-form">
			<div className="regist-form__top">
				<img src={InfoIcon} alt="" />
				<span className="warning-text">{warningText}</span>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="input-block">
					<input type="text" {...register('name')} placeholder="Имя" />
				</div>
				<div className="input-block">
					<input
						type={!openPassword ? 'text' : 'password'}
						{...register('password', {
							minLength: 8,
							maxLength: 32,
							pattern: {
								value:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;?!*+%<>@[\]{}\/\\_{}$#])[A-Za-z\d.,:;?!*+%<>@[\]{}\/\\_{}$#]{8,32}$/,
								message: 'Используйте латинские буквы, цифры и спец символы',
							},
						})}
						onChange={handlePasswordChange}
						placeholder="Пароль"
						className={
							watch('password') === watch('confirmPassword') &&
							watch('password')?.length !== 0 &&
							watch('confirmPassword')?.length !== 0
								? 'green'
								: ''
						}
					/>
					<button className="eye" onClick={() => setOpenPassword(!openPassword)}>
						<img src={openPassword ? CloseEye : OpenEye} />
					</button>
					{errors.password && <span className="error">{errors.password.message}</span>}
				</div>
				<div className="input-block">
					<input
						type={!openPassword ? 'text' : 'password'}
						{...register('confirmPassword', { validate: (value) => value === watch('password') })}
						placeholder="Повторить пароль"
						className={
							watch('password') === watch('confirmPassword') &&
							watch('password')?.length !== 0 &&
							watch('confirmPassword')?.length !== 0
								? 'green'
								: ''
						}
					/>
					<button className="eye" onClick={() => setOpenPassword(!openPassword)}>
						<img src={openPassword ? CloseEye : OpenEye} />
					</button>
					{errors.confirmPassword && <span className="error">Пароли не совпадают</span>}
				</div>
				{disabledBtn ? (
					<button type="submit" disabled>
						Зарегистрироваться
					</button>
				) : (
					<button type="submit" className="active">
						Зарегистрироваться
					</button>
				)}
			</form>
		</div>
	);
};
