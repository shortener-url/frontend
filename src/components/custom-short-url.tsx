"use client";
import { useState, useEffect, useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { CheckKeyAvailability } from "@/lib/action";

type CustomShortUrlInputProps = {
  onChangeKey: (key: string) => Promise<boolean>;
};
export default function CustomShortUrlInput({
  onChangeKey,
}: CustomShortUrlInputProps) {
  const [customKey, setCustomKey] = useState("");
  const [loadingFindKey, setLoadingFindKey] = useState(false);
  const [isKeyAvailable, setIsKeyAvailable] = useState<boolean | null>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean>(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const isValidKey = (key: string): boolean => /^[0-9a-zA-Z]+$/.test(key);

  const handleValidKey = async (): Promise<void> => {
    setLoadingFindKey(true);
    console.log("handleValidKey:", customKey);
    const isOK = await onChangeKey(customKey);
    if (isOK) {
      setCustomKey("");
      setIsKeyAvailable(null);
    }
    setLoadingFindKey(false);
  };

  const validateKey = useCallback(async () => {
    if (customKey.length >= 2) {
      console.log("checkKeyAvailability:", customKey);
      const available = await CheckKeyAvailability(customKey);
      setIsKeyAvailable(available);
    } else {
      setIsKeyAvailable(null); // Reset state if the key is too short
    }
  }, [customKey]);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (customKey.length >= 2) {
      setIsKeyValid(isValidKey(customKey));
      if (!isKeyValid) {
        return;
      }
      setLoadingFindKey(true);
      setTypingTimeout(
        setTimeout(() => {
            isKeyValid && validateKey();          
        }, 800)
      );
      setLoadingFindKey(false);
    } else {
      setIsKeyAvailable(null);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [customKey, validateKey]);

  return (
    <div className="flex sm:flex-row flex-col items-center gap-2 sm:h-16 pb-2 text-sm">
      <label className="whitespace-nowrap self-start pt-2"> Custom Key:</label>
      <div className="flex flex-col self-start">
        <Input
          value={customKey}
          onChange={(e) => setCustomKey(e.target.value)}
          placeholder="Enter custom key"
          className="w-40"
          maxLength={10}
        />
        {!isKeyValid && (
          <div className="text-red-500">            
            Only alphanumeric characters are allowed.
          </div>
        )}
        {(isKeyValid && isKeyAvailable !== null) && customKey.length >= 2 && (
          <div className="flex items-center gap-2 text-sm font-bold">
            <span
              className={
                isKeyAvailable
                  ? "icon-[material-symbols--check-circle-outline-rounded] bg-green-500"
                  : "icon-[material-symbols--cancel-outline-rounded] bg-red-500"
              }
            ></span>
            <p className={isKeyAvailable ? "text-green-200" : "text-red-200"}>
              {isKeyAvailable ? "Key is available!" : "Key is not available."}
            </p>
          </div>
        )}
      </div>
      <Button
        className="self-start"
        type="button"
        data-umami-event="Update short URL"
        disabled={!isKeyAvailable}
        onClick={handleValidKey}
      >
        Update &nbsp;
        {loadingFindKey && (
          <span className="icon-[svg-spinners--tadpole] h-4 w-4"></span>
        )}
      </Button>
    </div>
  );
}
