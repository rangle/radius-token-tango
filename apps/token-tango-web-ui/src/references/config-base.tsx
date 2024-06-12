/**
 * v0 by Vercel.
 * @see https://v0.dev/t/yEqmy7IJToI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Component() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const handleTestConnection = () => {
    setIsConnected(true);
    setIsSaveDisabled(false);
  };
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Configure Repository Access</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Configure Repository Access</DialogTitle>
          <DialogDescription>
            Set up a connection to access a specific file in a repository.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="tool">Tool</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-5 h-5" />
                    GitHub
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-5 h-5" />
                    GitHub
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My GitHub Connection" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="repository">Repository</Label>
            <Input id="repository" placeholder="user/repo" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="token">Access Token</Label>
            <div className="flex items-center gap-2">
              <Input id="token" type="password" placeholder="ghp_..." />
              <Button
                variant="outline"
                onClick={handleTestConnection}
                className="p-2"
              >
                <TestTubeIcon className="w-4 h-4" />
              </Button>
              {isConnected && (
                <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                  ✓
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="path">File Path</Label>
            <Input id="path" placeholder="/path/to/file.txt" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="branch">Branch</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between w-full"
                  disabled={isSaveDisabled}
                >
                  <span>main</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>main</DropdownMenuItem>
                <DropdownMenuItem>develop</DropdownMenuItem>
                <DropdownMenuItem>feature/new-design</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit" disabled={isSaveDisabled}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
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
  );
}

function GithubIcon(props) {
  return (
    <svg
      {...props}
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
  );
}

function TestTubeIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
      <path d="M8.5 2h7" />
      <path d="M14.5 16h-5" />
    </svg>
  );
}
