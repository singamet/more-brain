import { TrashIcon } from "@heroicons/react/16/solid";
import { format } from "date-fns";
import Button from "../../ui/Button";
import { ContentType } from "../../lib/types";
import Icon from "../../ui/Icon";
import Embed from "./Embed";
import { useNavigate } from "react-router-dom";

export default function ContentCard({
  content,
  isVisitor,
}: {
  content: ContentType;
  isVisitor: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-4 flex h-fit w-xs break-inside-avoid flex-col justify-between gap-2 rounded-xl border-[1px] border-zinc-200 bg-zinc-100 shadow-lg dark:border-zinc-900 dark:bg-zinc-800/100">
      <div className="flex h-12 w-full items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <div>
            <Icon type={content.category?.name ?? ""} />
          </div>
          <h2 className="line-clamp-2 text-sm">{content.title}</h2>
        </div>
        {!isVisitor && (
          <div className="flex items-center gap-4">
            <Button
              variant="icon"
              icon={<TrashIcon className="h-4 w-4" />}
              onClick={() => {
                navigate(`/content/delete/${content._id}`, {
                  state: { modal: "deleteContent" },
                });
              }}
            />
          </div>
        )}
      </div>

      {content.link && <Embed url={content.link} />}
      <div className="flex flex-col gap-1"></div>
      <div className="w-full px-2">
        {content.tags &&
          content.tags.map((tag) => (
            <span key={tag._id}>
              <Button variant="tag" text={tag.tagname} onClick={() => {}} />
            </span>
          ))}
      </div>
      <div className="flex h-6 w-full justify-end px-2">
        <p className="text-xs text-gray-400">
          Added on {format(content.createdAt, "MM/dd/yyyy")}
        </p>
      </div>
    </div>
  );
}
