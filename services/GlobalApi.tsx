export const RunStatus=async(runId:string)=>{
    const response = await fetch(process.env.NEXT_PUBLIC_INNGEST_SERVER_URL+`/${runId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
  });
  const json = await response.json();
  return json.data;
}
// services/GlobalApi.tsx
// services/GlobalApi.tsx
//------------------------------------------------------------------------

