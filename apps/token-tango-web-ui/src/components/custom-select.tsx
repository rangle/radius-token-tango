import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "./custom-icons";

type CustomSelectProps = {
  options: { name: string; value: string; icon: JSX.Element }[];
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  ref?: React.Ref<any>;
};

export const CustomSelect = React.forwardRef<
  HTMLButtonElement,
  CustomSelectProps
>(({ options, value, onChange }, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between w-full"
          value={value}
          ref={ref}
        >
          <div className="flex items-center gap-2">
            {options.find((o) => o.value === value)?.icon}
            {options.find((o) => o.value === value)?.name}
          </div>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex items-center justify-between w-full"
            onClick={() => onChange({ target: option })}
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <span>{option.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
