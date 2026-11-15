import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Play, Image as ImageIcon, Music, Type, Link2, Eye, Save, MoreVertical } from "lucide-react";
import { useState, useRef } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface StoryNode {
  id: string;
  type: "chapter" | "branch" | "converge";
  title: string;
  position: { x: number; y: number };
  content?: {
    text?: string;
    audio?: string;
    image?: string;
    video?: string;
  };
  connections: string[]; // IDs of connected nodes
}

interface StoryBuilderScreenProps {
  onClose: () => void;
  storyId: string;
  initialNodes?: StoryNode[];
  onSave: (nodes: StoryNode[]) => void;
}

export function StoryBuilderScreen({
  onClose,
  storyId,
  initialNodes = [],
  onSave
}: StoryBuilderScreenProps) {
  const { state } = useStoryState();
  const [nodes, setNodes] = useState<StoryNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"builder" | "preview">("builder");
  const canvasRef = useRef<HTMLDivElement>(null);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Story Builder",
        fr: "Constructeur d'Histoire",
        es: "Constructor de Historia"
      },
      addNode: {
        en: "Add Node",
        fr: "Ajouter un Nœud",
        es: "Agregar Nodo"
      },
      chapter: {
        en: "Chapter",
        fr: "Chapitre",
        es: "Capítulo"
      },
      branch: {
        en: "Branch",
        fr: "Branche",
        es: "Rama"
      },
      preview: {
        en: "Preview",
        fr: "Aperçu",
        es: "Vista Previa"
      },
      save: {
        en: "Save Story",
        fr: "Enregistrer l'Histoire",
        es: "Guardar Historia"
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const addNode = (type: "chapter" | "branch") => {
    const newNode: StoryNode = {
      id: `node-${Date.now()}`,
      type,
      title: `${getText(type)} ${nodes.length + 1}`,
      position: { x: 100, y: 100 + nodes.length * 150 },
      connections: [],
      content: {}
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setShowAddMenu(false);
  };

  const connectNodes = (fromId: string, toId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === fromId && !node.connections.includes(toId)) {
        return { ...node, connections: [...node.connections, toId] };
      }
      return node;
    }));
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, position: { x, y } } : node
    ));
  };

  const handleSave = () => {
    onSave(nodes);
    // Show success feedback
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

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

          <h2 className="text-base tracking-tight text-white">
            {getText("title")}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "builder" ? "preview" : "builder")}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Eye className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">{getText("preview")}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 rounded-lg bg-white text-black flex items-center gap-2 hover:bg-white/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="text-xs font-medium">{getText("save")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 pt-[72px] pb-[80px] overflow-auto">
        <div 
          ref={canvasRef}
          className="relative min-h-full min-w-full"
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        >
          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {nodes.map(node => 
              node.connections.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                
                const startX = node.position.x + 150;
                const startY = node.position.y + 60;
                const endX = targetNode.position.x;
                const endY = targetNode.position.y + 60;
                
                const isBranch = node.type === "branch" || targetNode.type === "branch";
                
                return (
                  <motion.path
                    key={`${node.id}-${targetId}`}
                    d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                    stroke={isBranch ? "rgba(168, 85, 247, 0.3)" : "rgba(255, 255, 255, 0.2)"}
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              drag
              dragMomentum={false}
              onDragStart={() => setIsDragging(node.id)}
              onDragEnd={(e, info) => {
                setIsDragging(null);
                updateNodePosition(node.id, node.position.x + info.offset.x, node.position.y + info.offset.y);
              }}
              className={`
                absolute w-[300px] p-4 rounded-xl cursor-move transition-all
                ${node.type === "branch" 
                  ? 'bg-purple-500/10 border-2 border-purple-400/30' 
                  : 'bg-white/5 border-2 border-white/10'
                }
                ${selectedNode === node.id ? 'ring-2 ring-white/30' : ''}
                hover:border-white/30
              `}
              style={{ 
                left: node.position.x, 
                top: node.position.y,
                zIndex: selectedNode === node.id ? 10 : 1
              }}
              onClick={() => setSelectedNode(node.id)}
            >
              {/* Node header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className={`
                    text-xs tracking-wider uppercase mb-1 block
                    ${node.type === "branch" ? 'text-purple-300' : 'text-white/40'}
                  `}>
                    {node.type}
                  </span>
                  <input
                    type="text"
                    value={node.title}
                    onChange={(e) => {
                      setNodes(nodes.map(n => 
                        n.id === node.id ? { ...n, title: e.target.value } : n
                      ));
                    }}
                    className="w-full bg-transparent text-sm text-white border-none outline-none focus:text-white/90"
                    placeholder="Node title..."
                  />
                </div>
                <button
                  className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <MoreVertical className="w-3 h-3 text-white/50" />
                </button>
              </div>

              {/* Content indicators */}
              <div className="flex gap-2 mb-3">
                {node.content?.text && (
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                    <Type className="w-3 h-3 text-white/60" />
                  </div>
                )}
                {node.content?.audio && (
                  <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                    <Music className="w-3 h-3 text-purple-300" />
                  </div>
                )}
                {node.content?.image && (
                  <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                    <ImageIcon className="w-3 h-3 text-blue-300" />
                  </div>
                )}
              </div>

              {/* Connection indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-white/30">
                  {node.connections.length} {state.language === 'en' ? 'connections' : state.language === 'fr' ? 'connexions' : 'conexiones'}
                </span>
                <button
                  className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1"
                >
                  <Link2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center max-w-[300px]">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg text-white mb-2">
                  {state.language === 'en' ? 'Start Building' : state.language === 'fr' ? 'Commencer à Construire' : 'Empezar a Construir'}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {state.language === 'en' 
                    ? 'Add your first node to begin crafting your interactive story.'
                    : state.language === 'fr'
                    ? 'Ajoutez votre premier nœud pour commencer à créer votre histoire interactive.'
                    : 'Agrega tu primer nodo para comenzar a crear tu historia interactiva.'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/80 border-t border-white/5">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">
              {nodes.length} {state.language === 'en' ? 'nodes' : state.language === 'fr' ? 'nœuds' : 'nodos'}
            </span>
          </div>

          {/* Add node button */}
          <button
            onClick={() => setShowAddMenu(true)}
            className="px-4 py-3 rounded-full bg-white text-black flex items-center gap-2 hover:bg-white/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">{getText("addNode")}</span>
          </button>
        </div>
      </div>

      {/* Add node menu */}
      <AnimatePresence>
        {showAddMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-40 bg-black border-t border-white/10 rounded-t-3xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-center pt-2 pb-4">
                  <div className="w-12 h-1 rounded-full bg-white/20" />
                </div>

                <h3 className="text-lg tracking-tight text-white mb-4">
                  {state.language === 'en' ? 'Add Node Type' : state.language === 'fr' ? 'Ajouter un Type de Nœud' : 'Agregar Tipo de Nodo'}
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => addNode("chapter")}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                  >
                    <h4 className="text-base text-white mb-1">{getText("chapter")}</h4>
                    <p className="text-sm text-white/50">
                      {state.language === 'en' 
                        ? 'Linear story progression'
                        : state.language === 'fr'
                        ? 'Progression linéaire de l\'histoire'
                        : 'Progresión lineal de la historia'
                      }
                    </p>
                  </button>

                  <button
                    onClick={() => addNode("branch")}
                    className="w-full p-4 rounded-xl bg-purple-500/10 border border-purple-400/30 hover:bg-purple-500/20 transition-all text-left"
                  >
                    <h4 className="text-base text-white mb-1">{getText("branch")}</h4>
                    <p className="text-sm text-purple-200/60">
                      {state.language === 'en' 
                        ? 'Optional perspective shift'
                        : state.language === 'fr'
                        ? 'Changement de perspective optionnel'
                        : 'Cambio de perspectiva opcional'
                      }
                    </p>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Node editor sidebar (when node selected) */}
      <AnimatePresence>
        {selectedNode && selectedNodeData && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-[72px] bottom-0 w-[320px] bg-black border-l border-white/10 z-30 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base tracking-tight text-white">Edit Node</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Media options */}
              <div className="space-y-3">
                <label className="text-xs tracking-wider uppercase text-white/40 block">
                  {state.language === 'en' ? 'Add Media' : state.language === 'fr' ? 'Ajouter des Médias' : 'Agregar Medios'}
                </label>
                
                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-3">
                  <Type className="w-5 h-5 text-white/50" />
                  <span className="text-sm text-white/70">Text</span>
                </button>

                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-3">
                  <Music className="w-5 h-5 text-white/50" />
                  <span className="text-sm text-white/70">Audio</span>
                </button>

                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-white/50" />
                  <span className="text-sm text-white/70">Image</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
