import { FC, PropsWithChildren } from 'react';
import './Button.scss';

interface BtnProps extends PropsWithChildren<unknown> {}

export const Button: FC<BtnProps> = ({ children }) => <button>{children}</button>;
