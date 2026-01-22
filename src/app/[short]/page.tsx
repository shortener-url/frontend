import URLRedirect from "@/components/URLRedirect";


export default async function PageRedirect({
  params,
}: {
  params: { short: string };
}) {  

  return <URLRedirect shortURL={params.short}/>
}



