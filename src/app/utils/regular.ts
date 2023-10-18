export const passwordReg =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;?!*+%<>@[\]{}\/\\_{}$#])[A-Za-z\d.,:;?!*+%<>@[\]{}\/\\_{}$#]{8,32}$/;
export const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const checkRegular = (reg: RegExp, value: string): boolean => {
	return reg.test(value);
};
