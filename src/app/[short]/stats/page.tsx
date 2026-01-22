import ContainerStats from "@/components/stats/container-stats";

export default function PageStatsByShort({
    params,
  }: {
    params: { short: string };
  }){
    // console.log("PageStatsByShort: ",params.short);
    return  <ContainerStats keyShort={params.short} />;
}