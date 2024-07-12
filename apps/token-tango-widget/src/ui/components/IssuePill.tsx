import { FormatValidationResult } from "radius-toolkit";
import { ErrorPill } from "./error-pill";

const { widget } = figma;
const { Text } = widget;

export const IssuePill: FunctionalWidget<{
  issues: FormatValidationResult[];
}> = ({ issues }) => {
  const plural = issues.length > 1 ? "s" : "";
  const label = issues.every((issue) => issue.isWarning) ? "Warning" : "Error";
  return issues.length ? (
    <ErrorPill level={label === "Warning" ? "warning" : "error"}>
      {issues.length} {label}
      {plural}
    </ErrorPill>
  ) : (
    <Text></Text>
  );
};
