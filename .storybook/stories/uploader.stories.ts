import { storiesOf } from "@storybook/polymer";
import { withKnobs } from "@storybook/addon-knobs";
import { html } from "lit-html";
import "@chameleon-ds/uploader/src/chameleon-uploader";

const stories = storiesOf("Uploader", module);

// Typecasting this as "any" is a quick workaround. Please come back
// to this and make these types compatible.
stories.addDecorator(withKnobs as any);

stories.add(
  "Single File",
  () => {
    return html`
      <chameleon-uploader></chameleon-uploader>
    `;
  },
  { info: { inline: true } }
);
