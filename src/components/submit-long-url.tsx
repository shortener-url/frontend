import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import AutoResizeTextarea from "./autoresize-textarea";

type FormSchemaType = {
  newLongUrl: string;
};

type SubmitLongUrlProps = {
  control: Control<FormSchemaType>;
  loading: boolean;
};
export default function SubmitLongUrl({
  control,
  loading,
}: SubmitLongUrlProps) {
  return (
    <div className="flex flex-col">
      <FormField
        control={control}
        name="newLongUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Long URL</FormLabel>
            <FormControl>
              <AutoResizeTextarea
                {...field}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={loading} data-umami-event="Get short URL">
        Get short URL {"  "}{" "}
        {loading && (
          <span className="icon-[svg-spinners--tadpole] h-4 w-4"></span>
        )}
      </Button>
    </div>
  );
}
