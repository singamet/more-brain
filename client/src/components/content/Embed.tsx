import { memo, useEffect } from "react";
import { LinkIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}

export default function Embed({ url }: { url: string }) {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;
  const urlArray = url.split("/");
  const id = urlArray[urlArray.length - 1];

  if (
    (hostname.includes("twitter.com") || hostname.includes("x.com")) &&
    pathname.includes("/status/")
  ) {
    return <Tweet id={id} />;
  } else if (
    hostname.includes("youtube.com") &&
    parsedUrl.searchParams.has("v")
  ) {
    return <Youtube id={parsedUrl.searchParams.get("v") ?? ""} />;
  } else if (hostname.includes("youtu.be")) {
    return <Youtube id={id} />;
  } else if (
    hostname.includes("reddit.com") &&
    pathname.includes("/comments/")
  ) {
    return <Reddit url={url} />;
  } else {
    return (
      <div className="flex w-full items-start gap-2 p-2 break-all">
        <div className="pt-1">
          <LinkIcon className="h-4 w-4" />
        </div>
        <Link to={url} className="hover:underline" target="_blank">
          {url}
        </Link>
      </div>
    );
  }
}

const Tweet = memo(({ id }: { id: string }) => {
  const loadTwitterScript = () => {
    if (
      !document.querySelector(
        "script[src='https://platform.twitter.com/widgets.js']",
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;

      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      loadTwitterScript();
      window.twttr.widgets.load();
    } else {
      console.error("Twitter widgets script is not loaded.");
    }
  }, [id]);
  return (
    <blockquote className="twitter-tweet">
      <a href={`https://twitter.com/username/status/${id}`}></a>
    </blockquote>
  );
});
const Youtube = memo(({ id }: { id: string }) => {
  return (
    <iframe
      className="h-64 w-full"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
});

const Reddit = memo(({ url }: { url: string }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.redditmedia.com/widgets/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <blockquote className="reddit-card" data-card-created="true">
      <a href={url}>View Reddit Post</a>
    </blockquote>
  );
});
