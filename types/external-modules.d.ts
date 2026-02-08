declare module "text-to-svg" {
  type TextOptions = {
    x?: number;
    y?: number;
    fontSize?: number;
    anchor?: string;
    attributes?: Record<string, string | number>;
  };

  interface Metrics {
    width: number;
    height: number;
  }

  interface TextToSVGInstance {
    getD(text: string, options?: TextOptions): string;
    getMetrics(text: string, options?: TextOptions): Metrics;
  }

  interface TextToSVGStatic {
    loadSync(fontPath?: string): TextToSVGInstance;
  }

  const TextToSVG: TextToSVGStatic;
  export default TextToSVG;
}

declare module "@hubspot/ui-extensions" {
  import * as React from "react";

  type ExtensionContext = Record<string, unknown>;

  export const hubspot: {
    extend<T extends string>(
      render: (props: { context: ExtensionContext }) => React.ReactElement | null,
    ): void;
  };

  export const EmptyState: React.ComponentType<Record<string, unknown>>;
  export const Link: React.ComponentType<Record<string, unknown>>;
  export const Text: React.ComponentType<Record<string, unknown>>;
}
