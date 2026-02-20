import { useEffect, useRef } from 'react';

const ParticleField = ({ count = 40 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // ── Mobile detection ───────────────────────────────
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // Fewer particles on mobile, none on very small screens if desired
        const particleCount = isMobile ? Math.min(count, 12) : count;
        // Cap pixel ratio at 2 to prevent 3x rendering on modern phones
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const ctx = canvas.getContext('2d', { alpha: true });
        let animationId;
        let isVisible = true;

        const resize = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();

        const onResize = () => resize();
        window.addEventListener('resize', onResize, { passive: true });

        // ── Particles ──────────────────────────────────────
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
                vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                pulseSpeed: Math.random() * 0.015 + 0.004,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }

        // Connection threshold — disabled on mobile (most expensive part)
        const CONNECTION_DIST = isMobile ? 0 : 120;

        const draw = (time) => {
            if (!isVisible) {
                animationId = requestAnimationFrame(draw);
                return;
            }

            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
                const alpha = p.opacity * pulse;

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(34,197,94,${alpha})`;
                ctx.fill();

                // Soft glow halo — skip on mobile
                if (!isMobile) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(34,197,94,${alpha * 0.12})`;
                    ctx.fill();
                }

                // Connection lines — O(n²), only on desktop
                if (CONNECTION_DIST > 0) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < CONNECTION_DIST) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(34,197,94,${(1 - dist / CONNECTION_DIST) * 0.12})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        // ── Pause when off-screen (IntersectionObserver) ───
        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0 }
        );
        observer.observe(canvas);

        animationId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onResize);
            observer.disconnect();
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                willChange: 'transform', // compositor hint
            }}
        />
    );
};

export default ParticleField;
