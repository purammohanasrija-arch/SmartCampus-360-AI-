import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  Sun, 
  Moon, 
  Sunset, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Search, 
  Building2, 
  Users, 
  Calendar, 
  Info,
  CheckCircle2,
  Sparkles,
  Plane,
  Eye,
  Zap,
  Wifi,
  Shield,
  Activity,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Sliders,
  Crosshair,
  ArrowRight,
  Navigation,
  Clock,
  Award
} from 'lucide-react';

export interface BuildingInfo {
  id: string;
  name: string;
  category: 'Academic' | 'Research' | 'Library' | 'Student Life' | 'Administration';
  position: [number, number, number];
  color: number;
  floors: number;
  rooms: string[];
  currentOccupancy: number; // percentage
  headcount: string;
  energyUsageKw: number;
  wifiConnectedDevices: number;
  temperatureC: number;
  scheduledEvents: { time: string; title: string; room: string; instructor: string }[];
  announcements: string;
  description: string;
  keyLabs: string[];
}

export const BUILDINGS: BuildingInfo[] = [
  {
    id: 'bldg-turing',
    name: 'Alan Turing Computing & AI Pavilion',
    category: 'Research',
    position: [-14, 0, -8],
    color: 0x8b5cf6, // Violet / Purple
    floors: 5,
    rooms: ['Lab 301: Deep Learning Rig', 'Room 302: AI Lecture Hall', 'Room 304: Distributed Systems Lab', 'Room 401: Quantum Simulation Center', 'Room 501: Neuromorphic Computing Bay'],
    currentOccupancy: 82,
    headcount: '164 / 200 Seats',
    energyUsageKw: 420,
    wifiConnectedDevices: 384,
    temperatureC: 21.4,
    scheduledEvents: [
      { time: '09:00 - 10:30', title: 'CS601 Deep Neural Architectures', room: 'Room 302', instructor: 'Dr. Sarah Lin' },
      { time: '11:00 - 12:30', title: 'CS602 Distributed Tensor Computing', room: 'Lab 301', instructor: 'Prof. David Vance' },
      { time: '14:00 - 16:00', title: 'GPU Cluster Open Research Cohort', room: 'Room 401', instructor: 'AI Lab Fellows' },
      { time: '16:30 - 18:00', title: 'Robotics Kinematics Workshop', room: 'Lab 304', instructor: 'Dr. Elena Rostova' }
    ],
    announcements: 'Maintenance notice: Cluster Node-04 scheduled for firmware update at 22:00 tonight.',
    description: 'Premier computing facility housing 6 high-density GPU compute racks, robotics simulation bays, and the university AI research cohort.',
    keyLabs: ['NVIDIA H100 GPU Cluster Alpha', 'Autonomous Robotics Rig', 'Neuromorphic Silicon Testbed']
  },
  {
    id: 'bldg-alexandria',
    name: 'Alexandria Digital Library & Commons',
    category: 'Library',
    position: [0, 0, -18],
    color: 0x10b981, // Emerald Green
    floors: 4,
    rooms: ['Level 1: Collaborative Commons & Cafe', 'Level 2: Computer Science Archives', 'Level 3: Silent Research Pods', 'Level 4: Rare Manuscripts & Digital Scanners'],
    currentOccupancy: 64,
    headcount: '256 / 400 Seats',
    energyUsageKw: 185,
    wifiConnectedDevices: 512,
    temperatureC: 22.0,
    scheduledEvents: [
      { time: 'All Day', title: 'Open 24/7 for Finals & Collaborative Study', room: 'Level 1 Commons', instructor: 'Library Staff' },
      { time: '14:00 - 15:30', title: 'Advanced Research Literature Synthesis', room: 'Level 3 Pod 3B', instructor: 'Dr. Marcus Vance' },
      { time: '17:00 - 18:00', title: 'Digital Rare Manuscript Digitization Demo', room: 'Level 4 Archives', instructor: 'Curator Vance' }
    ],
    announcements: 'Reserve private group study rooms 24 hours in advance via the Digital Library portal.',
    description: 'Modernist curved glass library with over 180,000 digital volumes, quiet reading atriums, and high-speed data docking pods.',
    keyLabs: ['Digital Archives Scanner Suite', 'Silent Acoustic Pods', 'Collaborative Media Hub']
  },
  {
    id: 'bldg-main',
    name: 'Apex Central Academic Tower',
    category: 'Academic',
    position: [0, 0, 4],
    color: 0x6366f1, // Indigo
    floors: 8,
    rooms: ['Auditorium Hall A (500 cap)', 'Auditorium Hall B (300 cap)', 'Dean of Academic Affairs', 'Registrar & Student Records', 'Lecture Theatres 101-108'],
    currentOccupancy: 76,
    headcount: '610 / 800 Seats',
    energyUsageKw: 560,
    wifiConnectedDevices: 890,
    temperatureC: 22.5,
    scheduledEvents: [
      { time: '10:00 - 12:00', title: 'Dean Honor Roll Convocation & Awards', room: 'Auditorium Hall A', instructor: 'Executive Dean' },
      { time: '14:00 - 15:30', title: 'Midterm Campus-Wide Hall Inspection', room: 'Main Atrium', instructor: 'Academic Council' },
      { time: '16:00 - 17:30', title: 'Cross-Department Faculty Symposium', room: 'Auditorium Hall B', instructor: 'Provost Miller' }
    ],
    announcements: 'Student Affairs service window open until 17:00 weekdays. Walk-ins welcomed.',
    description: 'The monumental core of the campus, featuring double-height lecture halls, executive deanships, and administrative coordination offices.',
    keyLabs: ['High-Capacity Lecture Theatres', 'Executive Senate Chamber', 'Student Records Central']
  },
  {
    id: 'bldg-innovation',
    name: 'Quantum & Robotics Innovation Hub',
    category: 'Research',
    position: [15, 0, -6],
    color: 0xec4899, // Pink / Magenta
    floors: 4,
    rooms: ['Robotics Fabrication Lab', 'Cleanroom Lithography Suite', 'Autonomous Drone Cage', 'Incubator Startup Workspace'],
    currentOccupancy: 58,
    headcount: '92 / 160 Seats',
    energyUsageKw: 340,
    wifiConnectedDevices: 245,
    temperatureC: 20.8,
    scheduledEvents: [
      { time: '11:30 - 12:45', title: 'Autonomous Quadcopter Flight Calibration', room: 'Drone Cage L1', instructor: 'Robotics Guild' },
      { time: '15:00 - 16:30', title: 'Industry Sponsor Demo & VC Pitch', room: 'Incubator Workspace', instructor: 'Tesla Robotics / VC' },
      { time: '17:00 - 18:30', title: 'Cleanroom Nanofabrication Protocol Intro', room: 'Cleanroom Suite', instructor: 'Dr. Zhang' }
    ],
    announcements: 'Safety goggles and ESD protective straps required at all times in ground-floor fabrication workshops.',
    description: 'Interdisciplinary makerspace and prototype incubation center supporting corporate sponsored student ventures and quantum computing testbeds.',
    keyLabs: ['ISO Class 4 Cleanroom', 'Industrial 3D Metal Printers', 'Autonomous Flight Arena']
  },
  {
    id: 'bldg-commons',
    name: 'Student Activity Center & Arena',
    category: 'Student Life',
    position: [14, 0, 12],
    color: 0xf59e0b, // Amber
    floors: 3,
    rooms: ['Indoor Multipurpose Arena', 'Student Union Executive Offices', 'Campus Wellness & Health Clinic', 'Culinary & Dining Pavilion'],
    currentOccupancy: 45,
    headcount: '180 / 400 Seats',
    energyUsageKw: 210,
    wifiConnectedDevices: 640,
    temperatureC: 23.1,
    scheduledEvents: [
      { time: '12:00 - 13:30', title: 'Campus Community Networking Lunch', room: 'Dining Pavilion', instructor: 'Student Life' },
      { time: '17:30 - 19:30', title: 'Inter-Department Badminton & Futsal Tourney', room: 'Multipurpose Arena', instructor: 'Athletics Club' },
      { time: '20:00 - 21:30', title: 'Campus Cultural Society Film Screening', room: 'Arena Amphitheatre', instructor: 'Cinema Guild' }
    ],
    announcements: 'Flu vaccination and wellness checks available today from 10:00 to 14:00 at the health clinic.',
    description: 'Vibrant hub for clubs, intramural athletics, dining facilities, and student health services.',
    keyLabs: ['Olympic Standard Gymnasium', 'Esports Gaming Arena', 'Student Union Boardroom']
  }
];

