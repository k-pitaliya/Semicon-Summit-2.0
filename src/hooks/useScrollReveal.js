import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-reveal animations using Intersection Observer.
 * Add className="reveal" to any element you want to animate on scroll.
 * Add data-delay="1" through data-delay="6" for staggered children.
 */
export function useScrollReveal() {
    const observerRef = useRef(null);

    useEffect(() => {
        // Respect prefers-reduced-motion — skip animations entirely
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
            return;
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        // Observe all elements with .reveal class
        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return { reveal: () => {} };
}

export default useScrollReveal;
