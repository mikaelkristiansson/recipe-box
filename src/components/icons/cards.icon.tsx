import { IconProps } from "./types";

export function IconsCards(props: IconProps) {
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
        <path d="M3 11c0-2.828 0-4.243.879-5.121C4.757 5 6.172 5 9 5h2c2.828 0 4.243 0 5.121.879C17 6.757 17 8.172 17 11v5c0 2.828 0 4.243-.879 5.121C15.243 22 13.828 22 11 22H9c-2.828 0-4.243 0-5.121-.879C3 20.243 3 18.828 3 16z"></path>
        <path d="M16.924 19c1.096-.613 1.469-1.96 2.214-4.653l1.054-3.81c.746-2.693 1.119-4.04.486-5.101s-2.024-1.422-4.806-2.144l-1.967-.51c-2.782-.722-4.173-1.083-5.269-.47c-.78.436-1.193 1.244-1.636 2.646"></path>
        <path d="M7.761 11.276c.805-.457 1.507-.273 1.929.02c.173.12.26.181.31.181s.137-.06.31-.18c.422-.294 1.124-.478 1.929-.02c1.056.599 1.294 2.577-1.14 4.246c-.465.318-.697.477-1.099.477s-.634-.159-1.098-.477c-2.435-1.669-2.197-3.647-1.14-4.247"></path>
      </g>
    </svg>
  );
}
