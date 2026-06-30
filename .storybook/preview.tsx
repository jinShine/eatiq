import type { Preview } from "@storybook/nextjs-vite";

import "../src/styles/css/globals.css";
import { monoFont, sansFont } from "../src/styles/font/global-font";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },

  decorators: [
    Story => (
      <div className={`${sansFont.variable} ${monoFont.variable} font-sans text-text-primary`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
