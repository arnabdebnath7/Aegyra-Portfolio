/* ==========================================================================
   AEGYRA: THREE.JS + WEBGL 2.5D SHADER STAGE & CELESTIAL BOLIDE IMPACT
   - Celestial Bolide (Meteor) streak, ember particle physics, and golden
     caldera impact shockwave awakening the valley.
   - Custom GLSL Vertex & Fragment Shader 2.5D depth-map displacement plane
     plus multi-layer architectural archway planes and waterfall cascades.
   - GSAP + ScrollTrigger scrub integration + mobile touch/gyroscope parallax.
   ========================================================================== */

import {
  renderClassicalMattePlate,
  renderDepthMapCanvas,
  STEGO_SIGNATURE
} from "./assets-engine.js";

export class AegyraWebGLStage {
  constructor(canvasElement, onBolideImpactCallback) {
    this.canvas = canvasElement;
    this.onBolideImpact = onBolideImpactCallback;
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.shockwaveProgress = 0;
    this.bolidePhase = 0; // 0 -> 1 bolide flight, 1 -> impact
    this.impactTriggered = false;
    this.biomeIndex = 0;
    this.targetBiomeIndex = 0;
    this.clock = null;

    this.initStage();
  }

  initStage() {
    const THREE = window.THREE;
    if (!THREE) return;

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 5.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true // Required so steganographic inspector can sample pixels
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 1. Synthesize high-resolution classical oil matte texture & Z-depth map
    this.mainMatteCanvas = document.createElement("canvas");
    this.mainMatteCanvas.width = 1280;
    this.mainMatteCanvas.height = 800;
    renderClassicalMattePlate(this.mainMatteCanvas, "citadel");

    const depthCanvas = renderDepthMapCanvas(1024, 640);

    const colorTex = new THREE.CanvasTexture(this.mainMatteCanvas);
    colorTex.minFilter = THREE.LinearFilter;
    colorTex.magFilter = THREE.LinearFilter;

    const depthTex = new THREE.CanvasTexture(depthCanvas);
    depthTex.minFilter = THREE.LinearFilter;
    depthTex.magFilter = THREE.LinearFilter;

    // 2. Custom GLSL 2.5D Depth-Displacement & Atmospheric Shader
    this.uniforms = {
      uColorMap: { value: colorTex },
      uDepthMap: { value: depthTex },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uShockwave: { value: 0 },
      uAwakening: { value: 0.18 }, // Starts in nocturnal state before bolide impact
      uBiomeTint: { value: new THREE.Vector3(1.0, 0.96, 0.88) }
    };

    const vertexShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform sampler2D uDepthMap;
      uniform vec2 uPointer;
      uniform float uScroll;
      uniform float uShockwave;

      void main() {
        vUv = uv;
        float depth = texture2D(uDepthMap, uv).r;

        // 2.5D Z-displacement driven by depth map, scroll camera push, and pointer tilt
        vec3 pos = position;
        float zShift = (depth - 0.5) * 0.85;
        pos.z += zShift;
        pos.x += (depth - 0.5) * uPointer.x * 0.28;
        pos.y += (depth - 0.5) * uPointer.y * 0.20;

        // Radial ripple from Celestial Bolide impact
        float distToImpact = distance(uv, vec2(0.52, 0.56));
        float waveRing = exp(-pow((distToImpact - uShockwave * 0.95) * 14.0, 2.0));
        float waveAmp = sin((distToImpact - uShockwave) * 38.0) * waveRing * (1.0 - uShockwave) * 0.22;
        pos.z += waveAmp;

        vElevation = depth + waveRing * 0.35;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform sampler2D uColorMap;
      uniform sampler2D uDepthMap;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uScroll;
      uniform float uShockwave;
      uniform float uAwakening;
      uniform vec3 uBiomeTint;

      void main() {
        float depth = texture2D(uDepthMap, vUv).r;

        // Subtle 2.5D UV refraction parallax
        vec2 parallaxUv = vUv + uPointer * (depth - 0.45) * 0.026;

        // Animated waterfall flow in the citadel cliff zone
        float waterfallMask = smoothstep(0.50, 0.82, vUv.x) * smoothstep(0.22, 0.62, vUv.y) * (1.0 - smoothstep(0.62, 0.78, vUv.y));
        vec2 flowUv = parallaxUv;
        flowUv.y += sin(vUv.y * 40.0 + uTime * 3.5) * 0.0018 * waterfallMask;

        vec4 texColor = texture2D(uColorMap, clamp(flowUv, 0.002, 0.998));

        // Nocturnal pre-impact state -> Golden dawn awakening upon meteor strike
        vec3 nocturnal = texColor.rgb * vec3(0.28, 0.36, 0.52);
        vec3 sunlit = texColor.rgb * uBiomeTint;
        vec3 color = mix(nocturnal, sunlit, clamp(uAwakening, 0.0, 1.0));

        // Golden shockwave ring illumination
        float dist = distance(vUv, vec2(0.52, 0.56));
        float ring = exp(-pow((dist - uShockwave * 0.95) * 18.0, 2.0)) * (1.0 - uShockwave);
        color += vec3(0.95, 0.76, 0.38) * ring * 1.35;

        // Subtle classical vignette
        float vig = smoothstep(0.95, 0.28, distance(vUv, vec2(0.5, 0.5)));
        color *= mix(0.62, 1.04, vig);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const planeGeo = new THREE.PlaneGeometry(8.8, 5.5, 128, 96);
    const planeMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    this.valleyMesh = new THREE.Mesh(planeGeo, planeMat);
    this.scene.add(this.valleyMesh);

    // 3. Foreground 2.5D Corinthian Archway Framing Pillars (Parts as user scrolls)
    this.createArchwayFrame(THREE);

    // 4. Celestial Bolide (Meteor) & Glowing Plasma Trail
    this.createCelestialBolide(THREE);

    // 5. Atmospheric Floating Golden Spores / Starlight Dust
    this.createAtmosphericParticles(THREE);

    this.bindEvents();
    this.animate();
  }

  createArchwayFrame(THREE) {
    this.archGroup = new THREE.Group();

    const pillarGeo = new THREE.BoxGeometry(0.95, 6.2, 0.45);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0x1a1710,
      transparent: true,
      opacity: 0.92
    });

    this.leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    this.leftPillar.position.set(-3.65, 0, 1.45);

    this.rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    this.rightPillar.position.set(3.65, 0, 1.45);

    this.archGroup.add(this.leftPillar);
    this.archGroup.add(this.rightPillar);
    this.scene.add(this.archGroup);
  }

