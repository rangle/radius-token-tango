import React, { FC, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  AddedIcon,
  ChangeIcon,
  ModifiedIcon,
  RemovedIcon,
} from "./custom-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { VectorCollection, VectorEntry } from "../services/library.services";

export type VectorsListProps = {
  vectorCollections: VectorCollection[];
  showOnlyChanges: boolean;
};

export const VectorsList: FC<VectorsListProps> = ({
  vectorCollections,
  showOnlyChanges,
}) => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      {vectorCollections.map((collection) => (
        <VectorCategory
          key={collection.name}
          category={collection}
          showOnlyChanges={showOnlyChanges}
        />
      ))}
    </ScrollArea>
  );
};

type VectorCategoryProps = {
  category: VectorCollection;
  showOnlyChanges: boolean;
};

export const VectorCategory: FC<VectorCategoryProps> = ({
  category,
  showOnlyChanges,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {category.name}
      </h3>
      <div className="space-y-2">
        {category.vectors.map((vector) => (
          <VectorItem
            key={vector.name}
            vector={vector}
            showOnlyChanges={showOnlyChanges}
          />
        ))}
      </div>
    </div>
  );
};

type SVGPreviewProps = {
  src: string;
  className?: string;
};

const SVGPreview: FC<SVGPreviewProps> = ({ src, className }) => {
  // Use a regular expression to extract the viewBox attribute
  const viewBoxMatch = src.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24"; // Default to 24x24 if not found

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg viewBox={viewBox} style={{ width: "100%", height: "100%" }}>
        <g dangerouslySetInnerHTML={{ __html: src }} />
      </svg>
    </div>
  );
};

type VectorItemProps = {
  vector: VectorEntry;
  showOnlyChanges: boolean;
};

export const VectorItem: FC<VectorItemProps> = ({
  vector,
  showOnlyChanges,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (showOnlyChanges && !vector.changeType) return null;

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded transition-colors">
            <div className="flex items-center space-x-2">
              <ChangeIcon changeType={vector.changeType} />
              <div className="w-6 h-6 bg-gray-100 flex items-center justify-center overflow-hidden">
                <SVGPreview src={vector.src} className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">{vector.name}</span>
              {vector.description && vector.description !== vector.name && (
                <span className="text-xs text-gray-500">
                  {vector.description}
                </span>
              )}
            </div>
            <ChevronRight
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-90" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 bg-gray-50 rounded-md mt-2">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                {/* Larger preview of the vector */}
                <SVGPreview src={vector.src} className="w-full h-full" />
              </div>
              <div>
                <h4 className="font-semibold">{vector.name}</h4>
                {vector.description && vector.description !== vector.name && (
                  <p className="text-xs text-gray-600 mt-1">
                    {vector.description}
                  </p>
                )}
                {vector.properties &&
                  Object.keys(vector.properties).length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs font-semibold">Properties:</h5>
                      <ul className="text-xs">
                        {Object.entries(vector.properties).map(
                          ([key, value]) => (
                            <li key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                <div className="mt-2">
                  <ChangeIcon
                    changeType={vector.changeType}
                    label={`This vector will be be ${vector.changeType} in the repository when you push your changes.`}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};
