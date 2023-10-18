import { FC, useState } from 'react';
import { api } from 'app/api/config';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RegistrationForm } from '../registration-form/RegistrationForm';
import OpenEye from '@/public/images/open-eye.svg';
import CloseEye from '@/public/images/close-eye.svg';

import '../FormsStyle.scss';
import { checkRegular, emailReg, passwordReg } from 'app/utils/regular';

interface AuthForm {
	email: string;
	password: string;
}
interface EmailFormProps {
	checkEmail: boolean;
	setCheckEmail: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAuthUser: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmailForm: FC<EmailFormProps> = ({
	checkEmail,
	setCheckEmail,
	setIsAuthUser,
	setIsAuthModalOpen,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthForm>();
	const [disabledBtn, setDisabledBtn] = useState(true);
	const [emailValid, setEmailValid] = useState(false);
	const [passwordValid, setPasswordValid] = useState(false);
	const [emailSubmitted, setEmailSubmitted] = useState(false);
	const [emailRegistration, setEmailRegistration] = useState('');
	const [openPassword, setOpenPassword] = useState(false);
	const [openInput, setOpenInput] = useState(true);

	const onSubmit: SubmitHandler<AuthForm> = async (formData) => {
		const { email, password } = formData;

		try {
			const response = await api.get(`taken-emails/${email}`);
			const userExists = response.status;

			if (userExists === 200 || userExists === 204) {
				setCheckEmail(true);
				setEmailSubmitted(true);
				if (password) {
					const loginResponse = await api.post(`auth/local`, {
						identifier: email,
						password: password,
					});
					const result = loginResponse.data;
					localStorage.setItem('token', result.jwt);
					setIsAuthUser(true);
					setIsAuthModalOpen(false);
				}
			}
		} catch (error) {
			setOpenInput(false);
			setCheckEmail(false);
			setEmailSubmitted(true);
			setEmailRegistration(email);
			console.error('Error:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'email') {
			if (value.length > 0) {
				setDisabledBtn(false);
			}
			setEmailValid(checkRegular(emailReg, value));
		} else if (name === 'password') {
			setPasswordValid(checkRegular(passwordReg, value));
		}
	};

	return (
		<>
			{openInput && (
				<div className="email-form">
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						{!emailSubmitted && (
							<>
								<div className="input-block">
									<input
										type="email"
										{...register('email', {
											required: true,
											pattern: {
												value: emailReg,
												message: 'Некорректный email',
											},
										})}
										placeholder="Почта"
										onChange={handleChange}
									/>
									{errors?.email && <span className="error">{errors.email.message}</span>}
								</div>
								{!emailValid && disabledBtn ? (
									<button type="submit" disabled>
										Далее
									</button>
								) : (
									<button type="submit" className="active">
										Далее
									</button>
								)}
							</>
						)}
						{checkEmail && emailSubmitted && (
							<>
								<div className="input-block">
									<input
										type={openPassword ? 'text' : 'password'}
										{...register('password', {
											required: true,
											pattern: {
												value: passwordReg,
												message: 'Некорректный пароль',
											},
										})}
										placeholder="Пароль"
										onChange={handleChange}
									/>
									<div className="eye" onClick={() => setOpenPassword(!openPassword)}>
										<img src={openPassword ? OpenEye : CloseEye} />
									</div>
								</div>
								{!passwordValid && disabledBtn ? (
									<button type="submit" disabled>
										Войти
									</button>
								) : (
									<button type="submit" className="active">
										Войти
									</button>
								)}
							</>
						)}
					</form>
				</div>
			)}
			{!checkEmail && emailSubmitted && (
				<RegistrationForm
					emailRegistration={emailRegistration}
					setIsAuthModalOpen={setIsAuthModalOpen}
					setIsAuthUser={setIsAuthUser}
				/>
			)}
		</>
	);
};
