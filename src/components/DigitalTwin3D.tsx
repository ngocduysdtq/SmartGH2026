import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GreenhouseZone, SensorMetrics } from '../types/greenhouse';
import { Eye, Wind, Droplets, Sun, Activity, Layers, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DigitalTwin3DProps {
  selectedZone: GreenhouseZone;
  onSelectZone: (zoneId: GreenhouseZone['id']) => void;
  zones: GreenhouseZone[];
  metrics: SensorMetrics;
  fanActive: boolean;
  mistActive: boolean;
  ledActive: boolean;
  shadePercent: number;
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  selectedZone,
  onSelectZone,
  zones,
  metrics,
  fanActive,
  mistActive,
  ledActive,
  shadePercent,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<'OVERVIEW' | 'ZONE_A' | 'ZONE_B' | 'ROOF' | 'IRRIGATION'>('OVERVIEW');
  const [showHeatParticles, setShowHeatParticles] = useState(true);
  const [hoveredZoneName, setHoveredZoneName] = useState<string | null>(null);

  // References to animate elements in Three.js render loop
  const fansRef = useRef<THREE.Group[]>([]);
  const mistParticlesRef = useRef<THREE.Points | null>(null);
  const heatParticlesRef = useRef<THREE.Points | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const targetCamPos = useRef(new THREE.Vector3(14, 11, 16));

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1322);
    scene.fog = new THREE.FogExp2(0x0c1322, 0.02);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(14, 11, 16);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Dynamic LED Grow Lights (Pink/Purple horticulture light)
    const ledGrowLight = new THREE.PointLight(0xff00aa, ledActive ? 3.0 : 0.2, 18);
    ledGrowLight.position.set(0, 5, 0);
    scene.add(ledGrowLight);

    // 5. Floor & Base
    const floorGeo = new THREE.PlaneGeometry(24, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x141e2e,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid on floor
    const gridHelper = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 6. Greenhouse Frame & Glass Structure
    const greenhouseGroup = new THREE.Group();

    // Aluminum frame lines
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.8,
    });

    // Glass walls material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5,
    });

    const ghLength = 18;
    const ghWidth = 14;
    const ghWallHeight = 3.8;
    const ghRoofPeak = 6.0;

    // Perimeter Glass Walls
    const wallGeoFront = new THREE.BoxGeometry(ghWidth, ghWallHeight, 0.1);
    const wallFront = new THREE.Mesh(wallGeoFront, glassMat);
    wallFront.position.set(0, ghWallHeight / 2, ghLength / 2);
    greenhouseGroup.add(wallFront);

    const wallBack = new THREE.Mesh(wallGeoFront, glassMat);
    wallBack.position.set(0, ghWallHeight / 2, -ghLength / 2);
    greenhouseGroup.add(wallBack);

    const wallGeoSide = new THREE.BoxGeometry(0.1, ghWallHeight, ghLength);
    const wallLeft = new THREE.Mesh(wallGeoSide, glassMat);
    wallLeft.position.set(-ghWidth / 2, ghWallHeight / 2, 0);
    greenhouseGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(wallGeoSide, glassMat);
    wallRight.position.set(ghWidth / 2, ghWallHeight / 2, 0);
    greenhouseGroup.add(wallRight);

    // Structural Pillars
    const pillarPositions = [
      [-ghWidth / 2, ghLength / 2],
      [ghWidth / 2, ghLength / 2],
      [-ghWidth / 2, -ghLength / 2],
      [ghWidth / 2, -ghLength / 2],
      [-ghWidth / 2, 0],
      [ghWidth / 2, 0],
    ];

    pillarPositions.forEach(([px, pz]) => {
      const colGeo = new THREE.CylinderGeometry(0.12, 0.12, ghWallHeight, 8);
      const col = new THREE.Mesh(colGeo, frameMat);
      col.position.set(px, ghWallHeight / 2, pz);
      greenhouseGroup.add(col);
    });

    // Roof Truss & Glass panels
    const roofPurlinGeo = new THREE.CylinderGeometry(0.08, 0.08, ghLength, 8);
    const ridgeBeam = new THREE.Mesh(roofPurlinGeo, frameMat);
    ridgeBeam.rotation.x = Math.PI / 2;
    ridgeBeam.position.set(0, ghRoofPeak, 0);
    greenhouseGroup.add(ridgeBeam);

    // Sloped glass roof panels
    const roofPanelGeo = new THREE.PlaneGeometry(Math.sqrt(Math.pow(ghWidth / 2, 2) + Math.pow(ghRoofPeak - ghWallHeight, 2)), ghLength);
    const roofLeft = new THREE.Mesh(roofPanelGeo, glassMat);
    roofLeft.position.set(-ghWidth / 4, (ghWallHeight + ghRoofPeak) / 2, 0);
    roofLeft.rotation.x = Math.PI / 2;
    roofLeft.rotation.y = Math.atan2(ghRoofPeak - ghWallHeight, ghWidth / 2);
    greenhouseGroup.add(roofLeft);

    const roofRight = new THREE.Mesh(roofPanelGeo, glassMat);
    roofRight.position.set(ghWidth / 4, (ghWallHeight + ghRoofPeak) / 2, 0);
    roofRight.rotation.x = Math.PI / 2;
    roofRight.rotation.y = -Math.atan2(ghRoofPeak - ghWallHeight, ghWidth / 2);
    greenhouseGroup.add(roofRight);

    // Automated Roof Thermal Shade Cloth (Reflects light)
    const shadeClothGeo = new THREE.PlaneGeometry((ghWidth * 0.9) * (shadePercent / 100), ghLength * 0.9);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const shadeMesh = new THREE.Mesh(shadeClothGeo, shadeMat);
    shadeMesh.rotation.x = Math.PI / 2;
    shadeMesh.position.set(0, ghRoofPeak - 0.6, 0);
    greenhouseGroup.add(shadeMesh);

    scene.add(greenhouseGroup);

    // 7. Ventilation Fans (Actuators)
    fansRef.current = [];
    const fanPositions = [
      new THREE.Vector3(-3, ghRoofPeak - 0.7, -ghLength / 2 + 0.3),
      new THREE.Vector3(3, ghRoofPeak - 0.7, -ghLength / 2 + 0.3),
    ];

    fanPositions.forEach((fPos) => {
      const fanGroup = new THREE.Group();
      fanGroup.position.copy(fPos);

      // Fan circular housing
      const ringGeo = new THREE.TorusGeometry(0.7, 0.08, 12, 24);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      fanGroup.add(ring);

      // Fan hub & blades
      const bladeGroup = new THREE.Group();
      for (let b = 0; b < 4; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.55, 0.15, 0.02);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.x = 0.28;
        blade.rotation.z = (b * Math.PI) / 2;
        bladeGroup.add(blade);
      }
      fanGroup.add(bladeGroup);
      fansRef.current.push(bladeGroup);
      scene.add(fanGroup);
    });

    // 8. Overhead LED Grow Light bars
    for (let lx = -4; lx <= 4; lx += 4) {
      const ledBarGeo = new THREE.BoxGeometry(0.3, 0.1, 14);
      const ledBarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
      const ledBar = new THREE.Mesh(ledBarGeo, ledBarMat);
      ledBar.position.set(lx, ghRoofPeak - 1.2, 0);
      scene.add(ledBar);

      if (ledActive) {
        // Glow strip underneath
        const stripGeo = new THREE.PlaneGeometry(0.2, 13.8);
        const stripMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = Math.PI / 2;
        strip.position.set(lx, ghRoofPeak - 1.26, 0);
        scene.add(strip);
      }
    }

    // 9. Cultivation Zones & Plant Beds
    const zoneBeds = [
      { id: 'zone-a', name: 'Zone A: Cà Chua Cherry', color: 0xef4444, x: -3.8, z: -4, type: 'tomato' },
      { id: 'zone-b', name: 'Zone B: Dâu Tây Bạch Tuyết', color: 0xec4899, x: 3.8, z: -4, type: 'strawberry' },
      { id: 'zone-c', name: 'Zone C: Ớt Chuông Sweet Pepper', color: 0xeab308, x: -3.8, z: 4, type: 'pepper' },
      { id: 'zone-d', name: 'Zone D: Dưa Lưới Khí Canh', color: 0x10b981, x: 3.8, z: 4, type: 'melon' },
    ];

    const interactiveObjects: THREE.Mesh[] = [];

    zoneBeds.forEach((zb) => {
      // Raised hydroponic bench
      const benchGeo = new THREE.BoxGeometry(5.2, 0.6, 6.2);
      const benchMat = new THREE.MeshStandardMaterial({
        color: selectedZone.id === zb.id ? 0x1e3a5f : 0x1e293b,
        roughness: 0.6,
      });
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(zb.x, 0.3, zb.z);
      bench.castShadow = true;
      bench.receiveShadow = true;
      (bench as any).userData = { zoneId: zb.id, name: zb.name };
      scene.add(bench);
      interactiveObjects.push(bench);

      // Growing medium (Coco-coir / substrate)
      const soilGeo = new THREE.BoxGeometry(4.9, 0.1, 5.9);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.9 });
      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.position.set(zb.x, 0.65, zb.z);
      scene.add(soil);

      // Micro Drip Irrigation tubes
      for (let t = -2.2; t <= 2.2; t += 1.1) {
        const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 5.8, 6);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.rotation.x = Math.PI / 2;
        tube.position.set(zb.x + t, 0.72, zb.z);
        scene.add(tube);
      }

      // Zone Marker Base Glow
      if (selectedZone.id === zb.id) {
        const markerGeo = new THREE.RingGeometry(0.5, 3.2, 24);
        const markerMat = new THREE.MeshBasicMaterial({
          color: zb.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.rotation.x = -Math.PI / 2;
        marker.position.set(zb.x, 0.05, zb.z);
        scene.add(marker);
      }

      // Plants modeled inside zone
      for (let row = -2.2; row <= 2.2; row += 1.1) {
        for (let col = -1.8; col <= 1.8; col += 1.2) {
          const px = zb.x + col;
          const pz = zb.z + row;

          // Foliage
          const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 6);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
          const stem = new THREE.Mesh(stemGeo, stemMat);
          stem.position.set(px, 1.25, pz);
          scene.add(stem);

          // Canopy leaves
          const leafMat = new THREE.MeshStandardMaterial({
            color: selectedZone.healthScore < 85 && selectedZone.id === zb.id ? 0xa3a638 : 0x22c55e,
            roughness: 0.5,
          });

          if (zb.type === 'tomato') {
            const bushGeo = new THREE.ConeGeometry(0.45, 1.1, 7);
            const bush = new THREE.Mesh(bushGeo, leafMat);
            bush.position.set(px, 1.7, pz);
            scene.add(bush);

            // Tomatoes
            for (let i = 0; i < 3; i++) {
              const fruitGeo = new THREE.SphereGeometry(0.08, 8, 8);
              const fruitMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
              const fruit = new THREE.Mesh(fruitGeo, fruitMat);
              fruit.position.set(px + (i % 2 === 0 ? 0.2 : -0.2), 1.3 + i * 0.2, pz + 0.15);
              scene.add(fruit);
            }
          } else if (zb.type === 'strawberry') {
            const bushGeo = new THREE.DodecahedronGeometry(0.35, 1);
            const bush = new THREE.Mesh(bushGeo, leafMat);
            bush.position.set(px, 0.95, pz);
            scene.add(bush);

            // White / pink strawberries
            const berryGeo = new THREE.ConeGeometry(0.06, 0.1, 6);
            const berryMat = new THREE.MeshStandardMaterial({ color: 0xfda4af });
            const berry = new THREE.Mesh(berryGeo, berryMat);
            berry.position.set(px + 0.18, 0.85, pz + 0.15);
            berry.rotation.x = Math.PI;
            scene.add(berry);
          } else if (zb.type === 'pepper') {
            const bushGeo = new THREE.BoxGeometry(0.5, 0.9, 0.5);
            const bush = new THREE.Mesh(bushGeo, leafMat);
            bush.position.set(px, 1.4, pz);
            scene.add(bush);

            // Yellow/orange peppers
            const pepperGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.16, 6);
            const pepperMat = new THREE.MeshStandardMaterial({ color: 0xeab308 });
            const pepper = new THREE.Mesh(pepperGeo, pepperMat);
            pepper.position.set(px + 0.15, 1.3, pz + 0.1);
            scene.add(pepper);
          } else {
            // Melon vines
            const melonVineGeo = new THREE.SphereGeometry(0.4, 7, 7);
            const melonVine = new THREE.Mesh(melonVineGeo, leafMat);
            melonVine.position.set(px, 1.2, pz);
            scene.add(melonVine);

            // Round melon fruit
            const melonFruitGeo = new THREE.SphereGeometry(0.2, 10, 10);
            const melonFruitMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.6 });
            const melonFruit = new THREE.Mesh(melonFruitGeo, melonFruitMat);
            melonFruit.position.set(px, 0.85, pz + 0.2);
            scene.add(melonFruit);
          }
        }
      }

      // IoT Edge Sensor Beacon floating above each zone
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(zb.x, 3.2, zb.z);

      const beaconBoxGeo = new THREE.BoxGeometry(0.25, 0.35, 0.15);
      const beaconBoxMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 });
      const beaconBox = new THREE.Mesh(beaconBoxGeo, beaconBoxMat);
      beaconGroup.add(beaconBox);

      // Antenna
      const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6);
      const ant = new THREE.Mesh(antGeo, frameMat);
      ant.position.y = 0.35;
      beaconGroup.add(ant);

      // Blinking status LED
      const ledGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const statusLedMat = new THREE.MeshBasicMaterial({ color: zb.id === selectedZone.id ? 0x22c55e : 0x0284c7 });
      const statusLed = new THREE.Mesh(ledGeo, statusLedMat);
      statusLed.position.set(0, 0, 0.09);
      beaconGroup.add(statusLed);

      scene.add(beaconGroup);
    });

    // 10. Misting Droplets Particle System
    const mistCount = 600;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount * 3; i += 3) {
      mistPositions[i] = (Math.random() - 0.5) * 12;
      mistPositions[i + 1] = 2.0 + Math.random() * 2.8;
      mistPositions[i + 2] = (Math.random() - 0.5) * 14;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: mistActive ? 0.6 : 0.0,
      blending: THREE.AdditiveBlending,
    });
    const mistParticles = new THREE.Points(mistGeo, mistMat);
    scene.add(mistParticles);
    mistParticlesRef.current = mistParticles;

    // 11. Heat & Microclimate Thermal Cloud Particles
    const heatCount = 450;
    const heatGeo = new THREE.BufferGeometry();
    const heatPositions = new Float32Array(heatCount * 3);
    const heatColors = new Float32Array(heatCount * 3);

    for (let i = 0; i < heatCount; i++) {
      const idx = i * 3;
      const x = (Math.random() - 0.5) * 13;
      const y = 1.0 + Math.random() * 3.5;
      const z = (Math.random() - 0.5) * 15;
      heatPositions[idx] = x;
      heatPositions[idx + 1] = y;
      heatPositions[idx + 2] = z;

      // Color coding temperature (warmer red/yellow near top/front, cooler cyan at bottom)
      const tempFactor = (y - 1.0) / 3.5;
      if (tempFactor > 0.6) {
        heatColors[idx] = 0.95;
        heatColors[idx + 1] = 0.3;
        heatColors[idx + 2] = 0.2;
      } else if (tempFactor > 0.3) {
        heatColors[idx] = 0.9;
        heatColors[idx + 1] = 0.75;
        heatColors[idx + 2] = 0.2;
      } else {
        heatColors[idx] = 0.2;
        heatColors[idx + 1] = 0.7;
        heatColors[idx + 2] = 0.95;
      }
    }
    heatGeo.setAttribute('position', new THREE.BufferAttribute(heatPositions, 3));
    heatGeo.setAttribute('color', new THREE.BufferAttribute(heatColors, 3));
    const heatMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.22,
      transparent: true,
      opacity: showHeatParticles ? 0.35 : 0.0,
      blending: THREE.AdditiveBlending,
    });
    const heatParticles = new THREE.Points(heatGeo, heatMat);
    scene.add(heatParticles);
    heatParticlesRef.current = heatParticles;

    // 12. Mouse Drag & Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical().setFromVector3(camera.position);

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        spherical.theta -= deltaX * 0.006;
        spherical.phi -= deltaY * 0.006;
        spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(targetLookAt.current);
      }

      // Raycasting for interactive zone hovering
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const obj = intersects[0].object as any;
        setHoveredZoneName(obj.userData.name);
      } else {
        setHoveredZoneName(null);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(6, Math.min(32, spherical.radius + e.deltaY * 0.02));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(targetLookAt.current);
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const obj = intersects[0].object as any;
        onSelectZone(obj.userData.zoneId);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    // 13. Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate fans if active
      if (fanActive) {
        fansRef.current.forEach((fan) => {
          fan.rotation.z += 12 * delta;
        });
      }

      // Animate mist droplets falling gently
      if (mistActive && mistParticlesRef.current) {
        const positions = mistParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.6 * delta;
          if (positions[i] < 0.6) {
            positions[i] = 4.2;
          }
        }
        mistParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera transition toward target preset if set
      camera.position.lerp(targetCamPos.current, 0.04);
      camera.lookAt(targetLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, [selectedZone.id, selectedZone.healthScore, fanActive, mistActive, ledActive, shadePercent]);

  // Handle Preset Views
  const applyPreset = (preset: 'OVERVIEW' | 'ZONE_A' | 'ZONE_B' | 'ROOF' | 'IRRIGATION') => {
    setCameraPreset(preset);
    if (preset === 'OVERVIEW') {
      targetCamPos.current.set(14, 11, 16);
      targetLookAt.current.set(0, 1.5, 0);
    } else if (preset === 'ZONE_A') {
      targetCamPos.current.set(-5, 4.5, 0);
      targetLookAt.current.set(-3.8, 1.2, -4);
    } else if (preset === 'ZONE_B') {
      targetCamPos.current.set(5, 4.5, 0);
      targetLookAt.current.set(3.8, 1.2, -4);
    } else if (preset === 'ROOF') {
      targetCamPos.current.set(0, 10, 12);
      targetLookAt.current.set(0, 5, 0);
    } else if (preset === 'IRRIGATION') {
      targetCamPos.current.set(0, 2.5, 8);
      targetLookAt.current.set(0, 0.8, 0);
    }
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D Top Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/60 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <span className="font-semibold text-white tracking-wide">DIGITAL TWIN 3D</span>
            <span className="text-slate-400 ml-2">Live Three.js Sync</span>
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <span className="text-xs px-2 py-0.5 rounded font-mono font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60">
            {selectedZone.name}
          </span>
        </div>

        {/* Camera Preset Quick Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 pointer-events-auto">
          <button
            onClick={() => applyPreset('OVERVIEW')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              cameraPreset === 'OVERVIEW' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Toàn cảnh
          </button>
          <button
            onClick={() => applyPreset('ZONE_A')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              cameraPreset === 'ZONE_A' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Zone A Cà chua
          </button>
          <button
            onClick={() => applyPreset('ZONE_B')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              cameraPreset === 'ZONE_B' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Zone B Dâu tây
          </button>
          <button
            onClick={() => applyPreset('ROOF')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              cameraPreset === 'ROOF' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Mái & Quạt
          </button>
          <button
            onClick={() => applyPreset('IRRIGATION')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              cameraPreset === 'IRRIGATION' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Hệ tưới
          </button>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Floating Hover Indicator */}
      {hoveredZoneName && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 shadow-lg text-xs text-emerald-300 flex items-center gap-2 pointer-events-none">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Click để chọn: <strong className="text-white">{hoveredZoneName}</strong></span>
        </div>
      )}

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Actuator Active Status Badges */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Wind className={`w-3.5 h-3.5 ${fanActive ? 'text-sky-400 animate-spin' : 'text-slate-500'}`} />
            <span>Quạt HAF: <strong className={fanActive ? 'text-sky-300' : 'text-slate-400'}>{fanActive ? '75% RPM' : 'TẮT'}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Droplets className={`w-3.5 h-3.5 ${mistActive ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
            <span>Phun sương: <strong className={mistActive ? 'text-cyan-300' : 'text-slate-400'}>{mistActive ? 'BẬT' : 'CHỜ'}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sun className={`w-3.5 h-3.5 ${ledActive ? 'text-pink-400' : 'text-slate-500'}`} />
            <span>LED DLI: <strong className={ledActive ? 'text-pink-300' : 'text-slate-400'}>{ledActive ? '65%' : 'TẮT'}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Mái che: <strong className="text-amber-300">{shadePercent}%</strong></span>
          </div>
        </div>

        {/* Interaction hints & 3D thermal particles toggle */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto text-xs text-slate-400">
          <span className="hidden sm:inline">Giữ chuột kéo để xoay 360° | Cuộn chuột để zoom</span>
          <button
            onClick={() => setShowHeatParticles(!showHeatParticles)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
              showHeatParticles
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showHeatParticles ? 'Ẩn Hạt Nhiệt' : 'Hiện Hạt Nhiệt 3D'}
          </button>
        </div>
      </div>
    </div>
  );
};
