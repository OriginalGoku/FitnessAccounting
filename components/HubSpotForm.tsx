"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    hbspt?: any;
  }
}

type HubSpotFormProps = {
  portalId: string;
  formId: string;
  region?: string; // e.g. "na3"
};

export default function HubSpotForm({
  portalId,
  formId,
  region = "na3",
}: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const createdRef = useRef(false);

  const createForm = () => {
    if (createdRef.current) return;
    if (!containerRef.current) return;
    if (!window.hbspt?.forms?.create) return;

    window.hbspt.forms.create({
      region,
      portalId,
      formId,
      target: `#${containerRef.current.id}`,
    });

    createdRef.current = true;
  };

  useEffect(() => {
    // Covers client-side navigation where the script may already be loaded
    createForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script
        src={`https://js-${region}.hsforms.net/forms/embed/v2.js`}
        strategy="afterInteractive"
        onLoad={createForm}
      />
      <div id={`hs-form-${formId}`} ref={containerRef} />
    </>
  );
}
