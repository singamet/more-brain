import { useParams, useSearchParams } from "react-router-dom";
import ContentCard from "../components/content/ContentCard";
import { useAtomValue, useSetAtom } from "jotai";
import { contentItemsAtom, filteredContentAtom } from "../atoms/app";
import { useQuery } from "@tanstack/react-query";
import { getSharedContent } from "../api/content";
import { useEffect } from "react";
import ContentSkeleton from "../ui/skeletons/ContentSkeleton";
import ContentError from "../ui/error/ContentError";

export default function MainContent() {
  const { hash } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const setContentItems = useSetAtom(contentItemsAtom);
  const filteredContent = useAtomValue(filteredContentAtom);
  const query = useQuery({
    queryKey: ["getSharedContent", category, tag],
    queryFn: () => getSharedContent(hash as string, category, tag),
    enabled: !!hash,
  });
  useEffect(() => {
    if (query.isSuccess) {
      setContentItems(query.data);
    }
  }, [query.isSuccess, query.data, setContentItems]);
  if (query.isLoading || query.isFetching) {
    return <ContentSkeleton />;
  }
  if (query.isError) {
    return (
      <ContentError error="It seems the link you are trying to access is invalid!" />
    );
  }
  return (
    <div className="mb-4 flex h-full w-full flex-1 flex-col rounded bg-zinc-50/50 p-4 shadow-xl transition-all duration-300 dark:bg-zinc-800/50">
      <div className="max-h-[calc(100vh-180px)] w-full overflow-y-auto py-4 ps-4 lg:max-h-[calc(100vh-240px)]">
        <div className="3xl:columns-4 columns-1 lg:columns-2 2xl:columns-3">
          {filteredContent.map((content) => (
            <ContentCard key={content._id} content={content} isVisitor={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
