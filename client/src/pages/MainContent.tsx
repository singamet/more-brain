import { useSearchParams } from "react-router-dom";
import ContentCard from "../components/content/ContentCard";
import MainContentHeader from "../components/content/MainContentHeader";
import { useQuery } from "@tanstack/react-query";
import { getContent } from "../api/content";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { contentItemsAtom, filteredContentAtom } from "../atoms/app";
import ContentSkeleton from "../ui/skeletons/ContentSkeleton";

export default function MainContent() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const token = localStorage.getItem("auth");
  const setContentItems = useSetAtom(contentItemsAtom);
  const filteredContent = useAtomValue(filteredContentAtom);
  const query = useQuery({
    queryKey: ["getContent", category, tag],
    queryFn: () => getContent(category, tag, token as string),
    enabled: !!token,
  });
  useEffect(() => {
    if (query.isSuccess) {
      setContentItems(query.data);
    }
  }, [query.isSuccess, query.data, setContentItems]);
  if (query.isLoading || query.isFetching) {
    return <ContentSkeleton />;
  }
  return (
    <div className="mb-4 flex h-full w-full flex-1 flex-col rounded-xl bg-zinc-50/50 p-4 shadow-2xl transition-all duration-300 dark:bg-zinc-800/50">
      <MainContentHeader />

      <div className="max-h-[calc(100vh-180px)] w-full overflow-y-auto py-4 ps-4 lg:max-h-[calc(100vh-240px)]">
        <div className="3xl:columns-4 columns-1 lg:columns-2 2xl:columns-3">
          {filteredContent.map((content) => (
            <ContentCard
              key={content._id}
              content={content}
              isVisitor={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
