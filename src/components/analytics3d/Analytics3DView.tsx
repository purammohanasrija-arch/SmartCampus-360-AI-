import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  BarChart3, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Layers, 
  Play, 
  Pause, 
  TrendingUp,
  Building2,
  Award,
  CheckCircle2,
  Volume2,
  VolumeX,
  Compass,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  Flame,
  Radio,
  Sliders,
  Maximize2,
  Tag,
  Type,
  Filter,
  Info,
  Maximize,
  HelpCircle
} from 'lucide-react';
import { Department } from '../../types/campus';

interface Analytics3DViewProps {
  departments: Department[];
}

export type MatrixDatasetKey = 'academic' | 'faculty' | 'infrastructure';
export type PillarShape = 'hex' | 'box' | 'cylinder';
export type LabelVisibilityMode = 'all' | 'axes' | 'off';

interface PillarData {
  id: string;
  deptCode: string;
  deptName: string;
  metricLabel: string;
  metricKey: string;
  value: number; // 0 to 100
  rawDisplay: string;
  benchmarkTarget: number;
  isAboveTarget: boolean;
  deltaTarget: number;
  color: number;
  row: number; // 0 to 4 (departments)
  col: number; // 0 to 3 (metrics)
  facultyChair: string;
  studentCohort: number;
}

const DATASET_METRICS: Record<MatrixDatasetKey, { 
  title: string; 
  subtitle: string; 
  xAxisLabel: string;
  yAxisLabel: string;
  zAxisLabel: string;
  metrics: { key: string; label: string; unit: string; target: number; description: string }[] 
}> = {
  academic: {
    title: 'Academic & Student Success Matrix',
    subtitle: 'Cross-departmental attendance, GPA cohorts, career placements & research publications',
    xAxisLabel: 'Academic Departments (5 Faculties)',
    yAxisLabel: 'Achievement Score (0% – 100% Extrusion)',
    zAxisLabel: 'Evaluation Indices (Attendance, GPA, Placement, Research)',
    metrics: [
      { key: 'attendance', label: 'Attendance Rate', unit: '%', target: 75, description: 'Mandatory session attendance compliance across full semester ledger' },
      { key: 'gpa', label: 'Average GPA', unit: '/ 10', target: 80, description: 'Weighted cumulative grade point average across all active scholars' },
      { key: 'placement', label: 'Placement Rate', unit: '%', target: 85, description: 'Corporate campus hiring rate and verified job offers received' },
      { key: 'research', label: 'Research Index', unit: 'pts', target: 70, description: 'Peer-reviewed IEEE / Nature publications & faculty citations' }
    ]
  },
  faculty: {
    title: 'Faculty & Innovation Index',
    subtitle: 'Research grants secured, patent filings, teaching ratings & doctoral mentorship',
    xAxisLabel: 'Academic Departments (5 Faculties)',
    yAxisLabel: 'Faculty Output Score (0% – 100% Extrusion)',
    zAxisLabel: 'Innovation Criteria (Grants, Patents, Ratings, Mentorship)',
    metrics: [
      { key: 'grants', label: 'Grant Funding ($M)', unit: 'M', target: 75, description: 'Competitive external research funding secured from NSF, DARPA & industry' },
      { key: 'patents', label: 'Patent Filings', unit: 'filed', target: 65, description: 'Intellectual property disclosures and provisional university patent filings' },
      { key: 'teaching', label: 'Student Rating', unit: '/ 5.0', target: 85, description: 'Student course feedback and pedagogy excellence evaluations' },
      { key: 'mentorship', label: 'Doctoral Advising', unit: 'scholars', target: 70, description: 'PhD candidates mentored and post-doctoral research fellows advised' }
    ]
  },
  infrastructure: {
    title: 'Smart Campus Resource & Compute Matrix',
    subtitle: 'AI supercomputer allocation, cleanroom usage, smart lab seats & microgrid efficiency',
    xAxisLabel: 'Academic Departments (5 Faculties)',
    yAxisLabel: 'Resource Saturation (0% – 100% Extrusion)',
    zAxisLabel: 'Infrastructure Facilities (GPUs, Cleanroom, Seats, Microgrid)',
    metrics: [
      { key: 'compute', label: 'GPU Cluster Load', unit: '%', target: 80, description: 'NVIDIA H100 GPU compute cluster utilization for AI/ML workloads' },
      { key: 'cleanroom', label: 'Cleanroom ISO Yield', unit: '%', target: 75, description: 'ISO Class 4 quantum fabrication cleanroom operational uptime' },
      { key: 'library', label: 'Lab Seat Occupancy', unit: '%', target: 70, description: 'Smart ergonomic workspace and physical laboratory utilization' },
      { key: 'energy', label: 'Solar Eco Efficiency', unit: '%', target: 90, description: 'Microgrid photovoltaic solar yield and zero-carbon building efficiency' }
    ]
  }
};

/**
 * Creates high-DPI HTML5 Canvas text sprite for Three.js 3D billboarding.
 * Automatically faces the camera at any orbit angle.
 */