export type CampusLayerMode = 'normal' | 'occupancy' | 'energy' | 'wifi' | 'security';
export type LightingAtmosphere = 'day' | 'sunset' | 'night' | 'rain';

/**
 * Procedural high-DPI billboard text sprite for Three.js floating labels over buildings.
 */
function createBuildingBillboardSprite(
  name: string,
  category: string,
  occupancy: number,
  colorHex: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  // Background rounded container with glassmorphism glow
  ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 5;

  const r = 20;
  const x = 6;
  const y = 6;
  const w = canvas.width - 12;
  const h = canvas.height - 12;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Category pill tag
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.roundRect(24, 20, 130, 32, 8);
  ctx.fill();

  ctx.font = 'bold 16px "SF Pro Display", -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(category.toUpperCase(), 36, 42);

  // Live occupancy badge on right
  const occColor = occupancy > 75 ? '#ef4444' : occupancy > 55 ? '#f59e0b' : '#10b981';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(canvas.width - 150, 20, 126, 32, 8);
  ctx.fill();

  ctx.fillStyle = occColor;
  ctx.font = 'bold 16px "SF Pro Display", monospace';
  ctx.fillText(`● ${occupancy}% OCC`, canvas.width - 138, 42);

  // Building Title (truncated if long)
  ctx.font = 'bold 24px "SF Pro Display", -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  const displayTitle = name.length > 28 ? name.slice(0, 26) + '...' : name;
  ctx.fillText(displayTitle, 24, 88);

  // Subtext with room count & click hint
  ctx.font = '500 16px "SF Pro Display", -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Tap to Inspect & Teleport Camera ↗', 24, 124);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(6.4, 6.4 * (160 / 512), 1);
  return sprite;
}

