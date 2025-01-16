import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils'; // Ajuste o caminho conforme necessário

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg shadow-md bg-white p-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
