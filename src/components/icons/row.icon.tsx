import { IconProps } from './types';

export function IconsRow(props: IconProps) {
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
        d="m15 16.327l1.409 1.486C17.159 18.604 17.534 19 18 19s.841-.396 1.591-1.187L21 16.327m-3 2.586v-4.375c0-2.234 0-3.35-.447-4.335s-1.287-1.72-2.968-3.191L14 6.5m-11 0c0-1.225 0-1.838.238-2.306c.21-.411.545-.746.956-.956C4.662 3 5.274 3 6.5 3s1.838 0 2.306.238c.411.21.746.545.956.956C10 4.662 10 5.274 10 6.5s0 1.838-.238 2.306c-.21.411-.545.746-.956.956C8.338 10 7.726 10 6.5 10s-1.838 0-2.306-.238a2.2 2.2 0 0 1-.956-.956C3 8.338 3 7.726 3 6.5m0 11c0-1.225 0-1.838.238-2.306c.21-.411.545-.746.956-.956C4.662 14 5.274 14 6.5 14s1.838 0 2.306.238c.411.21.746.545.956.956c.238.468.238 1.08.238 2.306s0 1.838-.238 2.306c-.21.411-.545.746-.956.956C8.338 21 7.726 21 6.5 21s-1.838 0-2.306-.238a2.2 2.2 0 0 1-.956-.956C3 19.338 3 18.726 3 17.5"
        color="currentColor"
      ></path>
    </svg>
  );
}
