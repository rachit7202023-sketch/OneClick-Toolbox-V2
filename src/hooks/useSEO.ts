import { useEffect } from "react";

const SITE_NAME = "Atomest";
const BASE_URL = "https://atomest.com";
const DEFAULT_TITLE = "Atomest \u2014 The Internet's Toolbox";
const DEFAULT_DESCRIPTION =
  "31+ free online tools for developers, students, creators and everyone. No sign-up required.";
const OG_IMAGE = "https://atomest.com/opengraph.jpg";

interface SEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [attrName, attrVal] = attr.split("=");
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, canonicalPath }: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} \u2013 ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', "name=description", description);
    setCanonical(canonicalUrl);

    setMeta('meta[property="og:title"]', "property=og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property=og:description", description);
    setMeta('meta[property="og:url"]', "property=og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property=og:image", OG_IMAGE);

    setMeta('meta[name="twitter:title"]', "name=twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name=twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name=twitter:image", OG_IMAGE);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "name=description", DEFAULT_DESCRIPTION);
      setCanonical(BASE_URL);
      setMeta('meta[property="og:title"]', "property=og:title", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "property=og:description", DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:url"]', "property=og:url", BASE_URL);
      setMeta('meta[property="og:image"]', "property=og:image", OG_IMAGE);
      setMeta('meta[name="twitter:title"]', "name=twitter:title", DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', "name=twitter:description", DEFAULT_DESCRIPTION);
      setMeta('meta[name="twitter:image"]', "name=twitter:image", OG_IMAGE);
    };
  }, [title, description, canonicalPath]);
}