function createTextSprite({
  text,
  subtext,
  badge,
  textColor = '#ffffff',
  bgColor = 'rgba(10, 15, 30, 0.92)',
  borderColor = '#8b5cf6',
  width = 512,
  height = 160,
  scale = 5.2
}: {
  text: string;
  subtext?: string;
  badge?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  scale?: number;
}): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  // Draw cybernetic rounded card background
  const r = 24;
  const x = 8;
  const y = 8;
  const w = canvas.width - 16;
  const h = canvas.height - 16;

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;

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

  // Draw optional badge pill
  if (badge) {
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.arc(36, 40, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw primary title
  ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = subtext ? 'middle' : 'middle';

  if (subtext) {
    ctx.fillText(text, canvas.width / 2, 54);
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(subtext, canvas.width / 2, 108);
  } else {
    ctx.fillText(text, canvas.width / 2, 80);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(scale, scale * (height / width), 1);
  return sprite;
}

export function Analytics3DView({ departments }: Analytics3DViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // State controls
  const [activeDataset, setActiveDataset] = useState<MatrixDatasetKey>('academic');
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<PillarData | null>(null);
  const [hoveredDeptRow, setHoveredDeptRow] = useState<number | null>(null);
  const [colorTheme, setColorTheme] = useState<'cyber' | 'emerald' | 'amber' | 'ice'>('cyber');
  const [pillarShape, setPillarShape] = useState<PillarShape>('hex');
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isKineticWave, setIsKineticWave] = useState(false); // Default to stable for easier inspection
  const [showBenchmarkPlane, setShowBenchmarkPlane] = useState(true);
  const [showHeightRuler, setShowHeightRuler] = useState(true);
  const [labelsMode, setLabelsMode] = useState<LabelVisibilityMode>('all');
  const [heightMultiplier, setHeightMultiplier] = useState(1.1);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front' | 'cinematic'>('iso');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [growthSimulated, setGrowthSimulated] = useState(0);
  const [focusedDeptRow, setFocusedDeptRow] = useState<number | null>(null);

  // Web Audio Context reference for futuristic harmonic chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle harmonic chime on interaction
  const playSynthesizedChime = (freq: number) => {
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
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay handled
    }
  };

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pillarsGroupRef = useRef<THREE.Group | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);
  const deptBeamRef = useRef<THREE.Line | null>(null);
  const benchmarkPlaneRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // Orbit parameters
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraDistance = useRef(42);
  const cameraTheta = useRef(0.75);
  const cameraPhi = useRef(0.85);
  const cameraTarget = useRef(new THREE.Vector3(0, 4, 0));

  // Build grid data dynamically
  const gridData: PillarData[] = useMemo(() => {
    const list: PillarData[] = [];
    const deptList = departments.slice(0, 5);
    const datasetInfo = DATASET_METRICS[activeDataset];

    deptList.forEach((dept, rIdx) => {
      datasetInfo.metrics.forEach((met, cIdx) => {
        let baseVal = 70;
        let raw = '';

        if (activeDataset === 'academic') {
          if (met.key === 'attendance') {
            baseVal = 82 + ((rIdx * 3.7) % 15);
            raw = `${baseVal.toFixed(1)}%`;
          } else if (met.key === 'gpa') {
            baseVal = 76 + ((rIdx * 4.3) % 20);
            raw = `${(baseVal / 10).toFixed(2)} / 10`;
          } else if (met.key === 'placement') {
            baseVal = 74 + ((rIdx * 5.5) % 22);
            raw = `${baseVal.toFixed(1)}%`;
          } else {
            baseVal = 68 + ((rIdx * 6.2) % 28);
            raw = `${Math.round(baseVal * 14)} citations`;
          }
        } else if (activeDataset === 'faculty') {
          if (met.key === 'grants') {
            baseVal = 65 + ((rIdx * 7.1) % 30);
            raw = `$${(baseVal * 0.05).toFixed(2)}M`;
          } else if (met.key === 'patents') {
            baseVal = 60 + ((rIdx * 8.4) % 32);
            raw = `${Math.round(baseVal / 4)} Filed`;
          } else if (met.key === 'teaching') {
            baseVal = 80 + ((rIdx * 3.9) % 18);
            raw = `${(baseVal / 20).toFixed(2)} / 5.0`;
          } else {
            baseVal = 70 + ((rIdx * 5.2) % 25);
            raw = `${Math.round(baseVal * 0.45)} Scholars`;
          }
        } else {
          // infrastructure
          if (met.key === 'compute') {
            baseVal = 84 + ((rIdx * 3.3) % 14);
            raw = `${baseVal.toFixed(1)}% Active`;
          } else if (met.key === 'cleanroom') {
            baseVal = 78 + ((rIdx * 4.5) % 18);
            raw = `ISO Class ${rIdx + 3}`;
          } else if (met.key === 'library') {
            baseVal = 72 + ((rIdx * 5.1) % 24);
            raw = `${baseVal.toFixed(1)}% Capacity`;
          } else {
            baseVal = 88 + ((rIdx * 2.8) % 11);
            raw = `${(baseVal * 5.2).toFixed(0)} kW Net`;
          }
        }

        // Apply simulated growth if activated
        const finalVal = Math.min(100, baseVal + growthSimulated);
        const delta = Number((finalVal - met.target).toFixed(1));

        let color = 0x8b5cf6;
        if (colorTheme === 'emerald') {
          color = cIdx === 0 ? 0x10b981 : cIdx === 1 ? 0x059669 : cIdx === 2 ? 0x34d399 : 0x2dd4bf;
        } else if (colorTheme === 'amber') {
          color = cIdx === 0 ? 0xf59e0b : cIdx === 1 ? 0xd97706 : cIdx === 2 ? 0xfbbf24 : 0xf97316;
        } else if (colorTheme === 'ice') {
          color = cIdx === 0 ? 0x38bdf8 : cIdx === 1 ? 0x0ea5e9 : cIdx === 2 ? 0x818cf8 : 0x06b6d4;
        } else {
          // Cyber neon violet / pink / cyan
          color = cIdx === 0 ? 0x8b5cf6 : cIdx === 1 ? 0x06b6d4 : cIdx === 2 ? 0xec4899 : 0x6366f1;
        }

        list.push({
          id: `${dept.code}-${met.key}`,
          deptCode: dept.code,
          deptName: dept.name,
          metricLabel: met.label,
          metricKey: met.key,
          value: finalVal,
          rawDisplay: raw,
          benchmarkTarget: met.target,
          isAboveTarget: finalVal >= met.target,
          deltaTarget: delta,
          color,
          row: rIdx,
          col: cIdx,
          facultyChair: dept.headOfDepartment || 'Chair Academic Council',
          studentCohort: dept.studentCount || 420
        });
      });
    });

    return list;
  }, [departments, activeDataset, colorTheme, growthSimulated]);

  // Set default selected pillar on initial load
  useEffect(() => {
    if (gridData.length > 0 && !selectedPillar) {
      setSelectedPillar(gridData[0]);
    }
  }, [gridData]);

  // Focus on a specific department row and update camera angle
  const handleFocusDepartment = (rowIdx: number) => {
    setFocusedDeptRow(rowIdx);
    const spacingX = 4.8;
    const offsetX = (5 - 1) * spacingX * 0.5;
    const targetX = rowIdx * spacingX - offsetX;
    cameraTarget.current.set(targetX, 4, 0);
    cameraTheta.current = 0.5;
    cameraDistance.current = 32;
    updateCamera();

    const matching = gridData.find(g => g.row === rowIdx);
    if (matching) {
      setSelectedPillar(matching);
      playSynthesizedChime(260 + rowIdx * 80);
    }
  };

  // Initialize and mount Three.js WebGL scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. SCENE WITH DEEP SPACE AMBIENCE & VOLUMETRIC FOG
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.015);

    // 2. PERSPECTIVE CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    cameraRef.current = camera;
    updateCamera();

    // 3. HIGH-PERFORMANCE WEBGL RENDERER
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance',
      stencil: false
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. SCI-FI LIGHTING SUITE
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(24, 45, 24);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    rimLight.position.set(-20, 20, -20);
    scene.add(rimLight);

    // Pulsing central dynamic pointlight
    const pointLight = new THREE.PointLight(0xa855f7, 3.0, 70);
    pointLight.position.set(0, 16, 0);
    scene.add(pointLight);

    // 5. CYBERNETIC CIRCULAR STAGE & NEON COORDINATE GRID
    const gridHelper = new THREE.GridHelper(38, 19, 0x7c3aed, 0x1e1b4b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Cylindrical Floating Stage
    const stageGeo = new THREE.CylinderGeometry(21, 22, 1.2, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x090e1a,
      roughness: 0.4,
      metalness: 0.6
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.6;
    stage.receiveShadow = true;
    scene.add(stage);

    // Glowing Concentric Coordinate Rings
    const ringGeo = new THREE.RingGeometry(19.5, 20.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.03;
    scene.add(ring);

    // 6. BENCHMARK LASER TARGET PLANE (80% GOAL LINE)
    const benchmarkTargetHeight = (80 / 100) * 12 * heightMultiplier;
    const planeGeo = new THREE.PlaneGeometry(28, 28);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      wireframe: false
    });
    const benchmarkPlane = new THREE.Mesh(planeGeo, planeMat);
    benchmarkPlane.rotation.x = Math.PI / 2;
    benchmarkPlane.position.y = benchmarkTargetHeight;
    benchmarkPlane.visible = showBenchmarkPlane;
    benchmarkPlaneRef.current = benchmarkPlane;
    scene.add(benchmarkPlane);

    // Laser wire perimeter for the benchmark line
    const planeWireGeo = new THREE.EdgesGeometry(planeGeo);
    const planeWireMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7
    });
    const planeWire = new THREE.LineSegments(planeWireGeo, planeWireMat);
    benchmarkPlane.add(planeWire);

    // 7. 3D VERTICAL HEIGHT RULER / ELEVATION TOWER (Y-AXIS)
    const heightRulerGroup = new THREE.Group();
    if (showHeightRuler) {
      const rulerX = -13.5;
      const rulerZ = 12.0;
      const rulerMaxHeight = 12 * heightMultiplier;

      // Vertical Laser Axis Pole
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, rulerMaxHeight, 16);
      const poleMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(rulerX, rulerMaxHeight / 2, rulerZ);
      heightRulerGroup.add(pole);

      // Tick markers at 0%, 25%, 50%, 75%, 100%
      [0, 25, 50, 75, 100].forEach(pct => {
        const tickY = (pct / 100) * rulerMaxHeight;
        const tickGeo = new THREE.BoxGeometry(0.8, 0.08, 0.8);
        const tickMat = new THREE.MeshBasicMaterial({ 
          color: pct === 75 || pct === 100 ? 0x38bdf8 : 0xfbbf24 
        });
        const tick = new THREE.Mesh(tickGeo, tickMat);
        tick.position.set(rulerX, tickY, rulerZ);
        heightRulerGroup.add(tick);

        const tickSprite = createTextSprite({
          text: `${pct}%`,
          textColor: pct >= 75 ? '#38bdf8' : '#fbbf24',
          bgColor: 'rgba(15, 23, 42, 0.85)',
          borderColor: pct >= 75 ? '#06b6d4' : '#f59e0b',
          width: 220,
          height: 100,
          scale: 1.8
        });
        tickSprite.position.set(rulerX - 1.2, tickY, rulerZ);
        heightRulerGroup.add(tickSprite);
      });

      // Top Y-Axis Crown Title Sprite
      const yAxisTitleSprite = createTextSprite({
        text: '▲ Y-AXIS: METRIC MAGNITUDE',
        subtext: '0% – 100% Volumetric Extrusion Height',
        textColor: '#fbbf24',
        bgColor: 'rgba(20, 15, 5, 0.94)',
        borderColor: '#f59e0b',
        scale: 4.8
      });
      yAxisTitleSprite.position.set(rulerX, rulerMaxHeight + 1.8, rulerZ);
      heightRulerGroup.add(yAxisTitleSprite);
    }
    scene.add(heightRulerGroup);

    // 8. AMBIENT FLOATING CYBER PARTICLES (250 STARS)
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 44;
      particlePositions[i + 1] = Math.random() * 26;
      particlePositions[i + 2] = (Math.random() - 0.5) * 44;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.4,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 9. 3D VOLUMETRIC HOLOGRAPHIC PILLARS
    const pillarsGroup = new THREE.Group();
    pillarsGroupRef.current = pillarsGroup;
    meshesRef.current = [];

    const spacingX = 4.8;
    const spacingZ = 4.8;
    const offsetX = (5 - 1) * spacingX * 0.5;
    const offsetZ = (4 - 1) * spacingZ * 0.5;

    gridData.forEach((item) => {
      const targetHeight = Math.max(0.6, (item.value / 100) * 12 * heightMultiplier);
      const posX = item.row * spacingX - offsetX;
      const posZ = item.col * spacingZ - offsetZ;

      let geo: THREE.BufferGeometry;
      if (pillarShape === 'hex') {
        geo = new THREE.CylinderGeometry(1.6, 1.6, targetHeight, 6);
      } else if (pillarShape === 'cylinder') {
        geo = new THREE.CylinderGeometry(1.5, 1.5, targetHeight, 24);
      } else {
        geo = new THREE.BoxGeometry(2.5, targetHeight, 2.5);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.15,
        metalness: 0.75,
        emissive: item.color,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.92
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(posX, targetHeight / 2, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { 
        pillarData: item,
        baseHeight: targetHeight,
        baseY: targetHeight / 2,
        baseScale: 1.0,
        phase: item.row * 0.6 + item.col * 0.4
      };

      // Glowing Neon Wireframe Edges
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.65 
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      mesh.add(wireframe);

      // Top Floating Glowing Cap with Laser Beacon
      const capGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.25, pillarShape === 'hex' ? 6 : 24);
      const capMat = new THREE.MeshBasicMaterial({ 
        color: item.isAboveTarget ? 0x38bdf8 : 0xffffff 
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = targetHeight / 2 + 0.12;
      mesh.add(cap);

      pillarsGroup.add(mesh);
      meshesRef.current.push(mesh);
    });

    scene.add(pillarsGroup);

    // ========================================================
    // 10. DESCRIPTIVE AXIS LABELS & 3D NAMES (CAMERA-FACING)
    // ========================================================
    const labelsGroup = new THREE.Group();
    labelsGroupRef.current = labelsGroup;

    if (labelsMode !== 'off') {
      const deptList = departments.slice(0, 5);
      const datasetInfo = DATASET_METRICS[activeDataset];

      // A. DESCRIPTIVE X-AXIS BANNER & INDIVIDUAL DEPARTMENT LABELS
      const xAxisTitleSprite = createTextSprite({
        text: '◄ X-AXIS: ACADEMIC DEPARTMENTS & SCHOOLS ►',
        subtext: '5 Institutional Faculties · Hover to Spotlight Cohort',
        textColor: '#c084fc',
        bgColor: 'rgba(15, 10, 30, 0.95)',
        borderColor: '#a855f7',
        scale: 6.8
      });
      xAxisTitleSprite.position.set(0, 0.7, offsetZ + 7.4);
      labelsGroup.add(xAxisTitleSprite);

      deptList.forEach((dept, rIdx) => {
        const posX = rIdx * spacingX - offsetX;
        const frontZ = offsetZ + 4.0; // ~11.2 in front

        const deptSprite = createTextSprite({
          text: `[${dept.code}] ${dept.name}`,
          subtext: `Chair: ${dept.headOfDepartment?.split(' ')[1] || 'Chair'} · ${dept.studentCount || 420} Scholars`,
          textColor: '#ffffff',
          bgColor: 'rgba(15, 23, 42, 0.94)',
          borderColor: '#a855f7',
          scale: 4.8
        });
        deptSprite.position.set(posX, 0.6, frontZ);
        labelsGroup.add(deptSprite);
      });

      // B. DESCRIPTIVE Z-AXIS BANNER & METRIC EVALUATION LABELS
      const zAxisTitleSprite = createTextSprite({
        text: '◄ Z-AXIS: MULTI-DIMENSIONAL EVALUATION INDICES ►',
        subtext: 'Attendance · GPA · Placement · Research Citations',
        textColor: '#38bdf8',
        bgColor: 'rgba(5, 20, 35, 0.95)',
        borderColor: '#06b6d4',
        scale: 6.8
      });
      zAxisTitleSprite.position.set(-offsetX - 7.6, 0.7, 0);
      labelsGroup.add(zAxisTitleSprite);

      datasetInfo.metrics.forEach((met, cIdx) => {
        const posZ = cIdx * spacingZ - offsetZ;
        const leftX = -offsetX - 4.0; // ~-13.6 on the side

        const metricSprite = createTextSprite({
          text: met.label,
          subtext: `Target: ${met.target}${met.unit} · ${met.description.slice(0, 38)}...`,
          textColor: '#38bdf8',
          bgColor: 'rgba(8, 14, 28, 0.94)',
          borderColor: '#06b6d4',
          scale: 4.6
        });
        metricSprite.position.set(leftX, 0.6, posZ);
        labelsGroup.add(metricSprite);
      });

      // C. PILLAR TOP NAMES & VALUE BADGES (WHEN 'all' MODE ACTIVE)
      if (labelsMode === 'all') {
        gridData.forEach((item) => {
          const targetHeight = Math.max(0.6, (item.value / 100) * 12 * heightMultiplier);
          const posX = item.row * spacingX - offsetX;
          const posZ = item.col * spacingZ - offsetZ;

          const pillarSprite = createTextSprite({
            text: `${item.deptCode}: ${item.rawDisplay}`,
            subtext: `${item.metricLabel} (${item.isAboveTarget ? '▲ Target Met' : '▼ Sub-target'})`,
            textColor: item.isAboveTarget ? '#38bdf8' : '#fbbf24',
            bgColor: 'rgba(10, 15, 30, 0.85)',
            borderColor: item.isAboveTarget ? '#06b6d4' : '#f59e0b',
            width: 380,
            height: 120,
            scale: 2.8
          });
          pillarSprite.position.set(posX, targetHeight + 1.4, posZ);
          labelsGroup.add(pillarSprite);
        });
      }
    }

    scene.add(labelsGroup);

    // 11. RAYCASTING & HOVER-TO-HIGHLIGHT INTERACTION CONTROLS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - prevMousePos.current.x;
        const dy = e.clientY - prevMousePos.current.y;
        prevMousePos.current = { x: e.clientX, y: e.clientY };

        cameraTheta.current -= dx * 0.007;
        cameraPhi.current = Math.max(0.12, Math.min(Math.PI / 2 - 0.04, cameraPhi.current - dy * 0.007));
        updateCamera();
      }

      // Raycast check for hover-to-highlight feedback
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesRef.current, false);

      if (intersects.length > 0) {
        const p = intersects[0].object.userData.pillarData as PillarData;
        if (p) {
          if (hoveredPillar?.id !== p.id) {
            setHoveredPillar(p);
            setHoveredDeptRow(p.row);
            playSynthesizedChime(220 + p.value * 4.5);
          }
        }
      } else {
        if (hoveredPillar !== null) {
          setHoveredPillar(null);
          setHoveredDeptRow(null);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesRef.current, false);

      if (intersects.length > 0) {
        const p = intersects[0].object.userData.pillarData as PillarData;
        if (p) {
          setSelectedPillar(p);
          setFocusedDeptRow(p.row);
          playSynthesizedChime(560);
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance.current = Math.max(18, Math.min(68, cameraDistance.current + e.deltaY * 0.045));
      updateCamera();
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 12. ANIMATION TICK LOOP WITH HOVER-TO-HIGHLIGHT LERP ANIMATIONS
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Auto-orbit camera when active
      if (isAutoSpinning && !isDraggingRef.current) {
        cameraTheta.current += delta * 0.16;
        updateCamera();
      }

      // Smooth hover-to-highlight animations on department data points
      const activeHighlightRow = hoveredDeptRow !== null ? hoveredDeptRow : focusedDeptRow;

      if (meshesRef.current.length > 0) {
        meshesRef.current.forEach(mesh => {
          const u = mesh.userData;
          const p = u.pillarData as PillarData;
          const mat = mesh.material as THREE.MeshStandardMaterial;

          const isDirectlyHovered = hoveredPillar?.id === p.id;
          const isRowHighlighted = activeHighlightRow !== null && p.row === activeHighlightRow;

          // Target scales & elevations
          let targetScaleXZ = 1.0;
          let targetElevate = 0;
          let targetEmissive = 0.35;
          let targetOpacity = 0.92;

          if (isDirectlyHovered) {
            targetScaleXZ = 1.15;
            targetElevate = 0.8;
            targetEmissive = 1.1;
            targetOpacity = 1.0;
          } else if (isRowHighlighted) {
            targetScaleXZ = 1.06;
            targetElevate = 0.35;
            targetEmissive = 0.7;
            targetOpacity = 0.96;
          } else if (activeHighlightRow !== null) {
            // Unselected departments dim out into background spotlight mode
            targetScaleXZ = 0.96;
            targetElevate = 0;
            targetEmissive = 0.08;
            targetOpacity = 0.28;
          }

          // Sine-wave dynamic kinetic wave if toggled
          let waveOffset = 0;
          if (isKineticWave) {
            waveOffset = Math.sin(elapsedTime * 2.5 + u.phase) * 0.65;
          }

          // Smooth interpolation
          mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, targetScaleXZ, 0.16);
          mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, targetScaleXZ, 0.16);
          mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, u.baseY + targetElevate + waveOffset, 0.16);
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.16);
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.16);
        });
      }

      // Rotate particle starfield
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.04;
      }

      // Pulsing central beacon
      if (pointLight) {
        pointLight.position.y = 14 + Math.sin(elapsedTime * 2) * 2.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 13. RESIZE OBSERVER
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      
      // Dispose label sprites
      labelsGroup.traverse(obj => {
        if (obj instanceof THREE.Sprite) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });

      heightRulerGroup.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        } else if (obj instanceof THREE.Sprite) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });

      renderer.dispose();
      gridHelper.dispose();
      stageGeo.dispose();
      stageMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [gridData, colorTheme, pillarShape, heightMultiplier, isKineticWave, showBenchmarkPlane, showHeightRuler, labelsMode, hoveredPillar, hoveredDeptRow, focusedDeptRow]);

  function updateCamera() {
    if (!cameraRef.current) return;
    const x = cameraDistance.current * Math.sin(cameraPhi.current) * Math.sin(cameraTheta.current);
    const y = cameraDistance.current * Math.cos(cameraPhi.current);
    const z = cameraDistance.current * Math.sin(cameraPhi.current) * Math.cos(cameraTheta.current);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(cameraTarget.current);
  }

  const applyCameraPreset = (preset: 'iso' | 'top' | 'front' | 'cinematic') => {
    setCameraPreset(preset);
    cameraTarget.current.set(0, 4, 0);
    setFocusedDeptRow(null);

    if (preset === 'iso') {
      cameraTheta.current = 0.75;
      cameraPhi.current = 0.85;
      cameraDistance.current = 42;
    } else if (preset === 'top') {
      cameraTheta.current = 0;
      cameraPhi.current = 0.15;
      cameraDistance.current = 36;
    } else if (preset === 'front') {
      cameraTheta.current = 0;
      cameraPhi.current = 1.45;
      cameraDistance.current = 38;
    } else {
      cameraTheta.current = 1.6;
      cameraPhi.current = 1.1;
      cameraDistance.current = 32;
      setIsAutoSpinning(true);
    }
    updateCamera();
    playSynthesizedChime(520);
  };

  const handleSimulateGrowth = () => {
    const nextBoost = growthSimulated >= 15 ? 0 : growthSimulated + 5;
    setGrowthSimulated(nextBoost);
    playSynthesizedChime(nextBoost > 0 ? 640 : 330);
  };

  const currentDatasetMeta = DATASET_METRICS[activeDataset];
  const deptList = departments.slice(0, 5);
  const activeDisplayPillar = hoveredPillar || selectedPillar;

  return (
    <div className="space-y-6">
      {/* 1. FUTURISTIC HEADER WITH DATASET SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Spatial Analytics Twin</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>WebGL 3D Volumetric Matrix</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-300 font-mono font-semibold">Hover-to-Highlight Active</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2.5">
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              3D Multi-Dimensional Performance Matrix
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
              NAMED AXES
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {currentDatasetMeta.subtitle}
          </p>
        </div>

        {/* Top-Right Dataset Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-xl flex-wrap">
          <button
            onClick={() => { setActiveDataset('academic'); playSynthesizedChime(440); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeDataset === 'academic' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Academic Success
          </button>
          <button
            onClick={() => { setActiveDataset('faculty'); playSynthesizedChime(490); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeDataset === 'faculty' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔬 Faculty & Research
          </button>
          <button
            onClick={() => { setActiveDataset('infrastructure'); playSynthesizedChime(540); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeDataset === 'infrastructure' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Lab & Cloud Compute
          </button>
        </div>
      </div>

      {/* 2. ADVANCED INTERACTIVE 3D CONTROLS TOOLBAR */}
      <div className="p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: Camera Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Camera:</span>
          </span>
          <button
            onClick={() => applyCameraPreset('iso')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraPreset === 'iso' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Iso 45°
          </button>
          <button
            onClick={() => applyCameraPreset('top')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraPreset === 'top' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Radar Top
          </button>
          <button
            onClick={() => applyCameraPreset('front')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraPreset === 'front' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => applyCameraPreset('cinematic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraPreset === 'cinematic' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-950 text-cyan-300 hover:text-white border border-cyan-500/30'
            }`}
          >
            Drone Sweep 🎥
          </button>
        </div>

        {/* Center: 3D Descriptive Names Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="px-2 text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>3D Axis Labels:</span>
          </span>
          <button
            onClick={() => { setLabelsMode('all'); playSynthesizedChime(460); }}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              labelsMode === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Descriptive (All)
          </button>
          <button
            onClick={() => { setLabelsMode('axes'); playSynthesizedChime(420); }}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              labelsMode === 'axes' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Axes Only
          </button>
          <button
            onClick={() => { setLabelsMode('off'); playSynthesizedChime(320); }}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              labelsMode === 'off' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-white'
            }`}
          >
            Hide
          </button>
        </div>

        {/* Right: Height Ruler & Shape & Sound & Themes */}
        <div className="flex items-center gap-2">
          {/* Height Ruler Toggle */}
          <button
            onClick={() => setShowHeightRuler(!showHeightRuler)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showHeightRuler
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle 3D Y-Axis Height Elevation Tower"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Y-Ruler</span>
          </button>

          {/* Pillar Shape */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setPillarShape('hex'); playSynthesizedChime(420); }}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                pillarShape === 'hex' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Hexagonal Prisms"
            >
              Hexagon
            </button>
            <button
              onClick={() => { setPillarShape('box'); playSynthesizedChime(450); }}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                pillarShape === 'box' ? 'bg-slate-800 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Classic Square Monoliths"
            >
              Monolith
            </button>
            <button
              onClick={() => { setPillarShape('cylinder'); playSynthesizedChime(480); }}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                pillarShape === 'cylinder' ? 'bg-slate-800 text-pink-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Smooth Cylinders"
            >
              Cylinder
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              !isAudioMuted 
                ? 'bg-slate-950 border-purple-500/40 text-purple-300' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={isAudioMuted ? 'Unmute Harmonic Chimes' : 'Mute Sound Effects'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Spin */}
          <button
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isAutoSpinning 
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title={isAutoSpinning ? 'Pause Auto Orbit' : 'Start Auto Orbit'}
          >
            {isAutoSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Theme Palette */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setColorTheme('cyber')}
              className={`w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 cursor-pointer ${colorTheme === 'cyber' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Cyber Neon Theme"
            />
            <button
              onClick={() => setColorTheme('emerald')}
              className={`w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 cursor-pointer ${colorTheme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Bioluminescent Emerald Theme"
            />
            <button
              onClick={() => setColorTheme('amber')}
              className={`w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 cursor-pointer ${colorTheme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Solar Amber Theme"
            />
            <button
              onClick={() => setColorTheme('ice')}
              className={`w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 cursor-pointer ${colorTheme === 'ice' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Glacial Ice Theme"
            />
          </div>
        </div>
      </div>

      {/* 3. DESCRIPTIVE AXIS ORIENTATION GUIDE BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/60 border border-purple-500/30 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-mono font-bold text-xs shrink-0">
            X
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentDatasetMeta.xAxisLabel}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">5 Academic Divisions (CS, ME, EE, BIO, ARCH)</p>
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 border border-amber-500/30 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono font-bold text-xs shrink-0">
            Y
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentDatasetMeta.yAxisLabel}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Vertical Height · 80% Institutional Target Line</p>
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 border border-cyan-500/30 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shrink-0">
            Z
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentDatasetMeta.zAxisLabel}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Depth Dimension · 4 Performance Evaluation Metrics</p>
          </div>
        </div>
      </div>

      {/* 4. MAIN 3D VIEWPORT WITH ON-SCREEN AXIS NAME OVERLAYS & HOVER BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D WebGL Viewport Canvas (8 Cols) */}
        <div className="lg:col-span-8 relative">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/60 transition-colors bg-slate-950 shadow-2xl shadow-purple-950/50">
            {/* Mounted Three.js Canvas Element */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* In-Canvas Top Left Hologram Status Indicator */}
            <div className="absolute top-4 left-4 p-2.5 bg-slate-950/85 backdrop-blur-md border border-purple-500/40 rounded-2xl text-xs text-slate-200 flex items-center gap-2.5 shadow-2xl pointer-events-none">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <div>
                <span className="font-bold text-white block">3D Interactive Performance Matrix</span>
                <span className="text-[10px] text-purple-300 font-mono">
                  Hover any pillar to spotlight department · Drag to orbit
                </span>
              </div>
            </div>

            {/* In-Canvas Hover Real-Time Banner Overlay */}
            {hoveredPillar && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-400/80 shadow-2xl shadow-cyan-950/80 flex items-center gap-3 animate-fadeIn pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white font-mono mr-1.5">[{hoveredPillar.deptCode}]</span>
                  <span className="text-slate-200 font-semibold">{hoveredPillar.deptName}:</span>
                  <span className="text-cyan-300 font-bold ml-1.5 font-mono">{hoveredPillar.metricLabel} = {hoveredPillar.rawDisplay}</span>
                  <span className={`ml-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    hoveredPillar.isAboveTarget ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {hoveredPillar.isAboveTarget ? `+${hoveredPillar.deltaTarget}% Target Met` : `${hoveredPillar.deltaTarget}% Deficit`}
                  </span>
                </div>
              </div>
            )}

            {/* In-Canvas Top Right Lift Simulator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleSimulateGrowth}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-xl shadow-purple-600/40 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>{growthSimulated > 0 ? `Simulated +${growthSimulated}% Lift` : 'Simulate +5% Lift'}</span>
              </button>
            </div>

            {/* In-Canvas Bottom Department Axis Name Strip (Interactive Hover-to-Highlight Rail) */}
            <div className="absolute bottom-4 left-4 right-4 p-2.5 bg-slate-950/90 backdrop-blur-md border border-purple-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-purple-400 font-bold uppercase flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Highlight Department:</span>
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {deptList.map((dept, idx) => (
                    <button
                      key={dept.id}
                      onMouseEnter={() => {
                        setHoveredDeptRow(idx);
                        playSynthesizedChime(260 + idx * 70);
                      }}
                      onMouseLeave={() => setHoveredDeptRow(null)}
                      onClick={() => handleFocusDepartment(idx)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
                        (hoveredDeptRow === idx || focusedDeptRow === idx)
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 border border-purple-300 scale-105'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                      title={`Hover to highlight or click to focus on ${dept.name}`}
                    >
                      <span className="text-purple-400 mr-1 font-black">[{dept.code}]</span>
                      <span>{dept.name.split(' ')[0]}</span>
                    </button>
                  ))}
                  {focusedDeptRow !== null && (
                    <button
                      onClick={() => { setFocusedDeptRow(null); applyCameraPreset('iso'); }}
                      className="px-2 py-1 rounded-xl text-[10px] font-mono text-cyan-300 hover:text-white bg-slate-800 border border-slate-700 cursor-pointer"
                    >
                      Reset View
                    </button>
                  )}
                </div>
              </div>

              {/* Extrusion scale control */}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
                <span className="text-slate-400 text-[10px] font-mono">Z-Scale:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.6"
                  step="0.1"
                  value={heightMultiplier}
                  onChange={e => setHeightMultiplier(Number(e.target.value))}
                  className="w-16 accent-purple-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-purple-300 font-mono font-bold text-[10px]">{heightMultiplier.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected / Hovered Pillar Telemetry Inspector HUD (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div 
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: activeDisplayPillar ? `#${activeDisplayPillar.color.toString(16).padStart(6, '0')}` : '#8b5cf6' }}
          />

          {/* HUD Header */}
          <div className="border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Pillar Telemetry Unit</span>
              </span>
              {activeDisplayPillar?.isAboveTarget && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                  Above Target
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white mt-1">
              {activeDisplayPillar ? activeDisplayPillar.deptName : 'Select or Hover Pillar'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {activeDisplayPillar ? `Chair: ${activeDisplayPillar.facultyChair} · [${activeDisplayPillar.deptCode}]` : 'Interact with 3D prism nodes to reveal metric depth.'}
            </p>
          </div>

          {activeDisplayPillar ? (
            <div className="space-y-4 relative z-10">
              {/* Primary Metric Score Box */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-purple-500/30 shadow-inner space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{activeDisplayPillar.metricLabel}</span>
                  <span className="font-mono text-purple-300">Target: {activeDisplayPillar.benchmarkTarget}%</span>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                    {activeDisplayPillar.rawDisplay}
                  </div>
                  <span className={`text-xs font-bold font-mono ${activeDisplayPillar.isAboveTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeDisplayPillar.value.toFixed(1)}% Score
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2 border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDisplayPillar.value}%` }}
                  />
                </div>
              </div>

              {/* Spatial Coordinates & Cohort Size */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">3D Axis Coordinate</span>
                  <span className="text-white font-bold">{activeDisplayPillar.deptCode} × {activeDisplayPillar.metricLabel.split(' ')[0]}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Active Scholars</span>
                  <span className="text-cyan-300 font-bold">{activeDisplayPillar.studentCohort} Scholars</span>
                </div>
              </div>

              {/* Multi-Metric Cohort Breakdown for this Department */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Department Four-Axis Balance</span>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">[{activeDisplayPillar.deptCode}] Cohort</span>
                </div>

                {currentDatasetMeta.metrics.map((met, idx) => {
                  const simulatedScore = Math.min(100, Math.round(70 + ((activeDisplayPillar.row * 5.3 + idx * 7.1) % 25) + growthSimulated));
                  return (
                    <div key={met.key} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate">{met.label}</span>
                        <span className="font-mono font-bold text-white">{simulatedScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${simulatedScore}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Callout Notice */}
              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl text-xs text-purple-200 leading-relaxed flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Hovering any department node highlights the entire cohort in 3D with spotlight illumination.</span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 space-y-2">
              <BarChart3 className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
              <p className="text-slate-400 font-semibold">Hover or click any 3D pillar</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Select a prism in the matrix to view instant 4-axis performance radar & live data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
