'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { CanvasNode, ConceptType } from '@/lib/types';
import {
  RotateCcw,
  CheckCircle,
  Layers,
  Trash2,
  Move,
  Link as LinkIcon,
  Plus,
  FileCode2,
  Check,
  X,
  Sparkles,
  Scissors,
  MousePointer,
  HelpCircle,
  GitBranch,
  Link2,
} from 'lucide-react';

export const SystemCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    updateNodePosition,
    changeNodeType,
    removeNode,
    removeEdge,
    disconnectNode,
    addNodeToCanvas,
    connectNodes,
    checkSolution,
    resetMissionCanvas,
    autoLayoutCanvas,
    language,
  } = useAppStore();

  const t = translations[language] || translations.en;

  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [dragLineEnd, setDragLineEnd] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTargetNodeId, setHoveredTargetNodeId] = useState<string | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [generatedSql, setGeneratedSql] = useState('');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);

  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<{ time: number; nodeId: string }>({ time: 0, nodeId: '' });

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setConnectingFromId(null);
        setDragLineEnd(null);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          removeNode(selectedNodeId);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, removeNode]);

  // Handle dropping from Concept Toolbox
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/dataquest-concept') as ConceptType;
    const label = e.dataTransfer.getData('application/dataquest-label');
    if (!type) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(20, Math.min(rect.width - 160, e.clientX - rect.left - 60));
    const y = Math.max(20, Math.min(rect.height - 80, e.clientY - rect.top - 30));

    addNodeToCanvas(type, label || undefined, Math.round(x), Math.round(y));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Node mouse dragging within canvas
  const handleNodeMouseDown = (e: React.MouseEvent, node: CanvasNode) => {
    // Left click only
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    dragOffsetRef.current = {
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    };
  };

  // Canvas Mouse Move (handles dragging cards + live wire rubberband preview)
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    // Moving a card
    if (draggingNodeId) {
      const newX = Math.max(10, Math.min(rect.width - 150, e.clientX - dragOffsetRef.current.x));
      const newY = Math.max(10, Math.min(rect.height - 100, e.clientY - dragOffsetRef.current.y));
      updateNodePosition(draggingNodeId, Math.round(newX), Math.round(newY));
    }

    // Drag-drawing a connection line to mouse position
    if (connectingFromId) {
      setDragLineEnd({ x: curX, y: curY });

      // Detect if hovering over a potential target node
      const hit = nodes.find(
        (n) =>
          n.id !== connectingFromId &&
          curX >= n.x &&
          curX <= n.x + 140 &&
          curY >= n.y &&
          curY <= n.y + 70
      );
      setHoveredTargetNodeId(hit ? hit.id : null);
    }
  };

  const handleCanvasMouseUp = () => {
    // If we were drag-drawing a line and released over a target node
    if (connectingFromId && hoveredTargetNodeId) {
      connectNodes(connectingFromId, hoveredTargetNodeId);
    }
    setDraggingNodeId(null);
    setConnectingFromId(null);
    setDragLineEnd(null);
    setHoveredTargetNodeId(null);
  };

  // Connection port interactions: Click or Drag to draw
  const handlePortMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setConnectingFromId(nodeId);
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragLineEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  // Double click / Double tap to delete
  const handleNodeDoubleClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    removeNode(nodeId);
  };

  const handleNodeTouchEnd = (e: React.TouchEvent, nodeId: string) => {
    const now = Date.now();
    if (now - lastTapRef.current.time < 300 && lastTapRef.current.nodeId === nodeId) {
      // Double tap detected
      removeNode(nodeId);
    }
    lastTapRef.current = { time: now, nodeId };
  };

  // Right-click context menu
  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      nodeId,
    });
  };

  // Generate DDL SQL from current canvas
  const handleExportSql = () => {
    const entityNodes = nodes.filter((n) => n.type === 'entity');
    let sqlOutput = `-- DataQuest Generated Schema DDL\n-- Generated on: ${new Date().toISOString()}\n\n`;

    entityNodes.forEach((entity) => {
      sqlOutput += `CREATE TABLE ${entity.label} (\n`;
      const attributes = nodes.filter(
        (n) => n.type !== 'entity' && n.type !== 'relationship' && Math.abs(n.x - entity.x) < 180 && n.y > entity.y
      );

      const cols = attributes.map((attr) => {
        if (attr.type === 'primaryKey') return `  ${attr.label} INT PRIMARY KEY`;
        if (attr.type === 'foreignKey') return `  ${attr.label} INT REFERENCES ParentTable(${attr.label})`;
        return `  ${attr.label.toLowerCase().replace(/\s+/g, '_')} VARCHAR(255)`;
      });

      if (cols.length === 0) {
        cols.push(`  id INT PRIMARY KEY AUTO_INCREMENT`, `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      }

      sqlOutput += cols.join(',\n') + '\n);\n\n';
    });

    setGeneratedSql(sqlOutput);
    setShowExportModal(true);
  };

  const contextNode = nodes.find((n) => n.id === contextMenu?.nodeId);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Canvas Top Bar */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {t.canvasTitle}
              {connectingFromId && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 animate-pulse">
                  <Link2 className="w-3 h-3" />
                  Release on target node to link
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.canvasSubtitle}
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetMissionCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            {t.reset}
          </button>

          <button
            onClick={autoLayoutCanvas}
            title="Auto-arrange canvas cards in a clean grid"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all"
          >
            <Move className="w-3.5 h-3.5 text-indigo-500" />
            {t.autoLayout}
          </button>

          <button
            onClick={handleExportSql}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all"
          >
            <FileCode2 className="w-3.5 h-3.5 text-purple-500" />
            {t.exportDdl}
          </button>

          <button
            onClick={checkSolution}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black shadow-md shadow-pink-500/20 active:scale-95 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            {t.checkSolution}
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace with Lucid Dot Grid */}
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        className="relative w-full h-[380px] sm:h-[420px] overflow-hidden lucid-grid bg-[#fcfbfa] dark:bg-[#0c1322] select-none"
      >
        {/* SVG Connectors & Active Wire Drawing */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="dragWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ec4899" />
            </marker>
          </defs>

          {/* Existing Connected Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.fromId);
            const toNode = nodes.find((n) => n.id === edge.toId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 130;
            const y1 = fromNode.y + 25;
            const x2 = toNode.x + 10;
            const y2 = toNode.y + 25;

            // Curved bezier path
            const dx = Math.abs(x2 - x1) * 0.5;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={edge.id} className="group pointer-events-auto">
                {/* Invisible wider hit area for easy click-to-delete */}
                <path
                  d={pathData}
                  stroke="transparent"
                  strokeWidth="16"
                  fill="none"
                  className="cursor-pointer"
                  onClick={() => removeEdge(edge.id)}
                />
                {/* Background glow line */}
                <path d={pathData} stroke="rgba(236, 72, 153, 0.2)" strokeWidth="6" fill="none" />
                {/* Dashed animated flow line */}
                <path
                  d={pathData}
                  stroke="url(#flowGrad)"
                  strokeWidth="2.5"
                  fill="none"
                  markerEnd="url(#arrow)"
                  className="animated-flow-line"
                />
                {/* Pulsing data packet particle */}
                <circle r="3.5" fill="#10b981">
                  <animateMotion path={pathData} dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Interactive Delete Handle on Wire Midpoint (Visible on Wire Hover) */}
                <g
                  transform={`translate(${midX - 8}, ${midY - 8})`}
                  onClick={() => removeEdge(edge.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <circle cx="8" cy="8" r="8" fill="#ef4444" className="shadow-xs hover:scale-125 transition-transform" />
                  <path d="M 5 5 L 11 11 M 11 5 L 5 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </g>
            );
          })}

          {/* Active Live Drag Wire Preview */}
          {connectingFromId && dragLineEnd && (
            (() => {
              const srcNode = nodes.find((n) => n.id === connectingFromId);
              if (!srcNode) return null;
              const x1 = srcNode.x + 130;
              const y1 = srcNode.y + 25;
              const x2 = dragLineEnd.x;
              const y2 = dragLineEnd.y;
              const dx = Math.abs(x2 - x1) * 0.5;
              const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g>
                  <path d={pathData} stroke="rgba(99, 102, 241, 0.3)" strokeWidth="8" fill="none" />
                  <path
                    d={pathData}
                    stroke="url(#dragWireGrad)"
                    strokeWidth="3"
                    strokeDasharray="4,4"
                    fill="none"
                    className="animated-flow-line"
                  />
                  <circle cx={x2} cy={y2} r="5" fill="#ec4899" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Canvas Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isConnectSource = connectingFromId === node.id;
          const isConnectTarget = hoveredTargetNodeId === node.id;

          // Theme styling based on concept type
          let nodeBg = 'bg-white/95 dark:bg-[#131622]/95 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100';
          let badgeBg = 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.08]';
          let iconDot = 'bg-zinc-400';

          if (node.type === 'entity') {
            nodeBg = 'bg-white/95 dark:bg-[#151324]/95 backdrop-blur-xl border-violet-500/30 dark:border-violet-400/30 text-zinc-900 dark:text-zinc-100';
            badgeBg = 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20';
            iconDot = 'bg-violet-500';
          } else if (node.type === 'relationship') {
            nodeBg = 'bg-white/95 dark:bg-[#131524]/95 backdrop-blur-xl border-indigo-500/30 dark:border-indigo-400/30 text-zinc-900 dark:text-zinc-100';
            badgeBg = 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20';
            iconDot = 'bg-indigo-500';
          } else if (node.type === 'primaryKey') {
            nodeBg = 'bg-white/95 dark:bg-[#1d1810]/95 backdrop-blur-xl border-amber-500/30 dark:border-amber-400/30 text-zinc-900 dark:text-zinc-100';
            badgeBg = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20';
            iconDot = 'bg-amber-500';
          } else if (node.type === 'foreignKey') {
            nodeBg = 'bg-white/95 dark:bg-[#1d1610]/95 backdrop-blur-xl border-orange-500/30 dark:border-orange-400/30 text-zinc-900 dark:text-zinc-100';
            badgeBg = 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20';
            iconDot = 'bg-orange-500';
          } else if (node.type === 'attribute') {
            nodeBg = 'bg-white/95 dark:bg-[#101724]/95 backdrop-blur-xl border-blue-500/30 dark:border-blue-400/30 text-zinc-900 dark:text-zinc-100';
            badgeBg = 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20';
            iconDot = 'bg-blue-500';
          }

          // Validation Halo Overrides
          if (node.status === 'correct') {
            nodeBg += ' halo-correct border-emerald-500/60 ring-1 ring-emerald-500/30';
          } else if (node.status === 'wrong') {
            nodeBg += ' halo-wrong border-rose-500/60 ring-1 ring-rose-500/30';
          }

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
                width: '140px',
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
              onTouchEnd={(e) => handleNodeTouchEnd(e, node.id)}
              onContextMenu={(e) => handleContextMenu(e, node.id)}
              title="Drag to move • Double-click or Right-click to Delete • Drag link icon to connect"
              className={`group absolute top-0 left-0 z-20 rounded-xl p-2.5 shadow-md border cursor-grab active:cursor-grabbing transition-transform select-none ${nodeBg} ${
                isSelected ? 'ring-2 ring-pink-500 ring-offset-2' : ''
              } ${isConnectSource ? 'ring-2 ring-indigo-500 animate-pulse' : ''} ${
                isConnectTarget ? 'ring-4 ring-emerald-500 scale-105 shadow-xl' : ''
              }`}
            >
              {/* Manual Delete Button (Always accessible on hover or click) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
                title="Delete this card (or double-click / right-click)"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40 hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Positive Feedback Bubble */}
              {node.status === 'correct' && node.feedback && (
                <div
                  className="absolute -top-11 -left-4 z-30 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-bounce"
                  style={{ animationDuration: '2.5s' }}
                >
                  <Check className="w-3 h-3 text-white" />
                  <span>{node.feedback}</span>
                  <div className="absolute -bottom-1 left-8 w-2 h-2 bg-emerald-600 rotate-45" />
                </div>
              )}

              {/* Negative Feedback / Recommendation Bubble */}
              {node.status === 'wrong' && node.recommendation && (
                <div className="absolute -bottom-14 -left-6 z-30 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex flex-col gap-1 w-48 leading-tight">
                  <div className="flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{node.recommendation}</span>
                  </div>
                  {node.label === 'Date of Birth' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeNodeType(node.id, 'attribute');
                      }}
                      className="mt-0.5 px-2 py-0.5 bg-white text-red-700 text-[9px] font-extrabold rounded-md shadow-xs hover:bg-red-50 text-center"
                    >
                      Fix Now (+15 XP)
                    </button>
                  )}
                  <div className="absolute -top-1 left-12 w-2 h-2 bg-red-600 rotate-45" />
                </div>
              )}

              {/* Node Header */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1 truncate">
                  <span className={`w-2 h-2 rounded-full ${iconDot} shrink-0`} />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                    {node.label}
                  </span>
                </div>

                {/* Status indicator icon */}
                {node.status === 'correct' ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : node.status === 'wrong' ? (
                  <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-xs shrink-0">
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : null}
              </div>

              {/* Concept Type Pill & Quick Change dropdown */}
              <div className="flex items-center justify-between mt-1">
                <select
                  value={node.type}
                  onChange={(e) => changeNodeType(node.id, e.target.value as ConceptType)}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border-0 cursor-pointer outline-hidden uppercase tracking-wider ${badgeBg}`}
                >
                  <option value="entity">Entity</option>
                  <option value="attribute">Attribute</option>
                  <option value="relationship">Relationship</option>
                  <option value="primaryKey">Primary Key</option>
                  <option value="foreignKey">Foreign Key</option>
                  <option value="sql">SQL</option>
                  <option value="nosql">NoSQL</option>
                  <option value="graphs">Graphs</option>
                  <option value="dashboard">Dashboard</option>
                </select>

                {/* Drag-to-Draw Connection Port Pin */}
                <button
                  onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                  title="Drag this link pin onto another card to draw a graph connection!"
                  className={`w-4 h-4 rounded-full border border-pink-400 flex items-center justify-center text-[9px] transition-transform hover:scale-125 cursor-crosshair ${
                    isConnectSource ? 'bg-indigo-600 text-white' : 'bg-white text-pink-600 shadow-2xs'
                  }`}
                >
                  <LinkIcon className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom Context Menu on Right Click */}
        {contextMenu && contextNode && (
          <div
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 w-44 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="px-2 py-1 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 font-bold mb-1">
              {contextNode.label}
            </div>

            <button
              onClick={() => {
                removeNode(contextNode.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Card
            </button>

            <button
              onClick={() => {
                disconnectNode(contextNode.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-500" />
              Disconnect Wires
            </button>

            <button
              onClick={() => {
                setConnectingFromId(contextNode.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
              Draw Connection
            </button>
          </div>
        )}

        {/* Empty Canvas Guidance Watermark */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
            <Plus className="w-10 h-10 mb-2 opacity-30 animate-pulse" />
            <p className="text-xs font-bold">Canvas is empty</p>
            <p className="text-[11px] opacity-70">
              Drag concept cards from the toolbox above into this space, or click Reset in the toolbar
            </p>
          </div>
        )}
      </div>

      {/* SQL DDL Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-pink-500" />
                Exported Relational Schema (DDL)
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-pink-300 font-mono text-xs rounded-xl overflow-x-auto max-h-60">
              {generatedSql}
            </pre>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedSql);
                  alert('Copied SQL to clipboard!');
                }}
                className="px-4 py-2 bg-pink-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-pink-600"
              >
                Copy SQL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
