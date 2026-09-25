import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string };

function IconButton({ className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={cn('theme-icon-button inline-flex h-11 w-11 items-center justify-center rounded-md', className)} {...props} />;
}

export default IconButton;
