import React, { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { LinkIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

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
  const [redditData, setRedditData] = useState<{ html: string }>();
  useEffect(() => {
    const fetchReddit = async (url: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/embed?url=${url}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth") as string}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setRedditData({ html: "<p>Post not found</p>" });
        return;
      }
      // console.log(data.type);
      setRedditData(data);
    };
    fetchReddit(url);
  }, [url]);

  useEffect(() => {
    if (!redditData) return;
    const script = document.createElement("script");
    script.src = "https://embed.reddit.com/widgets.js";
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      if (window.__REDDIT_EMBED) {
        window.__REDDIT_EMBED.init();
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [redditData]);
  const result = redditData?.html;
  if (!redditData || !result) {
    return <p>Loading...</p>;
  }
  const sanitizedHtml = DOMPurify.sanitize(result);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
});
