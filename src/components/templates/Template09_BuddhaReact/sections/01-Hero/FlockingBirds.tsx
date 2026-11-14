'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FlockingBirdsProps {
  birdCount?: number;
  birdSize?: number;
  maxSpeed?: number;
  cohesion?: number;
}

export function FlockingBirds({
  birdCount = 24,
  birdSize = 0.85,
  maxSpeed = 3.2,
  cohesion = 0.5,
}: FlockingBirdsProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGL Renderer Initialization
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 1, 3000);
    camera.position.set(0, 0, 480);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Procedural Authentic 3D Low-Poly Bird Mesh Geometry
    const birdGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      // Left Wing
      0, 0, 0,
      -14 * birdSize, 0, 0,
      0, 0, 8 * birdSize,
      // Right Wing
      0, 0, 0,
      0, 0, 8 * birdSize,
      14 * birdSize, 0, 0,
      // Body Keel
      0, -2 * birdSize, 3 * birdSize,
      0, 2 * birdSize, 3 * birdSize,
      0, 0, 10 * birdSize,
    ]);
    birdGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    birdGeometry.computeVertexNormals();

    const birdMaterial = new THREE.MeshBasicMaterial({
      color: 0x240000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.68,
    });

    // 3. Flocking Boids State & Physics Vectors
    interface Boid {
      mesh: THREE.Mesh;
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      phase: number;
    }

    const boids: Boid[] = [];
    for (let i = 0; i < birdCount; i++) {
      const mesh = new THREE.Mesh(birdGeometry.clone(), birdMaterial.clone());
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 550,
        (Math.random() - 0.2) * 220 + 80,
        (Math.random() - 0.5) * 250
      );
      const velocity = new THREE.Vector3(
        (Math.random() * 0.8 + 0.6) * (Math.random() > 0.5 ? 1 : -1),
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      ).normalize().multiplyScalar(maxSpeed * (0.7 + Math.random() * 0.3));

      mesh.position.copy(position);
      scene.add(mesh);

      boids.push({
        mesh,
        position,
        velocity,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 4. Interactive Cursor / Wind Steering
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 200;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 120;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. 60fps Boids Simulation & Flapping Animation Loop
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(container);

    let clock = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock += 0.055;

      for (let i = 0; i < boids.length; i++) {
        const boid = boids[i];

        // Wing Flap Harmonic Sine Deformation
        boid.phase += 0.22 + boid.velocity.length() * 0.035;
        const flap = Math.sin(boid.phase) * (6 * birdSize);
        const posAttr = (boid.mesh.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        arr[4] = flap;
        arr[22] = flap;
        posAttr.needsUpdate = true;

        // Boid Flight Steering & Boundary Reflection
        boid.position.add(boid.velocity);

        // Gentle wind influence
        boid.velocity.x += (mouseX * 0.0003);
        boid.velocity.y += (mouseY * 0.0002);

        // Boundary bounce bounds
        const boundX = 420;
        const boundY = 240;
        const boundZ = 200;
        if (boid.position.x > boundX) boid.velocity.x -= 0.12;
        if (boid.position.x < -boundX) boid.velocity.x += 0.12;
        if (boid.position.y > boundY) boid.velocity.y -= 0.08;
        if (boid.position.y < -30) boid.velocity.y += 0.08;
        if (boid.position.z > boundZ) boid.velocity.z -= 0.08;
        if (boid.position.z < -boundZ) boid.velocity.z += 0.08;

        boid.velocity.clampLength(1.0, maxSpeed);

        // Mesh Heading Orientation
        boid.mesh.position.copy(boid.position);
        boid.mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          boid.velocity.clone().normalize()
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Viewport Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 1000;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 7. Cleanup & Disposal on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      boids.forEach((b) => {
        scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
      });
      birdGeometry.dispose();
      birdMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [birdCount, birdSize, maxSpeed, cohesion]);

  return (
    <div
      ref={mountRef}
      className="flocking-birds-viewport"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

export default FlockingBirds;
