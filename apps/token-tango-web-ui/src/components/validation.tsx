import React, {
  FC,
  ReactNode,
  Ref,
  SVGProps,
  forwardRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { UiCloseHandler } from "../../../../apps/token-tango-widget/types/state";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { MessageSquare } from "lucide-react";

export type ValidationResultProps = {};

const results = [
  {
    token: "legacy.test.nothing.attribute",
    category: "Legacy",
    messages: [
      {
        type: "error",
        segments: ["nothing"],
        message: "Unclosed string at line 12, column 24",
      },
      {
        type: "error",
        segments: ["test"],
        message: "Unexpected token '}' at line 45, column 8",
      },
      {
        type: "error",
        segments: [],
        message: "Missing semicolon at line 78, column 17",
      },
      {
        type: "error",
        segments: [],
        message: "Unexpected identifier at line 102, column 3",
      },
      {
        type: "error",
        segments: ["nothing"],
        message: "Unexpected end of input at line 137, column 1",
      },
    ],
  },
  {
    token: "legacy.old.nothing.attribute",
    category: "Legacy",
    messages: [
      {
        type: "error",
        segments: ["nothing"],
        message: "Cannot read property 'length' of undefined at line 23",
      },
      {
        type: "error",
        segments: [],
        message: "Undefined is not a function at line 67",
      },
      {
        type: "error",
        segments: [],
        message: "Null is not an object at line 91",
      },
      {
        type: "error",
        segments: [],
        message: "Cannot convert undefined to object at line 134",
      },
    ],
  },
  {
    token: "marketing.new.nothing.attribute",
    category: "Marketing",
    messages: [
      {
        type: "error",
        segments: ["nothing"],
        message:
          "Uncaught ReferenceError: someVariable is not defined at line 15",
      },
      {
        type: "error",
        segments: [],
        message:
          "Uncaught ReferenceError: anotherFunction is not defined at line 42",
      },
      {
        type: "error",
        segments: [],
        message: "Uncaught ReferenceError: myClass is not defined at line 69",
      },
    ],
  },
  {
    token: undefined,
    category: "Development",
    messages: [
      {
        type: "warning",
        message: "This category has no tokens",
      },
    ],
  },
  { token: "marketing.new.color.valid", category: "Marketing", messages: [] },
  {
    token: "marketing.new.color.alternate",
    category: "Marketing",
    messages: [],
  },
  { token: "marketing.new.color.vivid", category: "Marketing", messages: [] },
  { token: "marketing.new.color.pastel", category: "Marketing", messages: [] },
  { token: "operations.new.color.valid", category: "Operations", messages: [] },
  {
    token: "operations.new.color.alternate",
    category: "Operations",
    messages: [],
  },
];

const format = {
  separator: ".",
  segments: ["category", "type", "name"],
  rules: {},
};

export const ValidationResult: FC<ValidationResultProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  const filteredEntries = useMemo(() => {
    const entries = showOnlyErrors
      ? results.filter(({ messages }) => messages.length > 0)
      : results;
    if (!searchTerm) return entries;
    return entries.filter((entry) => {
      const filteredMessages = entry.messages
        .map(({ message }) => message)
        .filter((message) => {
          return message.toLowerCase().includes(searchTerm.toLowerCase());
        });
      return (
        filteredMessages.length > 0 ||
        `${entry.category} ${entry.token}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [results, searchTerm, showOnlyErrors]);

  const groupedByCategory = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.category]: [...(acc[entry.category] ?? []), entry],
      }),
      {} as Record<string, typeof filteredEntries>
    );
  }, [filteredEntries]);

  return (
    <Card>
      <CardContent className="sm:max-w-[600px]">
        <CardHeader>
          <CardTitle>Token Validator</CardTitle>
          <CardDescription>
            Review the results of the validation of your token collections
          </CardDescription>
        </CardHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search token names or errors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={showOnlyErrors}
                onCheckedChange={(checked) =>
                  setShowOnlyErrors(checked === true)
                }
              />
              Show only issues
            </Label>
          </div>
          <div className="space-y-4">
            {Object.entries(groupedByCategory).map(([category, entries]) => {
              const errors = entries.filter(
                ({ messages }) =>
                  messages.filter(({ type }) => type === "error").length > 0
              );
              const warnings = entries.filter(
                ({ messages }) =>
                  messages.filter(({ type }) => type === "warning").length > 0
              );
              return (
                <Collapsible key={category} className="border rounded-lg">
                  <div className="flex items-center justify-between px-4">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-md font-semibold">{category}</h3>
                        <div className="flex items-center justify-between space-x-2">
                          <Button variant="ghost" size="sm">
                            {entries.length} tokens
                            {errors.length > 0 &&
                              ` (${errors.length} with errors)`}
                            {warnings.length > 0 &&
                              ` (${warnings.length} warnings)`}
                            <ChevronDownIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="p-4 space-y-2">
                    {entries.map(({ token, messages }, index) => {
                      if (!token) return;
                      const tokenErrors = messages.filter(
                        ({ type }) => type === "error"
                      );
                      const tokenWarnings = messages.filter(
                        ({ type }) => type === "warning"
                      );
                      return (
                        <Collapsible key={category}>
                          <div className="flex items-center justify-between space-x-2">
                            <div
                              key={index}
                              className="font-mono text-sm p-2 px-4 border border-1 border-stone-200 rounded-full"
                            >
                              {token.split(format.separator).map((word, i) => (
                                <span
                                  key={i}
                                  className={
                                    messages.filter(({ segments }) =>
                                      segments.includes(word)
                                    ).length > 0
                                      ? "text-red-500 font-bold"
                                      : ""
                                  }
                                >
                                  {word}
                                  {i <
                                    token.split(format.separator).length -
                                      1 && (
                                    <span className="text-stone-400">
                                      {format.separator}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between">
                                {tokenWarnings.length > 0 && (
                                  <Badge className="bg-yellow-500">
                                    {tokenWarnings.length}
                                  </Badge>
                                )}
                                {tokenErrors.length > 0 && (
                                  <Badge className="bg-red-500">
                                    {tokenErrors.length}
                                  </Badge>
                                )}
                              </div>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="flex items-center justify-between">
                            <div className="space-y-2 p-4 space-x-2">
                              {messages.map(
                                ({ type, segments, message }, i) => (
                                  <div
                                    key={i}
                                    className={`flex items-center gap-2 ${
                                      type === "error"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    <div>
                                      <div className="text-sm">{message}</div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChevronDownIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
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
