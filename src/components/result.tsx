"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import CustomShortUrlInput from "./custom-short-url";
import { CheckKeyAvailability, UpdateKeyShortURL } from "@/lib/action";
import { useState } from "react";

export default function Result({
  shortUrl,
  setShortUrl,
  longUrl,
  isOpen,
  setIsOpen,
}: {
  shortUrl: string;
  setShortUrl: (shortUrl: string) => void,
  longUrl: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {  

  const [feedback, setFeedback] = useState(false);
  
  const isChangeValidKeyOK = async (key: string): Promise<boolean> => {    
    const update =  await UpdateKeyShortURL(shortUrl, key)
    if (update.status === "success"){
      setShortUrl(key)
      setFeedback(true);
      setTimeout(() => setFeedback(false), 1500);      
      return true;
    }    
    return false;
  };

  const { toast } = useToast();
  const copyToClipboard = () => {
    if (shortUrl) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(process.env.NEXT_PUBLIC_URL_BASE + "/" + shortUrl)
          .then(() => {
            toast({
              description: "URL copied to clipboard.",
            });
          })
          .catch((err) => {
            console.error("Error copying to clipboard", err);
          });
      } else {
        // Fallback for browsers that don't support navigator.clipboard
        const textArea = document.createElement("textarea");
        textArea.value = process.env.NEXT_PUBLIC_URL_BASE + "/" + shortUrl;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          toast({
            description: "URL copied to clipboard.",
          });
        } catch (err) {
          console.error("Error copying to clipboard", err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  if (!isOpen) return null;

  return (
    shortUrl && (
      // <div className="flex flex-col w-full gap-6">
      <Card className="flex flex-col w-full gap-6">
        <CardHeader className="flex flex-row gap-2 justify-between">
          <CardTitle className="content-end text-slate-400">
            Shortening your URL
          </CardTitle>
          <Button
            variant="ghost"
            className="border-2 bg-pink-800"
            title="close"
            onClick={() => setIsOpen(false)}
          >
            <span className="icon-[material-symbols--close-small-rounded] h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <p className="content-center">URL Short:</p>
            <span className={`p-2 block break-words transition-colors ${
                feedback ? "bg-green-900" : "bg-rose-950"
              }`}>
              {" "}
              {process.env.NEXT_PUBLIC_URL_BASE + "/" + shortUrl}
            </span>
            <Button
              onClick={copyToClipboard}
              data-umami-event="Copy to clipboard"
            >
              Copy to clipboard
            </Button>
          </div>
          <div className="pt-4">
            <CustomShortUrlInput onChangeKey={isChangeValidKeyOK}/>
          </div>
          <div className="text-gray-400 text-sm">
            <p>
              Original URL:
              <a
                href={longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline block break-words"
              >
                {" "}
                {longUrl}
              </a>
            </p>
          </div>
          <div className="text-gray-400 text-sm pt-4">
            <p>
              Click Statistics for Your Short URL:
              <a
                href={
                  process.env.NEXT_PUBLIC_URL_BASE + "/" + shortUrl + "/stats"
                }
                rel="noopener noreferrer"
                className="text-blue-500 underline"
                data-umami-event={`Click link /${shortUrl}/stats`}
              >
                {" "}
                {process.env.NEXT_PUBLIC_URL_BASE + "/" + shortUrl + "/stats"}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  );
}
