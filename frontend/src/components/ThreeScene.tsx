import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const cursorParticlesRef = useRef<THREE.Points | null>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const targetMousePos = useRef(new THREE.Vector3());
    const currentMousePos = useRef(new THREE.Vector3());

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = false; // Disable orbit controls for cursor animation
        controlsRef.current = controls;

        // Create background particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 800; // Reduced particle count
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position - reduced spread
            positions[i] = (Math.random() - 0.5) * 35;
            positions[i + 1] = (Math.random() - 0.5) * 35;
            positions[i + 2] = (Math.random() - 0.5) * 35;

            // Color - made more transparent
            colors[i] = Math.random() * 0.2 + 0.8;
            colors[i + 1] = Math.random() * 0.2 + 0.8;
            colors[i + 2] = 1;

            // Size - made smaller
            sizes[i/3] = Math.random() * 0.3 + 0.1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for interactive particles
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                mousePos: { value: new THREE.Vector3() },
                time: { value: 0 },
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform vec3 mousePos;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Reduced interactive effect with mouse
                    float dist = distance(pos, mousePos);
                    float influence = 1.0 - clamp(dist / 15.0, 0.0, 1.0);
                    pos += normalize(pos - mousePos) * influence * 0.5; // Reduced movement
                    
                    // Subtler wave animation
                    pos.y += sin(time * 0.0005 + pos.x * 0.05) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
                    gl_FragColor = vec4(vColor, 0.4); // Reduced opacity
                }
            `,
            transparent: true,
            vertexColors: true,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        particlesRef.current = particles;

        // Create cursor particles
        const cursorGeometry = new THREE.BufferGeometry();
        const cursorParticleCount = 50;
        const cursorPositions = new Float32Array(cursorParticleCount * 3);
        const cursorColors = new Float32Array(cursorParticleCount * 3);
        const cursorSizes = new Float32Array(cursorParticleCount);

        for (let i = 0; i < cursorParticleCount * 3; i += 3) {
            cursorPositions[i] = 0;
            cursorPositions[i + 1] = 0;
            cursorPositions[i + 2] = 0;
            cursorColors[i] = 1;
            cursorColors[i + 1] = 1;
            cursorColors[i + 2] = 1;
            cursorSizes[i/3] = Math.random() * 0.2 + 0.1;
        }

        cursorGeometry.setAttribute('position', new THREE.BufferAttribute(cursorPositions, 3));
        cursorGeometry.setAttribute('color', new THREE.BufferAttribute(cursorColors, 3));
        cursorGeometry.setAttribute('size', new THREE.BufferAttribute(cursorSizes, 1));

        // Cursor particle material
        const cursorMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePos: { value: new THREE.Vector3() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform vec3 mousePos;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Add swirl effect around cursor
                    float angle = time * 0.001 + length(pos) * 0.5;
                    float radius = length(pos) + sin(time * 0.001) * 0.5;
                    pos.x = cos(angle) * radius + mousePos.x;
                    pos.y = sin(angle) * radius + mousePos.y;
                    pos.z = mousePos.z;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
                    gl_FragColor = vec4(vColor, 0.6);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        const cursorParticles = new THREE.Points(cursorGeometry, cursorMaterial);
        scene.add(cursorParticles);
        cursorParticlesRef.current = cursorParticles;

        // Mouse move handler
        const onMouseMove = (event: MouseEvent) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.current.setFromCamera(mouse.current, camera);
            targetMousePos.current.copy(raycaster.current.ray.at(10, new THREE.Vector3()));
            
            if (particles.material instanceof THREE.ShaderMaterial) {
                particles.material.uniforms.mousePos.value.copy(targetMousePos.current);
            }
        };

        // Click handler for explosive effect - made more subtle
        const onClick = () => {
            const positions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                const direction = new THREE.Vector3(x, y, z).normalize();
                positions[i] += direction.x * 0.8;
                positions[i + 1] += direction.y * 0.8;
                positions[i + 2] += direction.z * 0.8;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        // Animation
        let frame = 0;
        const animate = () => {
            frame = requestAnimationFrame(animate);

            // Update cursor position with smooth interpolation
            currentMousePos.current.lerp(targetMousePos.current, 0.1);

            if (cursorParticles.material instanceof THREE.ShaderMaterial) {
                cursorParticles.material.uniforms.time.value = Date.now();
                cursorParticles.material.uniforms.mousePos.value.copy(currentMousePos.current);
            }

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            if (particles.material instanceof THREE.ShaderMaterial) {
                particles.material.uniforms.time.value = Date.now();
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (container && rendererRef.current) {
                container.removeChild(rendererRef.current.domElement);
            }
            cancelAnimationFrame(frame);
        };
    }, []);

    return <div ref={containerRef} style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.5,
        pointerEvents: 'none'  // This ensures the ThreeScene doesn't interfere with scrolling
    }} />;
};

export default ThreeScene;