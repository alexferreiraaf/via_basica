import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 200 200"
      style={{ enableBackground: 'new 0 0 200 200' }}
      xmlSpace="preserve"
      className={cn(className)}
    >
      <rect className="st0" width="200" height="200" fill="#A84234" />
      <g>
        <path
          fill="#F5E6C4"
          d="M98.5,55.2c-4.4,0-8.5,0.9-12.2,2.5c-1.4,0.6-2.8,1.3-4.1,2.1L98.5,98l17.3-40.3c-1.3-0.7-2.6-1.4-4-2
        C107.7,55.9,103.2,55.2,98.5,55.2z"
        />
        <path
          fill="#F5E6C4"
          d="M112.6,112.8c2.5-3.9,4-8.4,4-13.3c0-13.8-11.2-25-25-25c-13.8,0-25,11.2-25,25c0,13.8,11.2,25,25,25
        c5.4,0,10.4-1.7,14.5-4.6L98.5,102L112.6,112.8z M71.9,99.5c0-10.6,8.6-19.2,19.2-19.2c10.6,0,19.2,8.6,19.2,19.2
        c0,10.6-8.6,19.2-19.2,19.2C80.5,118.7,71.9,110.1,71.9,99.5z"
        />
        <path fill="#F5E6C4" d="M67.8,43.7L92,98.6l6.5-15l-16.4-37.8L67.8,43.7z" />
        <path fill="#F5E6C4" d="M123.7,46.7l-4.6-10.5h-20v4.3l3.6,8.3L123.7,46.7z" />
      </g>
      <text
        transform="matrix(1 0 0 1 45.5 165.5)"
        fill="#F5E6C4"
        fontFamily="'Times New Roman'"
        fontSize="32px"
      >
        Via Básica
      </text>
    </svg>
  );
}
