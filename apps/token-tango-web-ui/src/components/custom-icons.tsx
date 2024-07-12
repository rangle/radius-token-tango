import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React, { FC, Ref, SVGProps, forwardRef } from "react";

export const ChevronDownIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
);
export const GithubIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
);
export const TriangleAlertIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23 21L12 2L1 21H23ZM11 18V16H13V18H11ZM11 14H13V10H11V14Z"
      />
    </svg>
  )
);
export const InfoAlertIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM13 11V17H11V11H13ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7V9H11V7H13Z"
      />
    </svg>
  )
);
export const CheckIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M9.00002 16.2L4.80002 12L3.40002 13.4L9.00002 19L21 6.99998L19.6 5.59998L9.00002 16.2Z"
        fill="#262626"
      />
    </svg>
  )
);
export const FileSearchIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 8V19.59L16.17 15.75C16.69 14.96 17 14.02 17 13C17 10.24 14.76 8 12 8C9.24 8 7 10.24 7 13C7 15.76 9.24 18 12 18C13.02 18 13.96 17.69 14.76 17.17L19.19 21.6C18.85 21.85 18.45 22 18 22H5.99C4.89 22 4 21.1 4 20L4.01 4C4.01 2.9 4.9 2 6 2H14L20 8ZM12 16C10.34 16 9 14.66 9 13C9 11.34 10.34 10 12 10C13.66 10 15 11.34 15 13C15 14.66 13.66 16 12 16Z"
        fill="currentColor"
      />
    </svg>
  )
);
export const FileAddIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 16H13V19H11V16H8V14H11V11H13V14H16V16ZM13 3.5V9H18.5L13 3.5Z"
        fill="#262626"
      />
    </svg>
  )
);

export const AddedIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="16"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  )
);

export const RemovedIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  )
);

export const ModifiedIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
);

export const ChangeIcon: FC<{
  changeType: "added" | "modified" | "deleted" | undefined;
  label?: string;
}> = ({ changeType, label }) =>
  changeType && (
    <Tooltip>
      <TooltipTrigger>
        {
          {
            added: <AddedIcon className="mr-1 text-green-500" />,
            modified: <ModifiedIcon className="mr-1 text-blue-500" />,
            deleted: <RemovedIcon className="mr-1 text-red-500" />,
          }[changeType]
        }
      </TooltipTrigger>
      <TooltipContent>
        {label ??
          {
            added: "Added",
            modified: "Modified",
            deleted: "Deleted",
          }[changeType]}
      </TooltipContent>
    </Tooltip>
  );
