export type CreatorSocialPlatform = "x" | "github" | "instagram" | "linkedin" | "youtube";

export type CreatorSocial = {
  platform: CreatorSocialPlatform;
  label: string;
  handle: string;
  url: string;
};

export const CREATOR_PROFILE = {
  name: "Harshit Dhyani",
  brand: "HarshBuilds",
  socials: [
    {
      platform: "x",
      label: "X",
      handle: "@HarshBuilds_1",
      url: "https://x.com/HarshBuilds_1"
    },
    {
      platform: "github",
      label: "GitHub",
      handle: "Harshit-Dhyani",
      url: "https://github.com/Harshit-Dhyani"
    },
    {
      platform: "instagram",
      label: "Instagram",
      handle: "@harshbuilds1",
      url: "https://www.instagram.com/harshbuilds1/"
    },
    {
      platform: "youtube",
      label: "YouTube",
      handle: "@HarshBuilds1",
      url: "https://www.youtube.com/@HarshBuilds1"
    }
  ] satisfies CreatorSocial[]
} as const;

// Reserved for a future explicit official-social layer. Keep empty until verified
// government accounts are intentionally added to the product.
export const OFFICIAL_SOCIALS: readonly CreatorSocial[] = [];
