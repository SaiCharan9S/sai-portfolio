export const SOCIAL_LOGOS = {
  gmail: "/logos/social/gmail.svg",
  phone: "/logos/social/phone.svg",
  linkedin: "/logos/social/linkedin.svg",
  x: "/logos/social/x.svg",
  github: "/logos/social/github.svg",
  whatsapp: "/logos/social/whatsapp.svg",
} as const;

export type SocialLogoKey = keyof typeof SOCIAL_LOGOS;
