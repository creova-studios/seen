import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Eye, Play, GitBranch, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface StoryNode {
  id: string;
  type: "chapter" | "branch" | "converge";
  title: string;
  position: { x: number; y: number };
  connections: string[];
  isAlternatePath?: boolean;
}

interface StoryBranchMapScreenProps {
  onClose: () => void;
  nodes: StoryNode[];
  onNodeClick: (nodeId: string) => void;
  onPreviewPath: (nodeId: string) => void;
  selectedNodeId?: string;
}

export function StoryBranchMapScreen({
  onClose,
  nodes,
  onNodeClick,
  onPreviewPath,
  selectedNodeId
}: StoryBranchMapScreenProps) {
  const { state } = useStoryState();
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Story Map",
        fr: "Carte de l'Histoire",
        es: "Mapa de la Historia"
      },
      chapters: {
        en: "Chapters",
        fr: "Chapitres",
        es: "Capítulos"
      },
      branches: {
        en: "Branches",
        fr: "Branches",
        es: "Ramas"
      },
      preview: {
        en: "Preview",
        fr: "Aperçu",
        es: "Vista Previa"
      },
      linearPath: {
        en: "Linear Path",
        fr: "Chemin Linéaire",
        es: "Camino Lineal"
      },
      alternatePath: {
        en: "Alternate Path",
        fr: "Chemin Alternatif",
        es: "Camino Alternativo"
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  // Auto-layout nodes in a flowing pattern
  useEffect(() => {
    if (nodes.length === 0) return;

    // Simple vertical layout with branching
    let currentY = 100;
    const layoutNodes = [...nodes];
    
    layoutNodes.forEach((node, index) => {
      if (node.isAlternatePath) {
        node.position = { x: 400, y: currentY };
      } else {
        node.position = { x: 100, y: currentY };
        currentY += 180;
      }
    });
  }, [nodes]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const chapterCount = nodes.filter(n => n.type === "chapter").length;
  const branchCount = nodes.filter(n => n.type === "branch").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/80 border-b border-white/5">
        <div className="flex items-center justify-between p-5 pt-8">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <h2 className="text-base tracking-tight text-white mb-1">
              {getText("title")}
            </h2>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>{chapterCount} {getText("chapters")}</span>
              <span>•</span>
              <span>{branchCount} {getText("branches")}</span>
            </div>
          </div>

          <button
            onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Toggle view"
          >
            <Maximize2 className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-24 left-6 z-20 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20" />
            <span className="text-xs text-white/60">{getText("linearPath")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40" />
            <span className="text-xs text-purple-200/70">{getText("alternatePath")}</span>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-24 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={() => setScale(prev => Math.min(2, prev + 0.2))}
          className="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors text-white text-lg"
        >
          +
        </button>
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
          className="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors text-white text-lg"
        >
          −
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Map canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 pt-[120px] cursor-grab active:cursor-grabbing overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: `${30 * scale}px ${30 * scale}px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
          className="relative"
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '2000px', height: '4000px' }}>
            {nodes.map(node =>
              node.connections.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;

                const startX = node.position.x + 140;
                const startY = node.position.y + 40;
                const endX = targetNode.position.x + 140;
                const endY = targetNode.position.y + 40;

                const isAlternatePath = node.isAlternatePath || targetNode.isAlternatePath;

                return (
                  <g key={`${node.id}-${targetId}`}>
                    <motion.path
                      d={`M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`}
                      stroke={isAlternatePath ? "rgba(168, 85, 247, 0.4)" : "rgba(255, 255, 255, 0.2)"}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={isAlternatePath ? "5,5" : "0"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Arrow */}
                    <circle
                      cx={endX}
                      cy={endY - 20}
                      r="3"
                      fill={isAlternatePath ? "rgba(168, 85, 247, 0.6)" : "rgba(255, 255, 255, 0.3)"}
                    />
                  </g>
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isAlternate = node.isAlternatePath;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  absolute w-[280px] p-4 rounded-xl transition-all cursor-pointer
                  ${isAlternate
                    ? 'bg-purple-500/10 border-2 border-purple-400/30'
                    : 'bg-white/5 border-2 border-white/10'
                  }
                  ${isSelected ? 'ring-2 ring-white/40 scale-105' : 'hover:border-white/30'}
                `}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  zIndex: isSelected ? 10 : 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeClick(node.id);
                }}
              >
                {/* Node header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {node.type === "branch" && (
                        <GitBranch className="w-3 h-3 text-purple-300" />
                      )}
                      <span className={`
                        text-xs tracking-wider uppercase
                        ${isAlternate ? 'text-purple-300' : 'text-white/40'}
                      `}>
                        {node.type}
                      </span>
                    </div>
                    <h3 className="text-sm text-white line-clamp-2 leading-snug">
                      {node.title}
                    </h3>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(node.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs text-white/70 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    {state.language === 'en' ? 'Edit' : state.language === 'fr' ? 'Modifier' : 'Editar'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewPath(node.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-xs text-white flex items-center justify-center gap-2"
                  >
                    <Play className="w-3 h-3" />
                    {getText("preview")}
                  </button>
                </div>

                {/* Connection count */}
                {node.connections.length > 0 && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center">
                    <span className="text-xs text-blue-200">
                      {node.connections.length}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-[300px]">
                <GitBranch className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white mb-2">
                  {state.language === 'en' ? 'No Nodes Yet' : state.language === 'fr' ? 'Aucun Nœud Encore' : 'Aún No Hay Nodos'}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {state.language === 'en' 
                    ? 'Start building your story in the Story Builder.'
                    : state.language === 'fr'
                    ? 'Commencez à créer votre histoire dans le Constructeur d\'Histoire.'
                    : 'Comienza a crear tu historia en el Constructor de Historia.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10">
        <p className="text-xs text-white/50">
          {state.language === 'en' 
            ? 'Scroll to zoom • Drag to pan • Click node to edit'
            : state.language === 'fr'
            ? 'Défiler pour zoomer • Glisser pour déplacer • Cliquer sur le nœud pour modifier'
            : 'Desplazar para acercar • Arrastrar para mover • Clic en nodo para editar'
          }
        </p>
      </div>
    </motion.div>
  );
}
