import { redirect } from "next/navigation";

export default function Home() {
  // 临时：重定向到一个默认的白板
  redirect("/board/default");
}
