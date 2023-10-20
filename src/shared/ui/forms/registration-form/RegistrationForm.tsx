import { FC, useState } from 'react';
import { api } from 'app/api/config';
import { checkRegular, passwordReg } from 'app/utils/regular';
import { SubmitHandler, useForm } from 'react-hook-form';
import InfoIcon from '@/public/images/warning.svg';
import OpenEye from '@/public/images/open-eye.svg';
import CloseEye from '@/public/images/close-eye.svg';

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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const response = await api.post(`auth/local/register`, {
				username: formDataReg.name,
				email: emailRegistration,
				password: formDataReg.password,
			});

			setIsAuthUser(true);
			setIsAuthModalOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'password') {
			if (value.length > 0 && watch('password') !== '' && watch('confirmPassword') !== '') {
				setDisabledBtn(false);
			} else {
				setDisabledBtn(true);
			}
		}
		setPasswordValid(checkRegular(passwordReg, value));
	};

	// eslint-disable-next-line no-irregular-whitespace
	const warningText = `В пароле используйте от 8 до 32 символов: строчные и прописные латинские буквы (A-z), цифры (0-9) и спец символы ( . , : ; ? ! * + % - < > @ [ ] { } / \\ _ {} $ # )`;

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
						type={openPassword ? 'text' : 'password'}
						{...register('password', {
							minLength: 8,
							maxLength: 32,
							pattern: {
								value: passwordReg,
								message: 'Используйте латинские буквы, цифры и спец символы',
							},
						})}
						onChange={handlePasswordChange}
						placeholder="Пароль"
						className={watch('password') === watch('confirmPassword') ? 'green' : ''}
					/>
					<div className="eye" onClick={() => setOpenPassword(!openPassword)}>
						<img src={openPassword ? OpenEye : CloseEye} />
					</div>
					{errors.password && <span className="error">{errors.password.message}</span>}
				</div>
				<div className="input-block">
					<input
						type={openPassword ? 'text' : 'password'}
						{...register('confirmPassword', { validate: (value) => value === watch('password') })}
						onChange={handlePasswordChange}
						placeholder="Повторить пароль"
						className={watch('password') === watch('confirmPassword') ? 'green' : ''}
					/>
					<div className="eye" onClick={() => setOpenPassword(!openPassword)}>
						<img src={openPassword ? OpenEye : CloseEye} />
					</div>
					{errors.confirmPassword && <span className="error">Пароли не совпадают</span>}
				</div>
				{disabledBtn && passwordValid ? (
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