export function Campus3DViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Selection and interactive states
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo>(BUILDINGS[0]);
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingInfo | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // View & Layer modes
  const [lightingMode, setLightingMode] = useState<LightingAtmosphere>('sunset');
  const [activeLayer, setActiveLayer] = useState<CampusLayerMode>('normal');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [showLabels, setShowLabels] = useState(true);
  const [isExplodedView, setIsExplodedView] = useState(false);
  const [showDronePatrol, setShowDronePatrol] = useState(true);
  const [showCampusShuttle, setShowCampusShuttle] = useState(true);
  const [showPedestrians, setShowPedestrians] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cinematic Autopilot Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<'default' | 'drone' | 'shuttle' | 'birds-eye'>('default');

  // Web Audio Context for synthesized physical acoustic cues
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedChime = (freq: number, type: OscillatorType = 'sine', duration: number = 0.25) => {
    if (isAudioMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + duration * 0.5);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay handled
    }
  };

  // Three.js animation and interaction refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const floorGroupsRef = useRef<Map<string, THREE.Group[]>>(new Map());
  const billboardSpritesRef = useRef<Map<string, THREE.Sprite>>(new Map());
  const wifiDomesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const energyPulsesRef = useRef<THREE.Mesh[]>([]);
  
  // Dynamic Actors
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const shuttleGroupRef = useRef<THREE.Group | null>(null);
  const pedestrianGroupsRef = useRef<THREE.Group[]>([]);
  const rainSystemRef = useRef<THREE.Points | null>(null);
  const rippleMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    hemisphere: THREE.HemisphereLight;
  } | null>(null);

  // Mouse drag control state & Smooth Lerp Targets
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const cameraDistance = useRef(42);
  const desiredCameraDistance = useRef(42);
  const cameraTheta = useRef(0.85); // Azimuth angle
  const cameraPhi = useRef(0.8);   // Polar angle

  // Camera preset handler
  const setCameraView = (view: 'default' | 'birds-eye' | 'drone' | 'shuttle') => {
    setCameraPreset(view);
    playSynthesizedChime(540, 'triangle', 0.2);
    if (view === 'birds-eye') {
      desiredCameraTarget.current.set(0, 0, 0);
      desiredCameraDistance.current = 65;
      cameraPhi.current = 0.25;
    } else if (view === 'default') {
      desiredCameraTarget.current.set(0, 0, 0);
      desiredCameraDistance.current = 42;
      cameraPhi.current = 0.8;
      cameraTheta.current = 0.85;
    }
  };

  // Cinematic Tour Autopilot sequence
  useEffect(() => {
    if (!isTourActive) return;
    const currentBldg = BUILDINGS[tourIndex];
    focusBuilding(currentBldg, false);

    const timer = setTimeout(() => {
      setTourIndex((prev) => (prev + 1) % BUILDINGS.length);
    }, 7500);

    return () => clearTimeout(timer);
  }, [isTourActive, tourIndex]);

  // Main Scene Setup
  useEffect(() => {
    if (viewMode !== '3d' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgHex = lightingMode === 'night' ? 0x070b14 : lightingMode === 'sunset' ? 0x161028 : lightingMode === 'rain' ? 0x090f1d : 0x0f172a;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, lightingMode === 'rain' ? 0.022 : 0.014);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with SRGB & Shadow
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'night' ? 0.9 : 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xd8b4fe, 0x1e1b4b, 0.55);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    dirLight.position.set(32, 48, 22);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 140;
    dirLight.shadow.camera.left = -38;
    dirLight.shadow.camera.right = 38;
    dirLight.shadow.camera.top = 38;
    dirLight.shadow.camera.bottom = -38;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    lightsRef.current = { ambient: ambientLight, directional: dirLight, hemisphere: hemiLight };
    applyLighting(lightingMode, scene, lightsRef.current);

    // 5. Ground Quad & Natural Landscaping
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: lightingMode === 'rain' ? 0x0f1c16 : 0x14281e, 
      roughness: lightingMode === 'rain' ? 0.3 : 0.85,
      metalness: lightingMode === 'rain' ? 0.4 : 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Grass Grid Markings
    const gridHelper = new THREE.GridHelper(90, 30, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // Outer Ring Road for Campus Shuttle & Autonomous Transport
    const roadRingGeo = new THREE.RingGeometry(18.5, 22.5, 64);
    const roadMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a2333, 
      roughness: lightingMode === 'rain' ? 0.2 : 0.65,
      metalness: 0.25 
    });
    const road = new THREE.Mesh(roadRingGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.02;
    road.receiveShadow = true;
    scene.add(road);

    // Yellow Dashed Centerline for Road
    const roadLineGeo = new THREE.RingGeometry(20.4, 20.6, 64);
    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide });
    const roadLine = new THREE.Mesh(roadLineGeo, roadLineMat);
    roadLine.rotation.x = -Math.PI / 2;
    roadLine.position.y = 0.025;
    scene.add(roadLine);

    // Central Grand Quad Plaza & Kinetic Reflection Fountain
    const poolGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.4, 36);
    const poolMat = new THREE.MeshStandardMaterial({ 
      color: 0x0284c7, 
      roughness: 0.05, 
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(0, 0.2, -6);
    scene.add(pool);

    // Kinetic Water Wave Ripples
    const rippleGeo = new THREE.RingGeometry(0.5, 4.8, 32);
    const rippleMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.5 
    });
    const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
    rippleMesh.rotation.x = -Math.PI / 2;
    rippleMesh.position.set(0, 0.41, -6);
    scene.add(rippleMesh);
    rippleMeshRef.current = rippleMesh;

    // Central Quad Sculpture / Solar Kinetic Obelisk
    const obeliskGeo = new THREE.ConeGeometry(0.8, 4.5, 4);
    const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
    const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
    obelisk.position.set(0, 2.5, -6);
    scene.add(obelisk);

    // Cross-Campus Pedestrian Walkways
    const pathways = [
      { start: [-14, -8], end: [0, 4] },
      { start: [15, -6], end: [0, 4] },
      { start: [0, -18], end: [0, -6] },
      { start: [14, 12], end: [0, 4] },
      { start: [-14, -8], end: [0, -18] },
      { start: [15, -6], end: [0, -18] }
    ];

    pathways.forEach(({ start, end }) => {
      const dx = end[0] - start[0];
      const dz = end[1] - start[1];
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);

      const pathGeo = new THREE.PlaneGeometry(2.4, length);
      const pathMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.rotation.x = -Math.PI / 2;
      pathMesh.rotation.z = -angle;
      pathMesh.position.set((start[0] + end[0]) / 2, 0.03, (start[1] + end[1]) / 2);
      pathMesh.receiveShadow = true;
      scene.add(pathMesh);
    });

    // 6. Buildings Geometry, Floors, Windows, Wi-Fi Domes, Energy Lines & Billboard Sprites
    buildingMeshesRef.current.clear();
    floorGroupsRef.current.clear();
    billboardSpritesRef.current.clear();
    wifiDomesRef.current.clear();
    energyPulsesRef.current = [];

    BUILDINGS.forEach(b => {
      const bldgRoot = new THREE.Group();
      bldgRoot.position.set(...b.position);

      const isTower = b.id === 'bldg-main';
      const isLibrary = b.id === 'bldg-alexandria';
      const totalHeight = b.floors * 1.8;
      const width = isTower ? 10 : isLibrary ? 9 : 8;
      const depth = isTower ? 8 : isLibrary ? 9 : 7;

      const floorGroups: THREE.Group[] = [];
      const floorMeshes: THREE.Mesh[] = [];

      // Create individual floor slices with architectural window bands
      for (let f = 0; f < b.floors; f++) {
        const floorGroup = new THREE.Group();
        const floorY = f * 1.8;
        floorGroup.position.y = floorY;

        let sliceGeo: THREE.BufferGeometry;
        if (isLibrary) {
          sliceGeo = new THREE.CylinderGeometry(width / 2, width / 2 + 0.1, 1.6, 24);
        } else {
          sliceGeo = new THREE.BoxGeometry(width, 1.6, depth);
        }

        // Color computation based on active layer
        const sliceColor = getBuildingColorByLayer(b, activeLayer);

        const sliceMat = new THREE.MeshStandardMaterial({
          color: sliceColor,
          roughness: 0.25,
          metalness: 0.45,
          emissive: b.id === selectedBuilding?.id ? sliceColor : 0x000000,
          emissiveIntensity: b.id === selectedBuilding?.id ? 0.35 : 0.05
        });

        const sliceMesh = new THREE.Mesh(sliceGeo, sliceMat);
        sliceMesh.position.y = 0.8;
        sliceMesh.castShadow = true;
        sliceMesh.receiveShadow = true;
        sliceMesh.userData = { buildingId: b.id, floorIndex: f };
        floorGroup.add(sliceMesh);
        floorMeshes.push(sliceMesh);

        // Window band on each floor
        const windowBandGeo = isLibrary
          ? new THREE.CylinderGeometry(width / 2 + 0.05, width / 2 + 0.05, 0.55, 24)
          : new THREE.BoxGeometry(width + 0.1, 0.55, depth + 0.1);

        const windowBandMat = new THREE.MeshStandardMaterial({
          color: 0x93c5fd,
          emissive: lightingMode === 'night' ? 0x60a5fa : 0x38bdf8,
          emissiveIntensity: lightingMode === 'night' ? 0.9 : 0.25,
          roughness: 0.1,
          metalness: 0.9
        });
        const windowBand = new THREE.Mesh(windowBandGeo, windowBandMat);
        windowBand.position.y = 0.8;
        floorGroup.add(windowBand);

        // Floor dividing concrete slab
        const slabGeo = isLibrary
          ? new THREE.CylinderGeometry(width / 2 + 0.15, width / 2 + 0.15, 0.2, 24)
          : new THREE.BoxGeometry(width + 0.2, 0.2, depth + 0.2);
        const slabMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.y = 1.6;
        floorGroup.add(slab);

        bldgRoot.add(floorGroup);
        floorGroups.push(floorGroup);
      }

      // Rooftop Features (Dome, Solar Array, or Helipad)
      if (isLibrary) {
        const domeGeo = new THREE.SphereGeometry(width / 2 - 0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0x93c5fd,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.45,
          roughness: 0.1,
          metalness: 0.9
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = totalHeight;
        bldgRoot.add(dome);
      } else {
        // Solar Panel Grid on Roof
        const solarGeo = new THREE.BoxGeometry(width * 0.8, 0.25, depth * 0.8);
        const solarMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.2,
          roughness: 0.2,
          metalness: 0.9
        });
        const solarPanel = new THREE.Mesh(solarGeo, solarMat);
        solarPanel.position.y = totalHeight + 0.15;
        bldgRoot.add(solarPanel);

        // Antenna beacon
        const antGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8);
        const antMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.8 });
        const ant = new THREE.Mesh(antGeo, antMat);
        ant.position.set(0, totalHeight + 1.2, 0);
        bldgRoot.add(ant);
      }

      // Interactive Ground Glow Beacon
      const beaconGeo = new THREE.RingGeometry(width * 0.75, width * 0.9, 36);
      const beaconMat = new THREE.MeshBasicMaterial({ 
        color: b.color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: b.id === selectedBuilding?.id ? 0.9 : 0.25 
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.rotation.x = -Math.PI / 2;
      beacon.position.y = 0.05;
      bldgRoot.add(beacon);

      // Wi-Fi 7 Holographic Sphere Dome (visible in wifi layer)
      const wifiSphereGeo = new THREE.SphereGeometry(width * 1.1, 24, 16);
      const wifiSphereMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: activeLayer === 'wifi' ? 0.4 : 0
      });
      const wifiDome = new THREE.Mesh(wifiSphereGeo, wifiSphereMat);
      wifiDome.position.y = totalHeight / 2;
      bldgRoot.add(wifiDome);
      wifiDomesRef.current.set(b.id, wifiDome);

      // Billboard Text Sprite floating above building
      const hexString = '#' + b.color.toString(16).padStart(6, '0');
      const billboardSprite = createBuildingBillboardSprite(b.name, b.category, b.currentOccupancy, hexString);
      billboardSprite.position.set(0, totalHeight + 3.2, 0);
      billboardSprite.visible = showLabels;
      billboardSprite.userData = { buildingId: b.id };
      bldgRoot.add(billboardSprite);
      billboardSpritesRef.current.set(b.id, billboardSprite);

      scene.add(bldgRoot);
      buildingMeshesRef.current.set(b.id, floorMeshes);
      floorGroupsRef.current.set(b.id, floorGroups);
    });

    // 7. Kinetic Campus Energy Pulses (Visible in energy layer)
    const pulseGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 });
    for (let i = 0; i < 12; i++) {
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.set(0, 0.4, 0);
      scene.add(pulseMesh);
      energyPulsesRef.current.push(pulseMesh);
    }

    // 8. Landscaping Trees & Lamp Posts
    const treeGeo = new THREE.ConeGeometry(0.9, 2.4, 7);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 7);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    const treePositions = [
      [-6, 0, -2], [-8, 0, -5], [-7, 0, 8], [6, 0, -2], [8, 0, -4],
      [7, 0, 7], [-2, 0, 10], [3, 0, 11], [-18, 0, 4], [18, 0, 3],
      [-10, 0, -14], [10, 0, -14], [-12, 0, 14], [8, 0, 16]
    ];

    treePositions.forEach(([tx, ty, tz]) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, ty, tz);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.45;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliage = new THREE.Mesh(treeGeo, treeMat);
      foliage.position.y = 1.7;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      scene.add(treeGroup);
    });

    // Smart Solar LED Lamp Posts along walkways
    const lampGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const lampHeadGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const lampHeadMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: lightingMode === 'night' || lightingMode === 'sunset' ? 1.5 : 0.1
    });

    const lampPositions = [
      [-5, 0, 1], [5, 0, 1], [0, 0, -1], [0, 0, -12],
      [-10, 0, -3], [10, 0, -2], [8, 0, 8], [-8, 0, 5]
    ];

    lampPositions.forEach(([lx, ly, lz]) => {
      const lamp = new THREE.Group();
      lamp.position.set(lx, ly, lz);

      const pole = new THREE.Mesh(lampGeo, lampMat);
      pole.position.y = 1.6;
      lamp.add(pole);

      const bulb = new THREE.Mesh(lampHeadGeo, lampHeadMat);
      bulb.position.y = 3.2;
      lamp.add(bulb);

      scene.add(lamp);
    });

    // 9. Autonomous Drone Quadcopter
    const droneGroup = new THREE.Group();
    const droneBodyGeo = new THREE.BoxGeometry(1.3, 0.35, 1.3);
    const droneBodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    const droneBody = new THREE.Mesh(droneBodyGeo, droneBodyMat);
    droneGroup.add(droneBody);

    // Glowing Drone Spotlight beam
    const droneLight = new THREE.SpotLight(0x38bdf8, 4.5, 35, Math.PI / 6, 0.4);
    droneLight.position.set(0, -0.2, 0);
    droneLight.target.position.set(0, -16, 0);
    droneGroup.add(droneLight);
    droneGroup.add(droneLight.target);

    // 4 Rotors
    const rotorGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 12);
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    [[-0.65, 0.22, -0.65], [0.65, 0.22, -0.65], [-0.65, 0.22, 0.65], [0.65, 0.22, 0.65]].forEach(([rx, ry, rz]) => {
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.position.set(rx, ry, rz);
      droneGroup.add(rotor);
    });

    droneGroup.position.set(0, 15, 0);
    droneGroup.visible = showDronePatrol;
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // 10. Autonomous Campus Electric Shuttle (EV Pod)
    const shuttleGroup = new THREE.Group();
    const shuttleBodyGeo = new THREE.BoxGeometry(2.4, 1.2, 1.4);
    const shuttleBodyMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3 });
    const shuttleBody = new THREE.Mesh(shuttleBodyGeo, shuttleBodyMat);
    shuttleBody.position.y = 0.8;
    shuttleGroup.add(shuttleBody);

    // Shuttle Glass Canopy
    const shuttleGlassGeo = new THREE.BoxGeometry(2.1, 0.6, 1.45);
    const shuttleGlassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.9
    });
    const shuttleGlass = new THREE.Mesh(shuttleGlassGeo, shuttleGlassMat);
    shuttleGlass.position.y = 1.3;
    shuttleGroup.add(shuttleGlass);

    // Shuttle Headlights
    const hlGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlLeft = new THREE.Mesh(hlGeo, hlMat);
    hlLeft.position.set(1.22, 0.7, 0.4);
    const hlRight = new THREE.Mesh(hlGeo, hlMat);
    hlRight.position.set(1.22, 0.7, -0.4);
    shuttleGroup.add(hlLeft);
    shuttleGroup.add(hlRight);

    shuttleGroup.position.set(20.5, 0, 0);
    shuttleGroup.visible = showCampusShuttle;
    scene.add(shuttleGroup);
    shuttleGroupRef.current = shuttleGroup;

    // 11. Animated Student Pedestrian Avatars
    pedestrianGroupsRef.current = [];
    const studentColors = [0xef4444, 0x10b981, 0x3b82f6, 0xf59e0b, 0x8b5cf6, 0xec4899];

    for (let i = 0; i < 8; i++) {
      const studentGroup = new THREE.Group();
      const torsoGeo = new THREE.CapsuleGeometry(0.2, 0.6, 6, 8);
      const torsoMat = new THREE.MeshStandardMaterial({ color: studentColors[i % studentColors.length] });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 0.6;
      studentGroup.add(torso);

      const headGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.15;
      studentGroup.add(head);

      const backpackGeo = new THREE.BoxGeometry(0.22, 0.32, 0.15);
      const backpackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const backpack = new THREE.Mesh(backpackGeo, backpackMat);
      backpack.position.set(0, 0.65, -0.16);
      studentGroup.add(backpack);

      studentGroup.visible = showPedestrians;
      scene.add(studentGroup);
      pedestrianGroupsRef.current.push(studentGroup);
    }

    // 12. Digital Motes / Ambient Particles
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 65;
      particlePositions[i + 1] = Math.random() * 26 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 65;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: lightingMode === 'night' ? 0x38bdf8 : lightingMode === 'sunset' ? 0xf472b6 : 0xa855f7,
      size: 0.65,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 13. Animated Rain System (if rain mode)
    if (lightingMode === 'rain') {
      const rainCount = 1200;
      const rainGeo = new THREE.BufferGeometry();
      const rainPos = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount * 3; i += 3) {
        rainPos[i] = (Math.random() - 0.5) * 70;
        rainPos[i + 1] = Math.random() * 35;
        rainPos[i + 2] = (Math.random() - 0.5) * 70;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
      const rainMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.35,
        transparent: true,
        opacity: 0.6
      });
      const rain = new THREE.Points(rainGeo, rainMat);
      scene.add(rain);
      rainSystemRef.current = rain;
    }

    // 14. Mouse Drag & Raycasting Click / Hover Handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (isDraggingRef.current) {
        const dx = clientX - prevMousePos.current.x;
        const dy = clientY - prevMousePos.current.y;
        prevMousePos.current = { x: clientX, y: clientY };

        cameraTheta.current -= dx * 0.007;
        cameraPhi.current = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, cameraPhi.current - dy * 0.007));
      }

      // Hover Raycasting
      mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes: THREE.Mesh[] = [];
      buildingMeshesRef.current.forEach((mList) => allMeshes.push(...mList));

      const intersects = raycaster.intersectObjects(allMeshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const bId = hit.userData.buildingId;
        const found = BUILDINGS.find(b => b.id === bId);
        if (found) {
          setHoveredBuilding(found);
          setTooltipPos({ x: clientX - rect.left, y: clientY - rect.top });
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredBuilding(null);
      setTooltipPos(null);
      container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (container) container.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      desiredCameraDistance.current = Math.max(14, Math.min(80, desiredCameraDistance.current + e.deltaY * 0.04));
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check click on building meshes or billboard sprites
      const clickableObjects: THREE.Object3D[] = [];
      buildingMeshesRef.current.forEach(mList => clickableObjects.push(...mList));
      billboardSpritesRef.current.forEach(s => clickableObjects.push(s));

      const intersects = raycaster.intersectObjects(clickableObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const bId = hit.userData.buildingId;
        const fIdx = hit.userData.floorIndex;
        const found = BUILDINGS.find(b => b.id === bId);
        if (found) {
          focusBuilding(found);
          if (fIdx !== undefined) {
            setSelectedFloor(fIdx + 1);
          }
          playSynthesizedChime(620, 'sine', 0.3);
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // 15. Render Loop with Smooth Camera Lerping & Actor Updates
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera Lerp & Chase modes
      if (cameraPreset === 'drone' && droneGroupRef.current) {
        desiredCameraTarget.current.copy(droneGroupRef.current.position);
        desiredCameraDistance.current = 18;
      } else if (cameraPreset === 'shuttle' && shuttleGroupRef.current) {
        desiredCameraTarget.current.copy(shuttleGroupRef.current.position);
        desiredCameraDistance.current = 14;
      }

      cameraTarget.current.lerp(desiredCameraTarget.current, 0.07);
      cameraDistance.current += (desiredCameraDistance.current - cameraDistance.current) * 0.08;

      if (!isDraggingRef.current && cameraPreset === 'default' && !isTourActive) {
        cameraTheta.current += delta * 0.025;
      }
      updateCameraPosition();

      // Autonomous Flying Drone Animation
      if (droneGroupRef.current && showDronePatrol) {
        const droneRadius = 20;
        const droneSpeed = 0.45;
        const droneX = Math.cos(elapsed * droneSpeed) * droneRadius;
        const droneZ = Math.sin(elapsed * droneSpeed) * droneRadius;
        const droneY = 14 + Math.sin(elapsed * 2.5) * 0.9;
        droneGroupRef.current.position.set(droneX, droneY, droneZ);
        droneGroupRef.current.rotation.y = -elapsed * droneSpeed + Math.PI / 2;
      }

      // Autonomous Campus Electric Shuttle (EV Pod) Animation
      if (shuttleGroupRef.current && showCampusShuttle) {
        const shuttleRadius = 20.5;
        const shuttleSpeed = 0.28;
        const angle = elapsed * shuttleSpeed;
        const sx = Math.cos(angle) * shuttleRadius;
        const sz = Math.sin(angle) * shuttleRadius;
        shuttleGroupRef.current.position.set(sx, 0, sz);
        shuttleGroupRef.current.rotation.y = -angle + Math.PI / 2;
      }

      // Student Pedestrians walking paths
      if (pedestrianGroupsRef.current.length > 0 && showPedestrians) {
        pedestrianGroupsRef.current.forEach((pg, idx) => {
          const pathIdx = idx % pathways.length;
          const { start, end } = pathways[pathIdx];
          const t = (Math.sin(elapsed * 0.4 + idx * 1.2) + 1) / 2;
          const px = start[0] + (end[0] - start[0]) * t;
          const pz = start[1] + (end[1] - start[1]) * t;
          const bob = Math.abs(Math.sin(elapsed * 4 + idx)) * 0.08;
          pg.position.set(px, bob, pz);
        });
      }

      // Energy Pulse Stream Animation
      if (energyPulsesRef.current.length > 0) {
        const isEnergyActive = activeLayer === 'energy';
        energyPulsesRef.current.forEach((pMesh, pIdx) => {
          pMesh.visible = isEnergyActive;
          if (isEnergyActive) {
            const b = BUILDINGS[pIdx % BUILDINGS.length];
            const t = ((elapsed * 0.6 + pIdx * 0.15) % 1);
            pMesh.position.set(
              b.position[0] * (1 - t),
              0.4 + Math.sin(t * Math.PI) * 1.2,
              b.position[2] * (1 - t)
            );
          }
        });
      }

      // Wi-Fi Holographic Domes subtle breathing pulse
      if (activeLayer === 'wifi') {
        wifiDomesRef.current.forEach(dome => {
          const s = 1 + Math.sin(elapsed * 2) * 0.05;
          dome.scale.set(s, s, s);
        });
      }

      // Water Ripple Animation
      if (rippleMeshRef.current) {
        const scale = 1 + ((elapsed * 0.8) % 1) * 0.9;
        rippleMeshRef.current.scale.set(scale, scale, 1);
        (rippleMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - ((elapsed * 0.8) % 1));
      }

      // Digital Dust / Particles Float
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.015;
      }

      // Falling Rain Animation
      if (rainSystemRef.current) {
        const posAttr = rainSystemRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 1; i < posAttr.array.length; i += 3) {
          posAttr.array[i] -= delta * 35;
          if (posAttr.array[i] < 0) {
            posAttr.array[i] = 35;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 16. Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      roadRingGeo.dispose();
      roadMat.dispose();
      poolGeo.dispose();
      poolMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [viewMode, lightingMode, activeLayer, showLabels, showDronePatrol, showCampusShuttle, showPedestrians]);

  // Handle Exploded Floor View Animation & Floor Selection Highlighting
  useEffect(() => {
    floorGroupsRef.current.forEach((floors, bId) => {
      const isSelectedBldg = bId === selectedBuilding.id;
      floors.forEach((fg, fIdx) => {
        const targetY = isExplodedView ? fIdx * 3.4 : fIdx * 1.8;
        fg.position.y = targetY;

        // Highlight selected floor slice
        if (isSelectedBldg && selectedFloor !== null) {
          const isTargetFloor = selectedFloor === fIdx + 1;
          fg.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.opacity = isTargetFloor ? 1.0 : 0.45;
              child.material.transparent = true;
              if (isTargetFloor) {
                child.material.emissiveIntensity = 0.6;
              }
            }
          });
        } else {
          fg.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.opacity = 1.0;
              child.material.transparent = false;
            }
          });
        }
      });
    });
  }, [isExplodedView, selectedBuilding, selectedFloor]);

  // Handle Active Layer Visual Updates on Building Materials
  useEffect(() => {
    buildingMeshesRef.current.forEach((mList, bId) => {
      const b = BUILDINGS.find(item => item.id === bId);
      if (!b) return;
      const layerColor = getBuildingColorByLayer(b, activeLayer);

      mList.forEach(mesh => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.setHex(layerColor);
        const isFocused = b.id === selectedBuilding.id || b.id === hoveredBuilding?.id;
        mat.emissive.setHex(isFocused ? layerColor : 0x000000);
        mat.emissiveIntensity = isFocused ? 0.45 : 0.05;
      });
    });

    // Update Wi-Fi Domes
    wifiDomesRef.current.forEach(dome => {
      dome.visible = activeLayer === 'wifi';
      (dome.material as THREE.MeshBasicMaterial).opacity = activeLayer === 'wifi' ? 0.45 : 0;
    });
  }, [activeLayer, selectedBuilding, hoveredBuilding]);

  function getBuildingColorByLayer(b: BuildingInfo, layer: CampusLayerMode): number {
    if (layer === 'normal') {
      return b.color;
    }
    if (layer === 'occupancy') {
      return b.currentOccupancy > 75 ? 0xef4444 : b.currentOccupancy > 55 ? 0xf59e0b : 0x10b981;
    }
    if (layer === 'energy') {
      return b.energyUsageKw > 400 ? 0xf59e0b : 0x38bdf8;
    }
    if (layer === 'wifi') {
      return 0x06b6d4; // Cyan Wi-Fi Mesh
    }
    if (layer === 'security') {
      return 0x8b5cf6; // Secure Violet
    }
    return b.color;
  }

  function updateCameraPosition() {
    if (!cameraRef.current) return;
    const x = cameraDistance.current * Math.sin(cameraPhi.current) * Math.sin(cameraTheta.current);
    const y = cameraDistance.current * Math.cos(cameraPhi.current);
    const z = cameraDistance.current * Math.sin(cameraPhi.current) * Math.cos(cameraTheta.current);
    cameraRef.current.position.set(
      cameraTarget.current.x + x,
      cameraTarget.current.y + y,
      cameraTarget.current.z + z
    );
    cameraRef.current.lookAt(cameraTarget.current);
  }

  function applyLighting(mode: LightingAtmosphere, scene: THREE.Scene, lights: { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight; hemisphere: THREE.HemisphereLight }) {
    const { ambient, directional, hemisphere } = lights;

    if (mode === 'day') {
      scene.background = new THREE.Color(0x0f172a);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.85;
      directional.color.setHex(0xfffbeb);
      directional.intensity = 1.7;
      hemisphere.color.setHex(0x93c5fd);
      hemisphere.groundColor.setHex(0x1e293b);
    } else if (mode === 'sunset') {
      scene.background = new THREE.Color(0x161028);
      ambient.color.setHex(0xf3e8ff);
      ambient.intensity = 0.65;
      directional.color.setHex(0xfb923c);
      directional.intensity = 1.4;
      hemisphere.color.setHex(0xc084fc);
      hemisphere.groundColor.setHex(0x312e81);
    } else if (mode === 'night') {
      scene.background = new THREE.Color(0x070b14);
      ambient.color.setHex(0x38bdf8);
      ambient.intensity = 0.35;
      directional.color.setHex(0x818cf8);
      directional.intensity = 0.7;
      hemisphere.color.setHex(0x38bdf8);
      hemisphere.groundColor.setHex(0x030712);
    } else if (mode === 'rain') {
      scene.background = new THREE.Color(0x090f1d);
      ambient.color.setHex(0x64748b);
      ambient.intensity = 0.45;
      directional.color.setHex(0x94a3b8);
      directional.intensity = 0.9;
      hemisphere.color.setHex(0x38bdf8);
      hemisphere.groundColor.setHex(0x0f172a);
    }
  }

  const resetCamera = () => {
    desiredCameraDistance.current = 42;
    desiredCameraTarget.current.set(0, 0, 0);
    cameraTheta.current = 0.85;
    cameraPhi.current = 0.8;
    setCameraPreset('default');
    setSelectedFloor(null);
    playSynthesizedChime(440, 'sine', 0.2);
  };

  const focusBuilding = (bldg: BuildingInfo, playAudio: boolean = true) => {
    setSelectedBuilding(bldg);
    setSelectedFloor(null);
    desiredCameraTarget.current.set(bldg.position[0], 3, bldg.position[2]);
    desiredCameraDistance.current = 25;
    setCameraPreset('default');
    if (playAudio) {
      playSynthesizedChime(580, 'sine', 0.25);
    }
  };

  const filteredBuildings = BUILDINGS.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Module Title Strip with Telemetry Indicators */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Spatial Digital Twin</span>
            <span aria-hidden="true">·</span>
            <span>WebGL 3D Architecture & Multi-Layer Telemetry</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Real-time Campus Sync Active
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">SmartCampus 3D Spatial Explorer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Full-fidelity architectural twin with hover-to-inspect telemetry, animated transit loops, floor exploded views, and autonomous drone patrol.
          </p>
        </div>

        {/* View Mode & Lighting Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Autopilot Tour Button */}
          {viewMode === '3d' && (
            <button
              onClick={() => {
                const nextTourState = !isTourActive;
                setIsTourActive(nextTourState);
                if (nextTourState) {
                  playSynthesizedChime(700, 'sine', 0.35);
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                isTourActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-lg shadow-purple-600/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-purple-400" />}
              <span>{isTourActive ? 'Pause Autopilot Tour' : 'Autopilot Tour'}</span>
            </button>
          )}

          {/* Exploded Slices Toggle */}
          {viewMode === '3d' && (
            <button
              onClick={() => {
                setIsExplodedView(!isExplodedView);
                playSynthesizedChime(480, 'triangle', 0.2);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                isExplodedView 
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExplodedView ? 'Collapse Structure' : 'Explode Floors 3D'}</span>
            </button>
          )}

          {/* 3D Billboard Labels Toggle */}
          {viewMode === '3d' && (
            <button
              onClick={() => {
                setShowLabels(!showLabels);
                billboardSpritesRef.current.forEach(s => s.visible = !showLabels);
              }}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                showLabels ? 'bg-slate-800 text-cyan-300 border-cyan-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle 3D Floating Building Labels"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Labels</span>
            </button>
          )}

          {/* 3D / 2D Accessible Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === '3d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D Spatial Quad
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === '2d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2D Directory
            </button>
          </div>

          {/* Lighting / Atmosphere Toggle */}
          {viewMode === '3d' && (
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setLightingMode('day')}
                title="Bright Daylight"
                className={`p-1.5 rounded-md text-xs transition-colors ${lightingMode === 'day' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightingMode('sunset')}
                title="Sunset / Dusk"
                className={`p-1.5 rounded-md text-xs transition-colors ${lightingMode === 'sunset' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'}`}
              >
                <Sunset className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightingMode('night')}
                title="Cyberpunk Night"
                className={`p-1.5 rounded-md text-xs transition-colors ${lightingMode === 'night' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightingMode('rain')}
                title="Atmospheric Rainy Quad"
                className={`p-1.5 rounded-md text-xs transition-colors ${lightingMode === 'rain' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              >
                <CloudRain className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors ${isAudioMuted ? 'text-slate-500' : 'text-purple-300'}`}
            title={isAudioMuted ? 'Audio Muted' : 'Audio Sound Effects Active'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Camera */}
          {viewMode === '3d' && (
            <button
              onClick={resetCamera}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
              title="Reset Orbit Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Simulation Layer Selector Dock */}
      {viewMode === '3d' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-slate-300 mr-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Interactive Telemetry Layers:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveLayer('normal'); playSynthesizedChime(500); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'normal' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Architectural Reality</span>
            </button>

            <button
              onClick={() => { setActiveLayer('occupancy'); playSynthesizedChime(540); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'occupancy' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Occupancy Heatmap</span>
            </button>

            <button
              onClick={() => { setActiveLayer('energy'); playSynthesizedChime(580); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'energy' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Microgrid & Solar Pulses</span>
            </button>

            <button
              onClick={() => { setActiveLayer('wifi'); playSynthesizedChime(620); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'wifi' 
                  ? 'bg-cyan-600 text-white shadow-sm' 
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wi-Fi 7 & IoT Mesh</span>
            </button>

            <button
              onClick={() => { setActiveLayer('security'); playSynthesizedChime(660); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'security' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Perimeter & Patrol Cones</span>
            </button>
          </div>

          {/* Camera POV Shortcuts */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0 pl-3 border-l border-slate-800">
            <span className="text-[11px] text-slate-500 font-mono">POV:</span>
            <button
              onClick={() => setCameraView('default')}
              className={`px-2 py-1 text-[11px] rounded transition-colors ${cameraPreset === 'default' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              Orbit
            </button>
            <button
              onClick={() => setCameraView('birds-eye')}
              className={`px-2 py-1 text-[11px] rounded transition-colors ${cameraPreset === 'birds-eye' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              Birds-Eye
            </button>
            <button
              onClick={() => setCameraView('drone')}
              className={`px-2 py-1 text-[11px] rounded transition-colors flex items-center gap-1 ${cameraPreset === 'drone' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <Plane className="w-3 h-3" />
              <span>Drone Cam</span>
            </button>
            <button
              onClick={() => setCameraView('shuttle')}
              className={`px-2 py-1 text-[11px] rounded transition-colors flex items-center gap-1 ${cameraPreset === 'shuttle' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <Navigation className="w-3 h-3" />
              <span>Shuttle Cam</span>
            </button>
          </div>
        </div>
      )}

      {/* Autopilot Tour Progress Banner */}
      {isTourActive && (
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-purple-950/60 border border-purple-800/40 rounded-xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Guided Autopilot Tour: Step {tourIndex + 1} of {BUILDINGS.length}</span>
                <span className="text-purple-400 font-normal">({BUILDINGS[tourIndex].name})</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{BUILDINGS[tourIndex].description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setTourIndex((prev) => (prev - 1 + BUILDINGS.length) % BUILDINGS.length)}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
              title="Previous Building"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTourIndex((prev) => (prev + 1) % BUILDINGS.length)}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
              title="Next Building"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas + Building Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Canvas / 2D View (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {viewMode === '3d' ? (
            <div className="relative w-full h-[560px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              {/* Three.js Canvas Container */}
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* In-Canvas Floating Orbit Hint */}
              <div className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-xs text-slate-300 pointer-events-none">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Drag to Orbit · Scroll to Zoom · Click Building to Teleport</span>
              </div>

              {/* Dynamic Actor Indicators */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                {showDronePatrol && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-[11px] font-mono text-cyan-300">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Quadcopter Patrol</span>
                  </div>
                )}
                {showCampusShuttle && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-[11px] font-mono text-amber-300">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>EV Shuttle Loop Active</span>
                  </div>
                )}
              </div>

              {/* Hover-to-Highlight Dynamic In-Canvas Glass HUD Tooltip */}
              {hoveredBuilding && tooltipPos && (
                <div 
                  className="absolute pointer-events-none z-30 transition-all duration-75 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-purple-500/50 shadow-2xl max-w-xs space-y-1.5"
                  style={{
                    left: `${Math.min(tooltipPos.x + 16, 520)}px`,
                    top: `${Math.min(tooltipPos.y + 16, 420)}px`
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">{hoveredBuilding.category}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      hoveredBuilding.currentOccupancy > 75 ? 'bg-red-500/20 text-red-400' :
                      hoveredBuilding.currentOccupancy > 55 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {hoveredBuilding.currentOccupancy}% Occupancy
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{hoveredBuilding.name}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    ⚡ {hoveredBuilding.energyUsageKw} kW · 📶 {hoveredBuilding.wifiConnectedDevices} IoT Nodes · 🌡️ {hoveredBuilding.temperatureC}°C
                  </p>
                  <div className="pt-1 border-t border-slate-800 text-[10px] text-purple-300 flex items-center justify-between">
                    <span>{hoveredBuilding.floors} Structural Floors</span>
                    <span className="underline font-medium">Click to Inspect →</span>
                  </div>
                </div>
              )}

              {/* Building Quick Selector Strip on Bottom of Viewport */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto py-1">
                {BUILDINGS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => focusBuilding(b)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all backdrop-blur-md border flex items-center gap-1.5 ${
                      selectedBuilding.id === b.id
                        ? 'bg-purple-600/90 text-white border-purple-400 shadow-lg scale-105'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: '#' + b.color.toString(16).padStart(6, '0') }} 
                    />
                    <span>{b.name.split(' ')[0]} {b.name.split(' ')[1]}</span>
                    <span className="text-[10px] opacity-75 font-mono">{b.currentOccupancy}%</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 2D Accessible Directory Fallback */
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Campus Facility Directory (2D Accessible)</h3>
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search building or lab..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBuildings.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBuilding(b)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedBuilding.id === b.id
                        ? 'bg-purple-950/30 border-purple-500/60 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-400">{b.category}</span>
                      <span className="text-xs text-emerald-400 font-mono tabular-nums">{b.currentOccupancy}% Occupied</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1">{b.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{b.floors} Floors · {b.rooms.length} Suites</span>
                      <span className="text-purple-400 hover:underline">Inspect Specs →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Metrics Bar below Canvas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Total Complexes
              </span>
              <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">5 Core Hubs</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">24 Total Floors 3D</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Live Occupancy
              </span>
              <div className="text-xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">65.2% Avg</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">1,302 Active On-Campus</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Microgrid Power
              </span>
              <div className="text-xl font-bold text-amber-400 mt-1 font-mono tabular-nums">1.72 MW</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Photovoltaic Net-Positive</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                Connected IoT
              </span>
              <div className="text-xl font-bold text-cyan-400 mt-1 font-mono tabular-nums">2,641 Nodes</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Wi-Fi 7 / 2.4ms Latency</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Building Telemetry, Floor Deep-Dive & Schedules (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{selectedBuilding.category}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono tabular-nums">
                {selectedBuilding.headcount}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{selectedBuilding.name}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedBuilding.description}</p>
          </div>

          {/* Interactive Floor Slices Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Interactive Floor Level:
              </span>
              {selectedFloor !== null && (
                <button
                  onClick={() => setSelectedFloor(null)}
                  className="text-[11px] text-purple-400 hover:underline"
                >
                  View All Floors
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: selectedBuilding.floors }, (_, i) => i + 1).map(fNum => (
                <button
                  key={fNum}
                  onClick={() => {
                    const next = selectedFloor === fNum ? null : fNum;
                    setSelectedFloor(next);
                    playSynthesizedChime(400 + fNum * 60, 'sine', 0.2);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                    selectedFloor === fNum
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-105'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  L{fNum}
                </button>
              ))}
            </div>
            {selectedFloor !== null && (
              <p className="text-[11px] text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-800/30">
                🔍 Inspecting Level {selectedFloor}: {selectedBuilding.rooms[(selectedFloor - 1) % selectedBuilding.rooms.length] || 'General Research Floor'}
              </p>
            )}
          </div>

          {/* Telemetry Gauge Grid (Occupancy, Energy, IoT, Temp) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Occupancy
              </span>
              <div className="text-base font-bold text-white font-mono">{selectedBuilding.currentOccupancy}%</div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${selectedBuilding.currentOccupancy}%` }} 
                />
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Power Load
              </span>
              <div className="text-base font-bold text-amber-300 font-mono">{selectedBuilding.energyUsageKw} kW</div>
              <span className="text-[10px] text-slate-500">Solar Optimized</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" /> Wi-Fi Nodes
              </span>
              <div className="text-base font-bold text-cyan-300 font-mono">{selectedBuilding.wifiConnectedDevices} Devices</div>
              <span className="text-[10px] text-slate-500">Wi-Fi 7 Mesh 99.9%</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> HVAC Temp
              </span>
              <div className="text-base font-bold text-purple-300 font-mono">{selectedBuilding.temperatureC} °C</div>
              <span className="text-[10px] text-slate-500">Climate Controlled</span>
            </div>
          </div>

          {/* Scheduled Sessions Today */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Live Academic Schedule
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{selectedBuilding.scheduledEvents.length} Classes Today</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedBuilding.scheduledEvents.map((evt, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-300 text-[11px] font-medium">{evt.time}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">{evt.room}</span>
                  </div>
                  <div className="font-medium text-white text-xs">{evt.title}</div>
                  <div className="text-[11px] text-slate-400">Instructor: {evt.instructor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Rooms & Suites Directory */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Key Research Facilities & Laboratories</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-400 font-mono">
              {selectedBuilding.keyLabs.map((lab, idx) => (
                <div key={idx} className="px-2.5 py-1.5 bg-slate-950/40 border border-slate-800/80 rounded flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">{lab}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Notice & Announcements */}
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-purple-300">
              <Info className="w-3.5 h-3.5" />
              <span>Operational Notice</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{selectedBuilding.announcements}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
