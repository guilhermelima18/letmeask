import { ButtonHTMLAttributes } from 'react';
import './style.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {
  return (
    <button className="button" {...props} />
  );
};

export default Button;