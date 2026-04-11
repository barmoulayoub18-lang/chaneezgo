import { texts4ap } from "@/data/texts/4ap";
import { texts5ap } from "@/data/texts/5ap";

export async function generateStaticParams() {
  const params = [];
  
  texts4ap.forEach((text) => {
    params.push({ level: "4ap", id: text.id.toString() });
  });

  texts5ap.forEach((text) => {
    params.push({ level: "5ap", id: text.id.toString() });
  });

  return params;
}

export default function ReadingLayout({ children }) {
  return <>{children}</>;
}