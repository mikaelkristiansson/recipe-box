import { IconProps } from "./types";

export function IconsUserCircle(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={props.size || props.height || 24}
      viewBox="0 0 24 24"
      width={props.size || props.width || 24}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        color="currentColor"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M7.5 17c2.332-2.442 6.643-2.557 9 0m-2.005-7.5c0 1.38-1.12 2.5-2.503 2.5a2.5 2.5 0 0 1-2.504-2.5c0-1.38 1.12-2.5 2.504-2.5a2.5 2.5 0 0 1 2.503 2.5"></path>
      </g>
    </svg>
  );
}
