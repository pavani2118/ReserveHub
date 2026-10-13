import type { ReactNode } from "react";

export type IconName =
  | "calendar" | "grid" | "layers" | "clock" | "users" | "arrow-right"
  | "arrow-left" | "plus" | "shield" | "check" | "chevron-right" | "pin"
  | "sparkles" | "logout" | "home" | "settings" | "edit" | "door"
  | "info" | "x" | "briefcase" | "trending" | "lock" | "menu" | "search";

const strokes: Record<IconName, ReactNode> = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  layers: <><path d="m12 3-9 5 9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  "arrow-right": <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  "arrow-left": <><path d="M20 12H4m6-6-6 6 6 6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  "chevron-right": <path d="m9 18 6-6-6-6"/>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 17l.7 1.3L21 19l-1.3.7L19 21l-.7-1.3L17 19l1.3-.7L19 17Z"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.9 1.9-.1-.1a1.7 1.7 0 0 0-1.9-.3l-.3.1V21h-3v-.2a1.7 1.7 0 0 0-1.2-1.6 1.7 1.7 0 0 0-1.8.4l-.1.1-1.9-1.9.1-.1a1.7 1.7 0 0 0 .3-1.9l-.1-.3H5v-3h.2a1.7 1.7 0 0 0 1.6-1.2 1.7 1.7 0 0 0-.4-1.8l-.1-.1 1.9-1.9.1.1a1.7 1.7 0 0 0 1.9.3l.3-.1V5h3v.2a1.7 1.7 0 0 0 1.2 1.6 1.7 1.7 0 0 0 1.8-.4l.1-.1 1.9 1.9-.1.1a1.7 1.7 0 0 0-.3 1.9l.1.3H21v3h-.2a1.7 1.7 0 0 0-1.6 1.2Z"/></>,
  edit: <><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="m16 3 5 5-9 9-5 1 1-5 8-10Z"/></>,
  door: <><path d="M4 21h16M7 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17"/><circle cx="14" cy="12" r=".75"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  x: <path d="M6 6l12 12M18 6 6 18"/>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
  trending: <><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
};

export default function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {strokes[name]}
    </svg>
  );
}
