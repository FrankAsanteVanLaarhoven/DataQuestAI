import { ERDEntity, ERDRelationship, ERDWaypoint, RoutingStyle } from './types';

export interface Point {
  x: number;
  y: number;
}

/**
 * Generate smooth Orthogonal (Manhattan / 90° right angles with optional rounded corners)
 */
export function generateOrthogonalPath(
  start: Point,
  end: Point,
  waypoints: ERDWaypoint[] = [],
  fillet: number = 8
): { d: string; midPoint: Point } {
  // Construct raw vertex list: start -> waypoints -> end
  const points: Point[] = [start, ...waypoints, end];
  const segments: Point[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (i === 0) segments.push(p1);

    // If this segment has horizontal and vertical offset, insert an intermediate elbow
    if (Math.abs(p1.x - p2.x) > 2 && Math.abs(p1.y - p2.y) > 2) {
      // Step horizontally halfway, then vertically
      const midX = (p1.x + p2.x) / 2;
      segments.push({ x: midX, y: p1.y });
      segments.push({ x: midX, y: p2.y });
    }
    segments.push(p2);
  }

  // Build SVG path string with rounded fillet corners
  if (segments.length <= 2) {
    const d = `M ${segments[0].x} ${segments[0].y} L ${segments[1].x} ${segments[1].y}`;
    return {
      d,
      midPoint: {
        x: (segments[0].x + segments[1].x) / 2,
        y: (segments[0].y + segments[1].y) / 2,
      },
    };
  }

  let d = `M ${segments[0].x} ${segments[0].y}`;
  for (let i = 1; i < segments.length - 1; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    const next = segments[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const len1 = Math.hypot(dx1, dy1);

    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.hypot(dx2, dy2);

    const r = Math.min(fillet, len1 / 2, len2 / 2);

    if (r > 1) {
      const startFilletX = curr.x - (dx1 / len1) * r;
      const startFilletY = curr.y - (dy1 / len1) * r;
      const endFilletX = curr.x + (dx2 / len2) * r;
      const endFilletY = curr.y + (dy2 / len2) * r;

      d += ` L ${startFilletX} ${startFilletY} Q ${curr.x} ${curr.y} ${endFilletX} ${endFilletY}`;
    } else {
      d += ` L ${curr.x} ${curr.y}`;
    }
  }

  const last = segments[segments.length - 1];
  d += ` L ${last.x} ${last.y}`;

  // Find midpoint along segments
  const midIndex = Math.floor(segments.length / 2);
  const midPoint = segments[midIndex] || {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  return { d, midPoint };
}

/**
 * Generate smooth Bezier curve through waypoints
 */
export function generateCurvedPath(
  start: Point,
  end: Point,
  waypoints: ERDWaypoint[] = []
): { d: string; midPoint: Point } {
  if (waypoints.length === 0) {
    const deltaX = Math.abs(end.x - start.x);
    const curveOffset = Math.max(50, deltaX * 0.45);
    const isTargetRight = end.x >= start.x;

    const cp1x = isTargetRight ? start.x + curveOffset : start.x - curveOffset;
    const cp1y = start.y;
    const cp2x = isTargetRight ? end.x - curveOffset : end.x + curveOffset;
    const cp2y = end.y;

    const d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
    return {
      d,
      midPoint: {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      },
    };
  }

  // With waypoints, construct chained quadratic/cubic curves
  const allPoints = [start, ...waypoints, end];
  let d = `M ${start.x} ${start.y}`;
  for (let i = 0; i < allPoints.length - 1; i++) {
    const p1 = allPoints[i];
    const p2 = allPoints[i + 1];
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    d += ` Q ${p1.x} ${p1.y}, ${cx} ${cy} T ${p2.x} ${p2.y}`;
  }

  const midWp = waypoints[Math.floor(waypoints.length / 2)];
  return {
    d,
    midPoint: midWp || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
  };
}

/**
 * Generate straight polyline connecting vertices
 */
export function generateStraightPath(
  start: Point,
  end: Point,
  waypoints: ERDWaypoint[] = []
): { d: string; midPoint: Point } {
  const allPoints = [start, ...waypoints, end];
  const d = allPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const midIndex = Math.floor(allPoints.length / 2);
  const midPoint = allPoints[midIndex] || {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
  return { d, midPoint };
}

/**
 * Compute the routing path based on selected routing style
 */
export function computeConnectionPath(
  start: Point,
  end: Point,
  waypoints: ERDWaypoint[] = [],
  style: RoutingStyle = 'curved'
): { d: string; midPoint: Point } {
  switch (style) {
    case 'orthogonal':
      return generateOrthogonalPath(start, end, waypoints);
    case 'straight':
      return generateStraightPath(start, end, waypoints);
    case 'curved':
    default:
      return generateCurvedPath(start, end, waypoints);
  }
}

/**
 * Export PlantUML representation
 */
export function generatePlantUml(
  entities: ERDEntity[],
  relationships: ERDRelationship[],
  mode: 'relational' | 'uml' | 'distributed' = 'relational'
): string {
  let out = `@startuml\n!theme plain\nhide circle\nskinparam monochrome false\nskinparam linetype ortho\n\n`;

  if (mode === 'uml') {
    entities.forEach((ent) => {
      const stereotype = ent.stereotype ? ` ${ent.stereotype}` : '';
      out += `class "${ent.name}"${stereotype} {\n`;
      ent.attributes.forEach((attr) => {
        const vis = attr.isPrimaryKey ? '+' : attr.isForeignKey ? '#' : '-';
        out += `  ${vis} ${attr.name}: ${attr.dataType}\n`;
      });
      if (ent.methods && ent.methods.length > 0) {
        out += `  --\n`;
        ent.methods.forEach((m) => {
          out += `  ${m.visibility} ${m.name}(${m.parameters || ''}): ${m.returnType}\n`;
        });
      }
      out += `}\n\n`;
    });

    relationships.forEach((rel) => {
      const from = entities.find((e) => e.id === rel.fromEntityId);
      const to = entities.find((e) => e.id === rel.toEntityId);
      if (!from || !to) return;

      let arrow = '-->';
      if (rel.arrowhead === 'diamond_filled') arrow = '*--';
      else if (rel.arrowhead === 'diamond_open') arrow = 'o--';
      else if (rel.lineStyle === 'dashed') arrow = '..>';

      const lbl = rel.label || rel.cardinality;
      out += `"${from.name}" ${arrow} "${to.name}" : ${lbl}\n`;
    });
  } else if (mode === 'distributed') {
    out += `' Distributed Systems Architecture\n`;
    entities.forEach((ent) => {
      const typeStr = ent.nodeType || 'node';
      out += `node "${ent.name}" <<${ent.techBadge || typeStr}>> {\n`;
      if (ent.metrics) {
        out += `  [RPS: ${ent.metrics.rps || 'N/A'}]\n`;
        out += `  [Latency: ${ent.metrics.latency || 'N/A'}]\n`;
      }
      out += `}\n\n`;
    });

    relationships.forEach((rel) => {
      const from = entities.find((e) => e.id === rel.fromEntityId);
      const to = entities.find((e) => e.id === rel.toEntityId);
      if (!from || !to) return;
      const arrow = rel.lineStyle === 'dashed' ? '..>' : '-->';
      const proto = rel.protocol || rel.label || 'data flow';
      out += `"${from.name}" ${arrow} "${to.name}" : ${proto}\n`;
    });
  } else {
    // Relational ERD
    entities.forEach((ent) => {
      out += `entity "${ent.name}" {\n`;
      ent.attributes.forEach((attr) => {
        const pk = attr.isPrimaryKey ? '* ' : '';
        const fk = attr.isForeignKey ? ' <<FK>>' : '';
        out += `  ${pk}${attr.name} : ${attr.dataType}${fk}\n`;
      });
      out += `}\n\n`;
    });

    relationships.forEach((rel) => {
      const from = entities.find((e) => e.id === rel.fromEntityId);
      const to = entities.find((e) => e.id === rel.toEntityId);
      if (!from || !to) return;

      let cardNotation = '}o--||';
      if (rel.cardinality === '1:1') cardNotation = '||--||';
      else if (rel.cardinality === 'M:N') cardNotation = '}o--o{';

      out += `"${from.name}" ${cardNotation} "${to.name}" : "${rel.name}"\n`;
    });
  }

  out += `\n@enduml`;
  return out;
}

/**
 * Export Mermaid diagram code
 */
export function generateMermaid(
  entities: ERDEntity[],
  relationships: ERDRelationship[],
  mode: 'relational' | 'uml' | 'distributed' = 'relational'
): string {
  if (mode === 'uml') {
    let out = `classDiagram\n`;
    entities.forEach((ent) => {
      out += `    class ${ent.name} {\n`;
      ent.attributes.forEach((attr) => {
        const vis = attr.isPrimaryKey ? '+' : attr.isForeignKey ? '#' : '-';
        out += `        ${vis}${attr.dataType} ${attr.name}\n`;
      });
      if (ent.methods && ent.methods.length > 0) {
        ent.methods.forEach((m) => {
          out += `        ${m.visibility}${m.name}(${m.parameters || ''}) ${m.returnType}\n`;
        });
      }
      out += `    }\n`;
    });

    relationships.forEach((rel) => {
      const from = entities.find((e) => e.id === rel.fromEntityId);
      const to = entities.find((e) => e.id === rel.toEntityId);
      if (!from || !to) return;
      let arrow = '-->';
      if (rel.arrowhead === 'diamond_filled') arrow = '*--';
      else if (rel.arrowhead === 'diamond_open') arrow = 'o--';
      else if (rel.lineStyle === 'dashed') arrow = '..>';
      out += `    ${from.name} ${arrow} ${to.name} : ${rel.label || rel.cardinality}\n`;
    });
    return out;
  }

  if (mode === 'distributed') {
    let out = `flowchart TD\n`;
    entities.forEach((ent) => {
      const badge = ent.techBadge ? ` [${ent.techBadge}]` : '';
      const rps = ent.metrics?.rps ? `<br/><small>${ent.metrics.rps}</small>` : '';
      out += `    ${ent.id}["<b>${ent.name}</b>${badge}${rps}"]\n`;
    });

    relationships.forEach((rel) => {
      const arrow = rel.lineStyle === 'dashed' ? '-.->' : '-->';
      const proto = rel.protocol || rel.label || '';
      out += `    ${rel.fromEntityId} ${arrow}|${proto}| ${rel.toEntityId}\n`;
    });
    return out;
  }

  // Relational ERD
  let out = `erDiagram\n`;
  entities.forEach((ent) => {
    out += `    ${ent.name} {\n`;
    ent.attributes.forEach((attr) => {
      const pk = attr.isPrimaryKey ? ' PK' : attr.isForeignKey ? ' FK' : '';
      out += `        ${attr.dataType.replace(/[^a-zA-Z0-9]/g, '_')} ${attr.name}${pk}\n`;
    });
    out += `    }\n`;
  });

  relationships.forEach((rel) => {
    const from = entities.find((e) => e.id === rel.fromEntityId);
    const to = entities.find((e) => e.id === rel.toEntityId);
    if (!from || !to) return;
    let card = '||--o{';
    if (rel.cardinality === '1:1') card = '||--||';
    else if (rel.cardinality === 'M:N') card = '}o--o{';
    out += `    ${from.name} ${card} ${to.name} : "${rel.name}"\n`;
  });

  return out;
}
