import { IconProps } from './types';

export function IconsSun(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={props.size || props.height || 24}
      viewBox="0 0 24 24"
      width={props.size || props.width || 24}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0M12 2v1.5m0 17V22m7.07-2.929l-1.06-1.06M5.99 5.989L4.928 4.93M22 12h-1.5m-17 0H2m17.071-7.071l-1.06 1.06M5.99 18.011l-1.06 1.06"
        color="currentColor"
      ></path>
    </svg>
  );
}