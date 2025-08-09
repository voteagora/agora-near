import { HStack } from "../Layout/Stack";
import * as theme from "@/styles/theme";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { icons } from "@/assets/icons";

export const SocialLinks = () => {
  const isMobile = useMediaQuery({
    query: `(max-width: ${theme.maxWidth.md})`,
  });

  const socialLinks = [
    {
      icon: icons.discord,
      alt: "discord",
      url: "https://discord.gg/FaRy8AMy3Z",
    },
    {
      icon: icons.twitter,
      alt: "twitter",
      url: "https://twitter.com/AgoraGovernance",
    },
  ];

  if (isMobile) {
    return null;
  }

  return (
    <HStack gap={3} alignItems="center">
      {socialLinks.map(({ icon, alt, url }, index) => (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
          <Image
            src={icon}
            alt={alt}
            className="mt-[22px] h-4 w-4 align-middle"
          />
        </a>
      ))}
    </HStack>
  );
};
