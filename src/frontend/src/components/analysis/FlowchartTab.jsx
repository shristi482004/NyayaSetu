import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

/**
 * Custom Node component styled for NyayaSetu legal procedural stages
 */
const LegalStageNode = ({ data }) => {
  return (
    <div className="w-80 p-5 rounded-xl bg-white border-2 border-midnight-900 text-midnight-900 shadow-panel text-left space-y-2.5">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-midnight-900" />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-midnight-900 text-white text-[10px] font-mono font-bold tracking-wider">
          STEP {data.stepNumber}
        </span>
        {data.deadlineOrTimeframe && (
          <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-600 border border-gold-500/30 text-[10px] font-semibold">
            {data.deadlineOrTimeframe}
          </span>
        )}
      </div>

      {/* Stage Name */}
      <h4 className="text-base font-serif font-bold text-midnight-900">
        {data.stageName}
      </h4>

      {/* Description */}
      <p className="text-xs font-sans text-slate-700 leading-relaxed">
        {data.description}
      </p>

      {/* Action Required */}
      {data.actionRequired && (
        <div className="pt-2 border-t border-slate-200">
          <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600 mb-0.5">
            Action Required:
          </span>
          <span className="text-xs font-sans font-semibold text-midnight-900">
            {data.actionRequired}
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-midnight-900" />
    </div>
  );
};

const nodeTypes = {
  legalStage: LegalStageNode,
};

export const FlowchartTab = ({ flowchart }) => {
  if (!flowchart || flowchart.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle">
        <p className="text-sm font-sans text-slate-600">No procedural flowchart data available for this document.</p>
      </div>
    );
  }

  // Generate nodes and edges from sequential steps
  const { nodes, edges } = useMemo(() => {
    const generatedNodes = [];
    const generatedEdges = [];

    flowchart.forEach((step, idx) => {
      const nodeId = `step-${step.stepNumber || idx + 1}`;
      generatedNodes.push({
        id: nodeId,
        type: 'legalStage',
        position: { x: 250, y: idx * 240 + 40 },
        data: step,
      });

      if (idx > 0) {
        const prevId = `step-${flowchart[idx - 1].stepNumber || idx}`;
        generatedEdges.push({
          id: `edge-${prevId}-${nodeId}`,
          source: prevId,
          target: nodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#071426', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#071426',
            width: 16,
            height: 16,
          },
        });
      }
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [flowchart]);

  return (
    <div className="space-y-6">
      {/* Interactive Graph Container */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-midnight-900">
              Procedural Legal Flowchart
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Interactive directed sequence of legal phases, notice windows, and court milestones.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Scroll to zoom • Drag canvas to pan
          </span>
        </div>

        {/* React Flow Viewport */}
        <div className="w-full h-[600px] rounded-xl border border-slate-300 bg-pale-100 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            attributionPosition="bottom-left"
          >
            <Background color="#071426" gap={24} size={1} opacity={0.06} />
            <Controls className="bg-white border border-slate-300 shadow-subtle text-midnight-900 rounded-lg overflow-hidden" />
          </ReactFlow>
        </div>
      </div>

      {/* Linear Step-by-Step Card Breakdown */}
      <div className="space-y-4 pt-4">
        <h4 className="text-base font-serif font-bold text-midnight-900">
          Sequential Stage Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flowchart.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-slate-300 shadow-subtle space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-midnight-900">
                  Step {step.stepNumber}
                </span>
                {step.deadlineOrTimeframe && (
                  <span className="text-[11px] font-semibold text-gold-600">
                    {step.deadlineOrTimeframe}
                  </span>
                )}
              </div>
              <h5 className="text-sm font-serif font-bold text-midnight-900">{step.stageName}</h5>
              <p className="text-xs font-sans text-slate-700 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
