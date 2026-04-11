export async function generateStaticParams() {
  return [
    { level: "4ap" },
    { level: "5ap" },
  ];
}

export default function LevelLayout({ children }) {
  return <>{children}</>;
}