export function generateConnectionPath(sourceX: number, sourceY: number, targetX: number, targetY: number): string {
  const dx = targetX - sourceX;
  if (dx >= 40) {
    return generateBezierPath(sourceX, sourceY, targetX, targetY);
  } else {
    return generateOrthogonalPath(sourceX, sourceY, targetX, targetY);
  }
}

export function generateBezierPath(sourceX: number, sourceY: number, targetX: number, targetY: number): string {
  const dx = targetX - sourceX;
  const controlOffset = Math.max(Math.abs(dx) / 2, 40);
  const cx1 = sourceX + controlOffset;
  const cy1 = sourceY;
  const cx2 = targetX - controlOffset;
  const cy2 = targetY;
  return `M ${sourceX} ${sourceY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetX} ${targetY}`;
}

export function generateOrthogonalPath(sourceX: number, sourceY: number, targetX: number, targetY: number): string {
  const r = 8;
  const horizontalGap = 30;
  const verticalPadding = 50;
  const bottomY = Math.max(sourceY, targetY) + verticalPadding;
  const rightX = sourceX + horizontalGap;
  const leftX = targetX - horizontalGap;

  let path = `M ${sourceX} ${sourceY}`;
  path += ` H ${rightX - r}`;
  path += ` Q ${rightX} ${sourceY}, ${rightX} ${sourceY + r}`;
  path += ` V ${bottomY - r}`;
  path += ` Q ${rightX} ${bottomY}, ${rightX - r} ${bottomY}`;
  path += ` H ${leftX + r}`;
  path += ` Q ${leftX} ${bottomY}, ${leftX} ${bottomY - r}`;
  path += ` V ${targetY + r}`;
  path += ` Q ${leftX} ${targetY}, ${leftX + r} ${targetY}`;
  path += ` H ${targetX}`;
  return path;
}

export function getConnectionMidpoint(sourceX: number, sourceY: number, targetX: number, targetY: number): { x: number; y: number } {
  const dx = targetX - sourceX;
  if (dx >= 40) {
    const controlOffset = Math.max(Math.abs(dx) / 2, 40);
    const cx1 = sourceX + controlOffset;
    const cy1 = sourceY;
    const cx2 = targetX - controlOffset;
    const cy2 = targetY;
    const t = 0.5;
    const mt = 1 - t;
    const x = mt*mt*mt*sourceX + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*targetX;
    const y = mt*mt*mt*sourceY + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*targetY;
    return { x, y };
  } else {
    const bottomY = Math.max(sourceY, targetY) + 50;
    const midX = (sourceX + targetX) / 2;
    return { x: midX, y: bottomY };
  }
}
