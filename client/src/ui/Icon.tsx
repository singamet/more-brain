import {
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  LinkIcon,
  PlayCircleIcon,
  TagIcon,
} from "@heroicons/react/16/solid";

export default function Icon({ type }: { type: string }) {
  switch (type) {
    case "Documents":
      return <DocumentTextIcon className="h-6 w-6 text-lime-500" />;
    case "Videos":
      return <PlayCircleIcon className="h-6 w-6 text-lime-500" />;
    case "Tweets":
      return (
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-lime-500" />
      );
    case "Links":
      return <LinkIcon className="h-6 w-6 text-lime-500" />;
    default:
      return <TagIcon className="h-6 w-6 text-lime-500" />;
  }
}
