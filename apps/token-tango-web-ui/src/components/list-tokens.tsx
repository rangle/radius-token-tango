import React, { FC, ReactNode, useContext, useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Columns,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  CollectionEntry,
  isColor,
  renderTokenValue,
  TokenEntry,
} from "../services/library.services";
import { ChangeIcon } from "./custom-icons";

import { createLogger } from "@repo/utils";
import {
  TokenCollectionsProvider,
  useTokenCollections,
} from "./token-provider";

const log = createLogger("WEB:list-tokens");

export const TokensList: FC<{
  tokenCollections: CollectionEntry[];
  showOnlyChanges: boolean;
}> = ({ tokenCollections, showOnlyChanges }) => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <TokenCollectionsProvider collections={tokenCollections}>
        {tokenCollections.map((collection) => (
          <CollectionBar
            key={collection.name}
            collection={collection}
            showOnlyChanges={showOnlyChanges}
          />
        ))}
      </TokenCollectionsProvider>
    </ScrollArea>
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
  collection: CollectionEntry;
  showOnlyChanges: boolean;
};

export const CollectionBar: FC<CollectionBarProps> = ({
  collection,
  showOnlyChanges,
}) => {
  const { errors: errorCount, warnings: warningCount } = countCollectionIssues(
    collection.tokens
  );
  const [isOpen, setIsOpen] = useState(showOnlyChanges);
  const { getActiveMode, selectMode } = useTokenCollections();

  const activeMode = getActiveMode(collection.name);
  const setActiveMode = (mode: string) => selectMode(collection.name, mode);

  const modesNames = collection.modes;

  log("warn", "CollectionBar", collection, modesNames, activeMode);

  if (!collection) return null;

  return (
    <TooltipProvider>
      <Collapsible
        open={isOpen || showOnlyChanges}
        onOpenChange={setIsOpen}
        className="mb-4"
      >
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

            {errorCount > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="destructive"
                    className="flex items-center space-x-1"
                  >
                    <AlertCircle size={12} />
                    <span>{errorCount}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Number of tokens with errors</TooltipContent>
              </Tooltip>
            )}

            {warningCount > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-800 text-white flex items-center space-x-1"
                  >
                    <AlertTriangle size={12} />
                    <span>{warningCount}</span>
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
          <div className="mt-1 space-y-1">
            {activeMode &&
              collection.tokens.map((token) => (
                <TokenItemBar
                  key={token.name}
                  token={token}
                  activeMode={activeMode}
                />
              ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

export type TokenItemBarProps = {
  activeMode: string;
  token: TokenEntry;
};

export const TokenItemBar: FC<TokenItemBarProps> = ({ activeMode, token }) => {
  const { changeType } = token;
  const [isOpen, setIsOpen] = useState(false);
  const { getTokenFinalValue: getTokenValue } = useTokenCollections();
  const [value, strValue, strPreviousValue, alias] = getTokenValue(token.name);

  // const [strValue, strPreviousVAlue] = renderTokenValue(token, activeMode);

  log("warn", "TokenItemBar", token.name, value, alias, strValue);

  return (
    <Collapsible key={token.name} open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded transition-colors">
        <span className={`flex align-middle`}>
          <ChangeIcon changeType={changeType} />
          <span
            className={`text-xs font-mono ${changeType === "deleted" ? "line-through" : ""}`}
          >
            {token.name.split(".").map((word, i) => (
              <span
                key={`${token.name}-${word}-${i}`}
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
        </span>
        <div className="flex items-center space-x-2">
          {token.values && !isOpen && (
            <span className="text-xs text-gray-500 flex items-center">
              {isColor(token, activeMode) ? (
                <>
                  <span
                    className="w-3 h-3 mr-2 inline-block border border-gray-300"
                    style={{
                      backgroundColor: strValue,
                    }}
                  />
                  {alias ?? strValue}
                </>
              ) : (
                <span>
                  {token.type}:{" "}
                  <span className="font-semibold">{strValue ?? "N/A"}</span>
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
                    <li key={`${token.name}-error-${index}-${error.message}`}>
                      {error.message}
                    </li>
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
                    <li
                      key={`${token.name}-warning-${index}-${warning.message}`}
                    >
                      {warning.message}
                    </li>
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
        <div className="mb-1 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
          <div>
            <span className="text-gray-600 mr-2">Type:</span>
            <span className="font-semibold text-gray-600 mr-2">
              {token.type}
            </span>
            {alias && (
              <>
                <span className="text-gray-600 mr-2">Reference:</span>
                <span className="text-xs text-gray-800 font-bold mr-2">
                  {alias}
                </span>
              </>
            )}
            <span className="text-gray-600 m-2">Value:</span>
            {token.type === "colors" && strValue ? (
              <>
                <span
                  className="w-3 h-3 mr-2 inline-block border border-gray-300"
                  style={{
                    backgroundColor: strValue,
                  }}
                />
                {strValue}
              </>
            ) : (
              <span>
                {token.changeType !== "modified" ||
                strValue === strPreviousValue ? (
                  <span className="font-semibold">{strValue ?? "N/A"}</span>
                ) : (
                  <>
                    <span className="line-through mr-2">
                      {strPreviousValue ?? "N/A"}
                    </span>
                    <span className="font-semibold">{strValue ?? "N/A"}</span>
                  </>
                )}
              </span>
            )}
          </div>
          {token.errors && token.errors.length > 0 && (
            <div className="my-2">
              <h4 className="font-semibold text-red-600 mb-1">Errors:</h4>
              <ul className="list-disc list-inside">
                {token.errors.map((error, index) => (
                  <li
                    key={`${token.name}-error-detail-${index}-${error.message}`}
                    className="text-red-600"
                  >
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {token.warnings && token.warnings.length > 0 && (
            <div className="my-2">
              <h4 className="font-semibold text-yellow-800 mb-1">Warnings:</h4>
              <ul className="list-disc list-inside">
                {token.warnings.map((warning, index) => (
                  <li
                    key={`${token.name}-warning-detail-${index}-${warning.message}`}
                    className="text-yellow-800"
                  >
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
