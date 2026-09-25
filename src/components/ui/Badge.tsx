import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
};

function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return <span className={cn('status-badge', `status-${tone}`, className)} {...props} />;
}

export default Badge;
