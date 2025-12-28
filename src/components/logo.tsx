import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="Via Básica Logo"
    >
      <rect width="200" height="200" fill="none" />
      <g transform="translate(0, -10)">
        <path
          fill="currentColor"
          d="M100,25 C58.579,25 25,58.579 25,100 C25,141.421 58.579,175 100,175 C141.421,175 175,141.421 175,100 C175,58.579 141.421,25 100,25 Z M100,166.5 C63.42,166.5 33.5,136.58 33.5,100 C33.5,63.42 63.42,33.5 100,33.5 C136.58,33.5 166.5,63.42 166.5,100 C166.5,136.58 136.58,166.5 100,166.5 Z"
        />
        <path
          fill="currentColor"
          d="M79.5,58.5 L60,58.5 L86.5,141.5 L106.5,141.5 L121.5,91.5 C122.5,95.5 123,99.7 123,104 C123,118.9 111.9,130 97,130 L97,121 C106.9,121 115,113.4 115,104 C115,100.2 114.1,96.6 112.5,93.5 L97.5,141.5 L117.5,141.5 L144,58.5 L124,58.5 L108,112.5 L92,58.5 L79.5,58.5 Z"
        />
      </g>
    </svg>
  );
}
