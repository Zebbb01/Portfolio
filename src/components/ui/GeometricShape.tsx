// src/components/ui/GeometricShape.tsx
'use client';

interface GeometricShapeProps {
  variant:
    | 'quarter-circle'
    | 'half-circle'
    | 'concentric-arcs'
    | 'large-circle'
    | 'dot-grid'
    | 'diamond'
    | 'corner-accent';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  opacity?: number;
  className?: string;
}

const positionClasses: Record<string, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

export default function GeometricShape({
  variant,
  position,
  size = 400,
  opacity = 0.08,
  className = '',
}: GeometricShapeProps) {
  const posClass = positionClasses[position];

  // Quarter circle: large FILLED arc anchored to a corner
  if (variant === 'quarter-circle') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `translate(${isRight ? '30%' : '-30%'}, ${isBottom ? '30%' : '-30%'})`,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id={`qc-grad-${position}`} cx="0" cy="0" r="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx={isRight ? size : 0}
            cy={isBottom ? size : 0}
            r={size * 0.85}
            fill={`url(#qc-grad-${position})`}
          />
        </svg>
      </div>
    );
  }

  // Half circle: filled semicircle with gradient
  if (variant === 'half-circle') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size / 2,
          opacity,
          transform: `translate(${isRight ? '20%' : '-20%'}, 0)`,
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `radial-gradient(ellipse at ${isRight ? 'right' : 'left'} ${isBottom ? 'bottom' : 'top'}, #D4AF37 0%, transparent 70%)`,
            borderRadius: isBottom ? '0 0 50% 50%' : '50% 50% 0 0',
          }}
        />
      </div>
    );
  }

  // Concentric arcs: multiple filled arcs radiating from corner with decreasing opacity
  if (variant === 'concentric-arcs') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');
    const cx = isRight ? size : 0;
    const cy = isBottom ? size : 0;

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `translate(${isRight ? '20%' : '-20%'}, ${isBottom ? '20%' : '-20%'})`,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {[0.9, 0.65, 0.4].map((scale, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={size * scale}
              fill="none"
              stroke="#D4AF37"
              strokeWidth={2 - i * 0.5}
              opacity={0.5 - i * 0.15}
            />
          ))}
          {/* Filled innermost circle for warmth */}
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.2}
            fill="#D4AF37"
            opacity={0.08}
          />
        </svg>
      </div>
    );
  }

  // Large circle: bold radial gradient glow
  if (variant === 'large-circle') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `translate(${isRight ? '35%' : '-35%'}, ${isBottom ? '35%' : '-35%'})`,
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, #D4AF37 0%, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.05) 60%, transparent 80%)',
          }}
        />
      </div>
    );
  }

  // Diamond: rotated square shapes at corners (like the teal diamonds in the reference)
  if (variant === 'diamond') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');
    const smallSize = size * 0.35;

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `translate(${isRight ? '15%' : '-15%'}, ${isBottom ? '15%' : '-15%'})`,
        }}
      >
        {/* Large diamond */}
        <div
          className="absolute"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'linear-gradient(135deg, #D4AF37 0%, rgba(212,175,55,0.4) 100%)',
            transform: 'rotate(45deg)',
            borderRadius: size * 0.06,
            top: isBottom ? 'auto' : 0,
            bottom: isBottom ? 0 : 'auto',
            left: isRight ? 'auto' : 0,
            right: isRight ? 0 : 'auto',
          }}
        />
        {/* Small diamond */}
        <div
          className="absolute"
          style={{
            width: smallSize,
            height: smallSize,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.2) 100%)',
            transform: 'rotate(45deg)',
            borderRadius: smallSize * 0.08,
            top: isBottom ? 'auto' : size * 0.45,
            bottom: isBottom ? size * 0.45 : 'auto',
            left: isRight ? 'auto' : size * 0.45,
            right: isRight ? size * 0.45 : 'auto',
          }}
        />
      </div>
    );
  }

  // Corner accent: angular slash shapes in a corner (like the green/blue reference)
  if (variant === 'corner-accent') {
    const isRight = position.includes('right');
    const isBottom = position.includes('bottom');

    return (
      <div
        className={`absolute ${posClass} pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          opacity,
          overflow: 'hidden',
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={`ca-grad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {isRight && !isBottom && (
            <>
              <polygon points={`${size},0 ${size * 0.5},0 ${size},${size * 0.6}`} fill={`url(#ca-grad-${position})`} />
              <polygon points={`${size},0 ${size * 0.7},0 ${size},${size * 0.35}`} fill="#D4AF37" opacity="0.15" />
            </>
          )}
          {!isRight && isBottom && (
            <>
              <polygon points={`0,${size} 0,${size * 0.4} ${size * 0.5},${size}`} fill={`url(#ca-grad-${position})`} />
              <polygon points={`0,${size} 0,${size * 0.65} ${size * 0.3},${size}`} fill="#D4AF37" opacity="0.15" />
            </>
          )}
          {!isRight && !isBottom && (
            <>
              <polygon points={`0,0 ${size * 0.5},0 0,${size * 0.6}`} fill={`url(#ca-grad-${position})`} />
              <polygon points={`0,0 ${size * 0.3},0 0,${size * 0.35}`} fill="#D4AF37" opacity="0.15" />
            </>
          )}
          {isRight && isBottom && (
            <>
              <polygon points={`${size},${size} ${size * 0.5},${size} ${size},${size * 0.4}`} fill={`url(#ca-grad-${position})`} />
              <polygon points={`${size},${size} ${size * 0.7},${size} ${size},${size * 0.65}`} fill="#D4AF37" opacity="0.15" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Dot grid
  if (variant === 'dot-grid') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          opacity,
          backgroundImage: `radial-gradient(circle, #D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />
    );
  }

  return null;
}
