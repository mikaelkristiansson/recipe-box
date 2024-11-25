import { IconProps } from './types';

export function IconsHourglass(props: IconProps) {
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
        d="M19 2v3a7 7 0 0 1-7 7M5 2v3a7 7 0 0 0 7 7m0 0a7 7 0 0 1 7 7v3m-7-10a7 7 0 0 0-7 7v3M4 2h16m0 20H4"
        color="currentColor"
      ></path>
    </svg>
  );
}
