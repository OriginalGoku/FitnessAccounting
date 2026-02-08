import React from "react";
import { EmptyState, Link, Text, hubspot } from "@hubspot/ui-extensions";

type SettingsProps = {
  context: Record<string, unknown>;
};

hubspot.extend<"settings">(({ context }) => <SettingsPage context={context} />);

const SettingsPage = ({ context }: SettingsProps) => {
  const appSettingsDocsLink =
    "https://developers.hubspot.com/docs/apps/developer-platform/add-features/ui-extensibility/create-a-settings-component";

  console.log({ context });

  return (
    <>
      <EmptyState
        title="Build your Settings page here!"
        layout="horizontal"
        imageName="building"
      >
        <Text>
          Add configuration and customization settings for your app, linked to
          directly from your app cards. Check out the{" "}
          <Link href={appSettingsDocsLink}>app settings documentation</Link> for
          more info.
        </Text>
      </EmptyState>
    </>
  );
};
