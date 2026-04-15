import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ChromeSphere() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 280;
    const h = w; // always square

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Chrome sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 1.5,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights for chrome effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xc0c0c0, 1.5);
    light2.position.set(-5, -3, -5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0x888888, 1, 10);
    light3.position.set(0, 3, 2);
    scene.add(light3);

    // Engraved V shape using ring
    const ringGeo = new THREE.TorusGeometry(0.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.9;
    scene.add(ring);

    // Ripple rings
    const ripples = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(1.2 + i * 0.3, 0.008, 8, 60);
      const rMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1, roughness: 0.1, transparent: true, opacity: 0.3 - i * 0.08 });
      const r = new THREE.Mesh(rGeo, rMat);
      r.rotation.x = Math.PI / 2;
      scene.add(r);
      ripples.push({ mesh: r, phase: i * (Math.PI * 2 / 3) });
    }

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.001;
      ring.rotation.z += 0.003;
      ripples.forEach(({ mesh, phase }) => {
        const s = 1 + 0.05 * Math.sin(Date.now() * 0.002 + phase);
        mesh.scale.set(s, s, s);
        mesh.material.opacity = 0.2 + 0.1 * Math.sin(Date.now() * 0.002 + phase);
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = mount.clientWidth || 280;
      renderer.setSize(nw, nw);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      width: "100%",
      aspectRatio: "1 / 1",
      maxWidth: 320,
      margin: "0 auto",
      display: "block",
    }} />
  );
}