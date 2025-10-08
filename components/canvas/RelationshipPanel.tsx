"use client";

import { useState } from "react";
import { createShapeId } from "tldraw";
import { useEditorContext } from "./EditorContext";

export default function RelationshipPanel() {
  const { editor } = useEditorContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  const analyzeRelationships = async () => {
    if (!editor) return;

    setIsAnalyzing(true);
    try {
      // 获取画布上所有的自定义卡片
      const shapes = editor.getCurrentPageShapes();
      const cards = shapes
        .filter((shape) =>
          [
            "search-result-card",
            "note-card",
            "cluster-card",
          ].includes(shape.type)
        )
        .map((shape: any) => ({
          id: shape.id,
          type: shape.type,
          content: shape.props,
        }));

      if (cards.length < 2) {
        alert("需要至少2张卡片才能分析关联");
        return;
      }

      // 调用关联分析API
      const response = await fetch("/api/ai/relate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards, threshold: 0.65 }),
      });

      const data = await response.json();

      setConnections(data.connections || []);
      setClusters(data.clusters || []);
      setShowPanel(true);

      // 在画布上绘制连接线
      drawConnections(data.connections || []);
    } catch (error) {
      console.error("Error analyzing relationships:", error);
      alert("分析关联时出错");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const drawConnections = (conns: any[]) => {
    if (!editor) return;

    // 为前5个最强的连接绘制箭头
    conns.slice(0, 5).forEach((conn) => {
      try {
        const fromShape = editor.getShape(conn.from);
        const toShape = editor.getShape(conn.to);

        if (fromShape && toShape) {
          // 创建箭头
          const arrowId = createShapeId();
          editor.createShapes([
            {
              id: arrowId,
              type: "arrow",
              x: 0,
              y: 0,
              props: {
                start: {
                  type: "binding",
                  boundShapeId: conn.from,
                  normalizedAnchor: { x: 0.5, y: 0.5 },
                },
                end: {
                  type: "binding",
                  boundShapeId: conn.to,
                  normalizedAnchor: { x: 0.5, y: 0.5 },
                },
                color: conn.similarity > 0.8 ? "red" : "blue",
              },
            },
          ]);
        }
      } catch (e) {
        console.error("Error drawing connection:", e);
      }
    });
  };

  if (!showPanel) {
    return (
      <button
        onClick={analyzeRelationships}
        disabled={isAnalyzing || !editor}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 flex items-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>分析中...</span>
          </>
        ) : (
          <>
            <span>🧠</span>
            <span>智能关联</span>
          </>
        )}
      </button>
    );
  }

  return (
    <>
      {/* 分析按钮 */}
      <button
        onClick={analyzeRelationships}
        disabled={isAnalyzing}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>分析中...</span>
          </>
        ) : (
          <>
            <span>🔄</span>
            <span>重新分析</span>
          </>
        )}
      </button>

      {/* 关联分析面板 - 更现代的设计 */}
      <div className="mt-16 w-80 max-h-[600px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            智能关联分析
          </h3>
          <button
            onClick={() => setShowPanel(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[540px]">
          {/* 连接统计 - 更醒目 */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                {connections.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  语义关联
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  已发现 {connections.length} 个关联
                </p>
              </div>
            </div>
          </div>

          {/* 主题聚类 - 更精美 */}
          {clusters.length > 0 && (
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span>🧩</span>
                <span>主题聚类</span>
              </h4>
              {clusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="mb-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    {cluster.suggestedTheme}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-md text-gray-700 dark:text-gray-300">
                      {cluster.cardIds.length} 张卡片
                    </span>
                    <span className="text-xs bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-md text-gray-700 dark:text-gray-300">
                      {(cluster.avgSimilarity * 100).toFixed(0)}% 相似度
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 连接列表 - 更精致 */}
          <div className="p-4">
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span>🔗</span>
              <span>强关联连接</span>
            </h4>
            {connections.slice(0, 10).map((conn, idx) => (
              <div
                key={idx}
                className="mb-2 p-3 bg-gray-50/80 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    关联 #{idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
                      conn.similarity > 0.8
                        ? "bg-green-500 text-white"
                        : conn.similarity > 0.7
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {(conn.similarity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
