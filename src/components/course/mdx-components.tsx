import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Conversation, Message, YoutubeEmbed } from "./conversation";

function InlineLink({ href, ...props }: ComponentPropsWithoutRef<"a">) {
  if (!href) {
    return <a {...props} />;
  }

  if (href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} rel="noreferrer" target="_blank" {...props} />;
}

export const mdxComponents = {
  a: InlineLink,
  Conversation,
  Message,
  YoutubeEmbed,
};
