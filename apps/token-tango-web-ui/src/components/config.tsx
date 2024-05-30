import { h, FunctionalComponent, Fragment } from "preact";
import {
  Text,
  Stack,
  Textbox,
  Layer,
  IconCode16,
  Container,
  VerticalSpace,
  useForm,
  Button,
} from "@create-figma-plugin/ui";
import {
  WidgetConfiguration,
  UiCloseHandler,
} from "../../../../apps/token-tango-widget/types/state";
import { useEffect } from "preact/hooks";
import { emit } from "@create-figma-plugin/utilities";

export type ConfigFormProps = {
  state: WidgetConfiguration;
  updateState: (newState: WidgetConfiguration) => void;
};

export const ConfigForm: FunctionalComponent<ConfigFormProps> = ({
  state,
  updateState,
}) => {
  const { disabled, formState, handleSubmit, initialFocus, setFormState } =
    useForm<WidgetConfiguration>(state, {
      close: function (formState: WidgetConfiguration) {
        console.log("close", formState);
      },
      submit: function (formState: WidgetConfiguration) {
        console.log("submit", formState);
        updateState(formState);
      },

      validate: function (formState: WidgetConfiguration) {
        return Object.values(formState).every((v) => v !== undefined);
      },
    });

  useEffect(() => {
    Object.entries(state).forEach(([key, value]) =>
      setFormState(value, key as keyof WidgetConfiguration)
    );
  }, [state]);

  const handle = (field: keyof WidgetConfiguration) => (value: string) =>
    setFormState(value, field);

  return (
    <Fragment>
      <Container space="medium">
        <VerticalSpace space="medium" />
        <Text>Configure Repository to Export Tokens</Text>
        <VerticalSpace space="medium" />
        <label>
          Name:
          <Textbox
            {...initialFocus}
            onValueInput={handle("name")}
            value={formState.name}
            variant="border"
          />
        </label>
        <VerticalSpace space="medium" />
        <label>
          Access Token:
          <Textbox
            {...initialFocus}
            onValueInput={handle("accessToken")}
            password
            value={formState.accessToken}
            variant="border"
          />
        </label>
        <VerticalSpace space="medium" />{" "}
        <label>
          Repository:
          <Textbox
            {...initialFocus}
            onValueInput={handle("repository")}
            value={formState.repository}
            variant="border"
          />
        </label>
        <VerticalSpace space="medium" />{" "}
        <label>
          Branch:
          <Textbox
            {...initialFocus}
            onValueInput={handle("branch")}
            value={formState.branch}
            variant="border"
          />
        </label>
        <VerticalSpace space="medium" />{" "}
        <label>
          File Path:
          <Textbox
            {...initialFocus}
            onValueInput={handle("path")}
            value={formState.path}
            variant="border"
          />
        </label>
        <VerticalSpace space="large" />
        <Button secondary onClick={() => emit<UiCloseHandler>("UI_CLOSE")}>
          Cancel
        </Button>
        <Button disabled={disabled === true} onClick={handleSubmit}>
          Submit
        </Button>
      </Container>
    </Fragment>
  );
};
