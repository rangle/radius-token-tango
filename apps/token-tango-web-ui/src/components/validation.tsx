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

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { State } from "../../../../apps/token-tango-widget/types/state";
import { Badge } from "@/components/ui/badge";

import { Search } from "lucide-react";
import { getFormat, FormatName } from "radius-toolkit";

import { createLogger } from "@repo/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  filterLibraryState,
  toCollectionEntries,
  toVectorCollectionEntries,
} from "../services/library.services";

import { VectorsList } from "./list-vectors";
import { TokensList } from "./list-tokens";

const log = createLogger("WEB:validation");

export type ValidationResultProps = {
  state: State;
};

export const ValidationResult: FC<ValidationResultProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState("tokens");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);

  const {
    format: { name },
  } = state;

  const format = getFormat(name as FormatName);

  if (!format) return null;

  const collectionEntries = useMemo(
    () => toCollectionEntries({ ...state, format }),
    [state]
  );
  const numOfTokenChanges = useMemo(
    () =>
      collectionEntries.reduce(
        (acc, collection) =>
          acc + collection.tokens.filter((t) => t.changeType).length,
        0
      ),
    [collectionEntries]
  );
  const vectorCollectionEntries = useMemo(
    () => toVectorCollectionEntries({ ...state, format }),
    [state]
  );
  const numOfVectorChanges = useMemo(
    () =>
      vectorCollectionEntries.reduce(
        (acc, collection) =>
          acc + collection.vectors.filter((v) => v.changeType).length,
        0
      ),
    [vectorCollectionEntries]
  );
  const libraryState = useMemo(
    () =>
      filterLibraryState(
        collectionEntries,
        vectorCollectionEntries,
        searchTerm ? searchTerm.toLowerCase() : "",
        showOnlyChanges
      ),
    [collectionEntries, vectorCollectionEntries, searchTerm, showOnlyChanges]
  );

  return (
    <TooltipProvider>
      <Card className="w-[575px] h-[700px] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Library Manager</CardTitle>
          <CardDescription>
            Manage your design tokens and vectors
          </CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-grow">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showOnlyChanges}
                onCheckedChange={setShowOnlyChanges}
                id="show-changes"
              />
              <label htmlFor="show-changes" className="text-sm">
                Show only changes
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="tokens"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="tokens">
                Design Tokens ({libraryState.totalNumOfTokens})
                <ChangeIndicator count={numOfTokenChanges} />
              </TabsTrigger>
              <TabsTrigger value="vectors">
                Vectors ({libraryState.totalNumOfVectors})
                <ChangeIndicator count={numOfVectorChanges} />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tokens">
              <TokensList
                tokenCollections={libraryState.collections}
                showOnlyChanges={showOnlyChanges}
              />
            </TabsContent>
            <TabsContent value="vectors">
              <VectorsList
                vectorCollections={libraryState.vectors}
                showOnlyChanges={showOnlyChanges}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

const ChangeIndicator: FC<{ count: number }> = ({ count }) => (
  <Badge variant="secondary" className="ml-2">
    {count} changes
  </Badge>
);
