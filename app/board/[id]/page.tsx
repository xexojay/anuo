import CanvasBoard from "@/components/canvas/CanvasBoard";
import ChatBar from "@/components/chat/ChatBar";
import FloatingToolbar from "@/components/ui/FloatingToolbar";
import { EditorProvider } from "@/components/canvas/EditorContext";

export default function BoardPage({ params }: { params: { id: string } }) {
  return (
    <EditorProvider>
      <div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 relative">
        {/* 白板区域 */}
        <CanvasBoard />

        {/* 悬浮工具栏 */}
        <FloatingToolbar />

        {/* 悬浮聊天框 */}
        <ChatBar />
      </div>
    </EditorProvider>
  );
}
