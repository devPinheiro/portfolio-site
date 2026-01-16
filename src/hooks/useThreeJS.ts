import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface UseThreeJSProps {
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
}

export const useThreeJS = ({
  antialias = true,
  alpha = true,
  preserveDrawingBuffer = false
}: UseThreeJSProps = {}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameId = useRef<number>(0);

  const setupScene = () => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias,
      alpha,
      preserveDrawingBuffer
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    return { scene, camera, renderer };
  };

  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const startRenderLoop = (customRender?: (time: number) => void) => {
    const render = (time: number) => {
      if (customRender) {
        customRender(time);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      frameId.current = requestAnimationFrame(render);
    };

    frameId.current = requestAnimationFrame(render);
  };

  const stopRenderLoop = () => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
  };

  const cleanup = () => {
    stopRenderLoop();

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (mountRef.current && rendererRef.current.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    if (sceneRef.current) {
      // Dispose of all materials and geometries
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  };

  useEffect(() => {
    const setup = setupScene();
    if (setup) {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        cleanup();
      };
    }
  }, []);

  return {
    mountRef,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    startRenderLoop,
    stopRenderLoop,
    handleResize,
    THREE
  };
};