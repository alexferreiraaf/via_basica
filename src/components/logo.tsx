import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('text-primary-foreground', className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0, -5)">
        <path 
          d="M25,20 L35,20 L40,45 L45,20 L55,20 L42,70 L38,70 Z" 
          fill="currentColor"
        />
        <path 
          d="M58,20 C75,20 80,35 80,45 C80,55 75,70 58,70 L50,70 L50,20 Z M58,65 C70,65 75,55 75,45 C75,35 70,25 58,25 L55,25 L55,65 Z" 
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
