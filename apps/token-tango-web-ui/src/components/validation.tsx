import React, {
  FC,
  ReactNode,
  Ref,
  SVGProps,
  forwardRef,
  useEffect,
  useState,
  useMemo,
  PropsWithChildren,
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
import { Switch } from "@/components/ui/switch";

import { UiCloseHandler } from "../../../../apps/token-tango-widget/types/state";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Columns,
  MessageSquare,
  Search,
} from "lucide-react";
import {
  TokenNameFormatType,
  FormatValidationResult,
  TokenNameCollection,
  isTokenValidationResult,
  isGlobalValidationResult,
  TokenValue,
  isVariableAlias,
  renderValue,
  TokenCollection,
  toTokenNameCollection,
  getTokenType,
  TokenName,
} from "radius-toolkit";

import { createLogger } from "@repo/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const log = createLogger("WEB:validation");

export type ValidationResultProps = {
  collections: TokenNameCollection[];
  format: TokenNameFormatType | null;
  issues: FormatValidationResult[];
};

export type TokenEntry = {
  errors: {
    message: string;
    segments: string[];
    type: "error";
  }[];
  warnings: {
    message: string;
    segments: string[];
    type: "warning";
  }[];
  collection: string;
  name: string;
  type: string;
  alias?: string | undefined;
};

