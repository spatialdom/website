import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={cn('panel', className)} {...props} />;
}

export default Card;
