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
import {
  TokenNameFormatType,
  FormatValidationResult,
  TokenNameCollection,
  isTokenValidationResult,
} from "radius-toolkit";

import { createLogger } from "@repo/utils";

const log = createLogger("WEB:validation");

export type ValidationResultProps = {
  collections: TokenNameCollection[];
  format: TokenNameFormatType | null;
  issues: FormatValidationResult[];
};
export const ValidationResult: FC<ValidationResultProps> = ({
  collections,
  format,
  issues,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  log("warn", "issues", issues.length);
  const tokenIssues = issues.filter(isTokenValidationResult).filter((issue) => {
    return issue.token.name === "semantic.focus.color.innerline";
  });

  log(
    "warn",
    "issues",
    tokenIssues.length,
    tokenIssues.map((issue) => issue.message)
  );

  const allEntries = useMemo(() => {
    const tokenIssues = issues.filter(isTokenValidationResult);
    const tokens = collections.flatMap((collection) =>
      collection.tokens.map((token) => ({
        ...token,
        collection: collection.name,
      }))
    );
    return tokens.map((token) => {
      const thisTokenIssues = tokenIssues.filter(
        ({ token: { name }, collection }) =>
          name === token.name && token.collection === collection
      );
      return {
        ...token,
        messages: thisTokenIssues.map(
          ({ message, offendingSegments, isWarning }) => ({
            message,
            segments: offendingSegments ?? [],
            type: isWarning ? "warning" : "error",
          })
        ),
      };
    });
  }, [collections, format, issues]);

  const filteredEntries = useMemo(() => {
    const entries = showOnlyErrors
      ? allEntries.filter(({ messages }) => messages.length > 0)
      : allEntries;
    if (!searchTerm) return entries;
    return entries.filter((entry) => {
      const filteredMessages = entry.messages
        .map(({ message }) => message)
        .filter((message) => {
          return message.toLowerCase().includes(searchTerm.toLowerCase());
        });
      return (
        filteredMessages.length > 0 ||
        `${entry.collection} ${entry.name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [allEntries, searchTerm, showOnlyErrors]);

  const groupedByCollection = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.collection]: [...(acc[entry.collection] ?? []), entry],
      }),
      {} as Record<string, typeof filteredEntries>
    );
  }, [filteredEntries]);

  if (!format) return null;

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
            {Object.entries(groupedByCollection).map(([category, entries]) => {
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
                    {entries.map(({ name, messages }, index) => {
                      if (!name) return;
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
                              {name.split(format.separator).map((word, i) => (
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
                                    name.split(format.separator).length - 1 && (
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
