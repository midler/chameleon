import { storiesOf } from "@storybook/polymer";
import { withKnobs } from "@storybook/addon-knobs";
import { html } from "lit-html";
import "../../packages/select/src/chameleon-select";

const stories = storiesOf("Select", module);

// Typecasting this as "any" is a quick workaround. Please come back
// to this and make these types compatible.
stories.addDecorator(withKnobs as any);

const exampleData = [
  {
    value: "value-0",
    label: "Direct Marketing",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-1",
    label: "District 1",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-2",
    label: "District 2",
    preLabel: "pre-label",
    postLabel: "Enrollment"
  },
  {
    value: "value-3",
    label: "District 3",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-4",
    label: "four",
    preLabel: "pre-label",
    postLabel: "Enrollment"
  },
  {
    value: "value-5",
    label: "five",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-6",
    label: "six",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-7",
    label: "seven",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-8",
    label: "eight",
    preLabel: "pre-label",
    postLabel: "Enrollment"
  },
  {
    value: "value-9",
    label: "nine",
    preLabel: "pre-label",
    postLabel: "Custom"
  },
  {
    value: "value-10",
    label: "ten",
    preLabel: "pre-label",
    postLabel: "Custom"
  }
];

stories.add(
  "Basic",
  () => {
    // const disabled = boolean("Disabled", false);

    return html`
      <chameleon-select .options="${exampleData}">select</chameleon-select>
    `;
  },
  { info: { inline: true } }
);