export const ValidationResult: FC<ValidationResultProps> = ({
  collections,
  format,
  issues,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [isGlobalOpen, setGlobalOpen] = useState(false);

  const globalIssues = useMemo(() => {
    return issues.filter(isGlobalValidationResult);
  }, [issues]);

  const collectionsByName = useMemo(() => {
    return collections.reduce(
      (acc, collection) => ({
        ...acc,
        [collection.name]: collection,
      }),
      {} as Record<string, TokenNameCollection>
    );
  }, [collections]);

  const allEntries: TokenEntry[] = useMemo(() => {
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
        errors: thisTokenIssues
          .filter(({ isWarning }) => !isWarning)
          .map(({ message, offendingSegments, isWarning }) => ({
            message,
            segments: offendingSegments ?? [],
            type: "error" as const,
          })),
        warnings: thisTokenIssues
          .filter(({ isWarning }) => isWarning)
          .map(({ message, offendingSegments, isWarning }) => ({
            message,
            segments: offendingSegments ?? [],
            type: "warning" as const,
          })),
      };
    });
  }, [collections, format, issues]);

  const filteredEntries = useMemo(() => {
    const entries = showOnlyIssues
      ? allEntries.filter(
          ({ errors, warnings }) => errors.length + warnings.length > 0
        )
      : allEntries;
    if (!searchTerm) return entries;
    return entries.filter((entry) => {
      const filteredMessages = [...entry.errors, ...entry.warnings]
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
  }, [allEntries, searchTerm, showOnlyIssues]);

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
    <TooltipProvider>
      <Card className="w-[575px] h-[700px] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Design Token Validator
          </CardTitle>
          <CardDescription>
            Review the results of the validation of your token collections
          </CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-grow">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search tokens..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showOnlyIssues}
                onCheckedChange={setShowOnlyIssues}
                id="show-issues"
              />
              <label htmlFor="show-issues" className="text-sm">
                Show only issues
              </label>
            </div>
          </div>
          {globalIssues.length > 0 && (
            <Collapsible
              className="mt-2"
              open={isGlobalOpen}
              onOpenChange={setGlobalOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Global Issues ({globalIssues.length})
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isGlobalOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 bg-gray-100 p-2 rounded-md">
                {globalIssues.map((issue, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded ${
                      issue.isWarning
                        ? "bg-yellow-50 text-yellow-900"
                        : "bg-red-50 text-red-900"
                    }`}
                  >
                    <div className="text-sm">{issue.message}</div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="pr-4">
            {Object.entries(groupedByCollection).map(([category, tokens]) => {
              const errors = tokens.filter(({ errors }) => errors.length > 0);
              const warnings = tokens.filter(
                ({ warnings }) => warnings.length > 0
              );
              return (
                <CollectionBar
                  key={category}
                  collection={collectionsByName[category]}
                  entries={tokens}
                />
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

const countCollectionIssues = (tokens: TokenEntry[]) => {
  const errors = tokens.reduce((acc, token) => acc + token.errors.length, 0);
  const warnings = tokens.reduce(
    (acc, token) => acc + token.warnings.length,
    0
  );
  return { errors, warnings };
};

export type CollectionBarProps = {
  collection: TokenNameCollection | undefined;
  entries: TokenEntry[];
};

const renderTokenValue = (
  type: string,
  values: Record<string, TokenValue>,
  mode: string
) => {
  console.log("renderTokenValue", type, values, mode);
  const value = values[mode];
  console.log("renderTokenValue ==> ", value);

  if (value === undefined) return undefined;
  if ("alias" in value) {
    return value.alias;
  }
  if (isVariableAlias(value)) {
    return undefined;
  }
  if (value.value === undefined) return undefined;

  return renderValue(type, value.value);
};

const prepareTokenForRender =
  (mode: string, entriesByToken: Record<string, TokenEntry>) =>
  (token: TokenName) => {
    const value = token.values?.[mode];
    const type = getTokenType(token.type) ?? token.type;
    const errors = entriesByToken[token.name]?.errors ?? [];
    const warnings = entriesByToken[token.name]?.warnings ?? [];

    const base = {
      ...token,
      type,
      errors,
      warnings,
    };

    if (value === undefined) {
      console.log(
        "prepareTokenForRender - ???",
        token,
        mode,
        token.values,
        value
      );
      return {
        ...base,
        stringValue: "",
      };
    }

    if ("alias" in value) {
      console.log(
        "prepareTokenForRender - alias",
        token,
        mode,
        token.values,
        value
      );
      return {
        ...base,
        type: "alias",
        stringValue: value.alias,
      };
    }
    console.log(
      "prepareTokenForRender - value",
      token,
      mode,
      token.values,
      value
    );

    if (value.value === undefined)
      return {
        ...base,
        stringValue: "",
      };

    return {
      ...base,
      stringValue: renderValue(type, value.value),
    };
  };

export const CollectionBar: FC<PropsWithChildren<CollectionBarProps>> = ({
  collection,
  entries,
}) => {
  const { errors, warnings } = countCollectionIssues(entries);
  const [isOpen, setIsOpen] = useState(false);
  const modesNames = collection?.modes ?? [];
  const [activeMode, setActiveMode] = useState(modesNames[0]);

  const firstMode = modesNames[0];

  console.log("CollectionBar", collection, modesNames, activeMode);

  const entriesByToken = useMemo(
    () =>
      entries.reduce(
        (acc, entry) => ({
          ...acc,
          [entry.name]: entry,
        }),
        {} as Record<string, TokenEntry>
      ),
    [entries]
  );

  if (!(collection && firstMode)) return null;

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <span className="font-semibold">{collection.name}</span>
          <div className="flex items-center space-x-2">
            {activeMode && (
              <>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <Columns size={12} />
                      <span>{modesNames.length}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Modes: {modesNames.join(", ")}
                  </TooltipContent>
                </Tooltip>

                {modesNames.length > 1 && (
                  <Select value={activeMode} onValueChange={setActiveMode}>
                    <SelectTrigger className="w-[100px] px-1 py-1 h-6 border border-gray-50 bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modesNames.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}

            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>Tokens:</span>
                  <span>{collection.tokens.length}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Total number of tokens in this collection
              </TooltipContent>
            </Tooltip>

            {errors > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="destructive"
                    className="flex items-center space-x-1"
                  >
                    <AlertCircle size={12} />
                    <span>{errors}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Number of tokens with errors</TooltipContent>
              </Tooltip>
            )}

            {warnings > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-800 text-white flex items-center space-x-1"
                  >
                    <AlertTriangle size={12} />
                    <span>{warnings}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Number of tokens with warnings</TooltipContent>
              </Tooltip>
            )}

            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 ml-4 space-y-2">
            {activeMode &&
              collection.tokens
                .map(prepareTokenForRender(activeMode, entriesByToken))
                .map((token) => <TokenItemBar token={token} />)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
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

export type TokenItemBarProps = {
  token: {
    stringValue: string;
    type: string;
    errors: { message: string; segments: string[]; type: "error" }[];
    warnings: { message: string; segments: string[]; type: "warning" }[];
    name: string;
    values?: Record<string, TokenValue> | undefined;
  };
};

export const TokenItemBar: FC<TokenItemBarProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible key={token.name} open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded transition-colors">
        <span className="text-sm font-mono">
          {token.name.split(".").map((word, i) => (
            <span
              key={i}
              className={
                token.errors.some(({ segments }) => segments.includes(word))
                  ? "text-red-500 font-bold"
                  : token.warnings.some(({ segments }) =>
                        segments.includes(word)
                      )
                    ? "text-yellow-800 font-bold"
                    : ""
              }
            >
              {word}
              {i < token.name.split(".").length - 1 && (
                <span className="text-stone-400">{"."}</span>
              )}
            </span>
          ))}
        </span>
        <div className="flex items-center space-x-2">
          {token.values && !isOpen && (
            <span className="text-xs text-gray-500 flex items-center">
              {token.type === "colors" && token.stringValue ? (
                <>
                  <span
                    className="w-3 h-3 mr-2 inline-block border border-gray-300"
                    style={{
                      backgroundColor: token.stringValue,
                    }}
                  />
                  {token.stringValue}
                </>
              ) : (
                <span>
                  {token.type}:{" "}
                  <span className="font-semibold">
                    {token.stringValue ?? "N/A"}
                  </span>
                </span>
              )}
            </span>
          )}
          {token.errors.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="destructive"
                  className="flex items-center space-x-1"
                >
                  <AlertCircle size={12} />
                  <span>{token.errors.length}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {token.errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
          {token.warnings.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="bg-yellow-800 text-white flex items-center space-x-1"
                >
                  <AlertTriangle size={12} />
                  <span>{token.warnings.length}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {token.warnings.map((warning, index) => (
                    <li key={index}>{warning.message}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
          <ChevronRight
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-90" : ""
            }`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mb-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <div>
            <span className="text-gray-600 mr-2">Type:</span>
            <span className="font-semibold text-gray-600 mr-2">
              {token.type}
            </span>
            <span className="text-gray-600 m-2">Value:</span>
            {token.type === "colors" && token.stringValue ? (
              <>
                <span
                  className="w-3 h-3 mr-2 inline-block border border-gray-300"
                  style={{
                    backgroundColor: token.stringValue,
                  }}
                />
                {token.stringValue}
              </>
            ) : (
              <span>
                <span className="font-semibold">
                  {token.stringValue ?? "N/A"}
                </span>
              </span>
            )}
          </div>
          {token.errors && token.errors.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-red-600 mb-1">Errors:</h4>
              <ul className="list-disc list-inside">
                {token.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {token.warnings && token.warnings.length > 0 && (
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Warnings:</h4>
              <ul className="list-disc list-inside">
                {token.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-800">
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
