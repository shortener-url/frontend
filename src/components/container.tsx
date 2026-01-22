"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import Result from "@/components/result";
import { useState } from "react";
import { shorten } from "@/lib/action";
import { useToast } from "./ui/use-toast";
import Recaptcha from "./recaptcha";
import SubmitLongUrl from "./submit-long-url";

const FormSchema = z.object({
  newLongUrl: z.string().url({ message: "must be a valid URL." }),
});

type FormSchemaType = z.infer<typeof FormSchema>;
export default function Container() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [isOpenResult, setIsOpenResult] = useState(false);
  const { handleReCaptchaVerify } = Recaptcha({
    action: "submit",
    onVerify: () => {},
  });

  const { toast } = useToast();

  async function onSubmit(data: FormSchemaType) {
    try {
      const token = await handleReCaptchaVerify();
      if (!token) {
        toast({
          description: "Invalid reCAPTCHA!. Refresh the page and try again.",
        });
        return;
      }

      setLoading(true);
      // console.log("Submitting form:", data);

      const res = await shorten(data.newLongUrl, token);
      if (res.status === "error") {
        console.log("error message: ", res.message);
        toast({
          description: res.message,
        });
        return;
      }
      const shortUrl = typeof res.data === "string" ? res.data : "";
      setShortUrl(shortUrl);
      setLongUrl(data.newLongUrl);
      form.reset();
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setLoading(false);
      setIsOpenResult(true);
    }
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <section className="w-full max-w-7xl space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SubmitLongUrl control={form.control} loading={loading} />
        </form>
      </Form>
      <Result
        shortUrl={shortUrl}
        longUrl={longUrl}
        isOpen={isOpenResult}
        setIsOpen={setIsOpenResult}
        setShortUrl={setShortUrl}
      />
    </section>
  );
}
