import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RegistrationForm } from '../registration-form/RegistrationForm';
import OpenEye from '../../../../../public/images/open-eye.svg';
import CloseEye from '../../../../../public/images/close-eye.svg';
import '../FormsStyle.scss';

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

	// useEffect(() => {}, [checkEmail, emailSubmitted]);

	const onSubmit: SubmitHandler<AuthForm> = async (formData) => {
		const { email, password } = formData;

		try {
			const response = await axios.get(`https://planner.rdclr.ru/api/taken-emails/${email}`);
			const userExists = response.status;

			if (userExists === 200 || userExists === 204) {
				setCheckEmail(true);
				setEmailSubmitted(true);

				if (password) {
					const loginResponse = await axios.post(
						`https://planner.rdclr.ru/api/auth/local`,
						{
							identifier: email,
							password: password,
						},
						{
							headers: {
								'Content-Type': 'application/json; charset=utf-8',
							},
						}
					);
					const result = loginResponse.data;
					localStorage.setItem('token', result.jwt);
					setIsAuthUser(true);
					setIsAuthModalOpen(false);
					console.log(result);
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
			setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value));
		} else if (name === 'password') {
			setPasswordValid(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;?!*+%<>@[\]{}\/\\_{}$#])[A-Za-z\d.,:;?!*+%<>@[\]{}\/\\_{}$#]{8,32}$/.test(
					value
				)
			);
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
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: 'Некорректный email',
											},
										})}
										placeholder="Почта"
										onChange={handleChange}
									/>
									{errors?.email && <span className="error">{errors.email.message}</span>}
								</div>
								{disabledBtn ? (
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
										type={openPassword ? 'password' : 'text'}
										{...register('password', { required: true })}
										placeholder="Пароль"
										onChange={handleChange}
									/>
									<button className="eye" onClick={() => setOpenPassword(!openPassword)}>
										<img src={!openPassword ? CloseEye : OpenEye} />
									</button>
								</div>
								{passwordValid ? (
									<button type="submit" className="active">
										Войти
									</button>
								) : (
									<button type="submit" disabled>
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