  createCelestialBolide(THREE) {
    this.bolideGroup = new THREE.Group();

    // Glowing meteor core
    const coreGeo = new THREE.SphereGeometry(0.09, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff3d1 });
    this.bolideCore = new THREE.Mesh(coreGeo, coreMat);

    // Outer plasma coma
    const haloGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd8a24a,
      transparent: true,
      opacity: 0.55
    });
    this.bolideHalo = new THREE.Mesh(haloGeo, haloMat);

    // Trail particles
    const trailCount = 180;
    const positions = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount; i++) {
      const t = i / trailCount;
      positions[i * 3] = t * 2.4 + (Math.random() - 0.5) * 0.14;
      positions[i * 3 + 1] = t * 1.55 + (Math.random() - 0.5) * 0.14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0xf5c86c,
      size: 0.055,
      transparent: true,
      opacity: 0.85
    });
    this.bolideTrail = new THREE.Points(trailGeo, trailMat);

    this.bolideGroup.add(this.bolideCore);
    this.bolideGroup.add(this.bolideHalo);
    this.bolideGroup.add(this.bolideTrail);

    // Start high in upper-right celestial quadrant
    this.bolideGroup.position.set(3.8, 2.6, 0.8);
    this.scene.add(this.bolideGroup);
  }

  createAtmosphericParticles(THREE) {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = Math.random() * 2.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xe6ca94,
      size: 0.028,
      transparent: true,
      opacity: 0.58
    });
    this.spores = new THREE.Points(geo, mat);
    this.scene.add(this.spores);
  }

  triggerImmediateImpact() {
    if (this.impactTriggered) return;
    this.bolidePhase = 1.0;
    this.executeImpactShockwave();
  }

  executeImpactShockwave() {
    if (this.impactTriggered) return;
    this.impactTriggered = true;
    if (this.bolideGroup) {
      this.bolideGroup.visible = false;
    }

    const gsap = window.gsap;
    if (gsap) {
      // Animate shockwave ring and dawn awakening in WebGL uniforms
      gsap.fromTo(
        this.uniforms.uShockwave,
        { value: 0.01 },
        { value: 1.0, duration: 1.8, ease: "power2.out" }
      );
      gsap.to(this.uniforms.uAwakening, {
        value: 1.0,
        duration: 1.5,
        ease: "power2.out"
      });
      // Subtle camera tremor on bolide impact
      gsap.fromTo(
        this.camera.position,
        { x: 0.09, y: -0.07 },
        { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.3)" }
      );
    } else {
      this.uniforms.uShockwave.value = 1.0;
      this.uniforms.uAwakening.value = 1.0;
    }

    if (typeof this.onBolideImpact === "function") {
      this.onBolideImpact();
    }
  }

  setBiomeLook(biomeKey) {
    const tints = {
      valleys: [1.0, 0.96, 0.88],
      cities: [1.06, 0.93, 0.82],
      forests: [0.84, 1.04, 0.90],
      cliffs: [0.92, 0.95, 1.06]
    };
    const target = tints[biomeKey] || tints.valleys;
    if (window.gsap && this.uniforms) {
      window.gsap.to(this.uniforms.uBiomeTint.value, {
        x: target[0],
        y: target[1],
        z: target[2],
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    window.addEventListener("pointermove", (e) => {
      this.pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.pointer.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Mobile Chrome touch & orientation support
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma !== null && e.beta !== null) {
        this.pointer.targetX = Math.max(-1, Math.min(1, e.gamma / 30));
        this.pointer.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    }, { passive: true });
  }

  setupScrollTrigger() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;
        if (this.uniforms) {
          this.uniforms.uScroll.value = self.progress;
        }
        // Push camera forward through the Corinthian archway into the valley
        if (this.camera) {
          this.camera.position.z = 5.2 - self.progress * 1.45;
          this.camera.position.y = -self.progress * 0.35;
        }
        // Part the foreground archway columns laterally on scroll
        if (this.leftPillar && this.rightPillar) {
          this.leftPillar.position.x = -3.65 - self.progress * 1.9;
          this.rightPillar.position.x = 3.65 + self.progress * 1.9;
        }
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;

    const elapsed = this.clock ? this.clock.getElapsedTime() : 0;
    if (this.uniforms) {
      this.uniforms.uTime.value = elapsed;
    }

    // Smooth pointer damping
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.06;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.06;
    if (this.uniforms) {
      this.uniforms.uPointer.value.set(this.pointer.x, this.pointer.y);
    }

    // Celestial Bolide flight during initial 2.1 seconds
    if (!this.impactTriggered && this.bolideGroup) {
      this.bolidePhase = Math.min(1.0, elapsed / 2.1);
      const easeIn = this.bolidePhase * this.bolidePhase;
      this.bolideGroup.position.x = 3.8 - easeIn * 3.65;
      this.bolideGroup.position.y = 2.6 - easeIn * 2.75;
      this.bolideGroup.position.z = 0.8 - easeIn * 0.65;

      // Update status readout in intro gate
      const altEl = document.getElementById("bolide-altitude-readout");
      if (altEl) {
        const km = Math.max(0, Math.round((1 - this.bolidePhase) * 428));
        altEl.textContent = `${km} leagues above caldera`;
      }

      if (this.bolidePhase >= 1.0) {
        this.executeImpactShockwave();
      }
    }

    // Gentle drift of golden atmospheric spores
    if (this.spores) {
      this.spores.rotation.y = elapsed * 0.03;
      this.spores.position.y = Math.sin(elapsed * 0.4) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
