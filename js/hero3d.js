/* Capital Solutions — 3D hero: floating soap bubbles (Three.js r128) */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  var key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(5, 8, 6);
  scene.add(key);
  var rim = new THREE.PointLight(0x35d0ff, 1.1, 40);
  rim.position.set(-6, -4, 8);
  scene.add(rim);

  // Bubbles
  var bubbles = [];
  var geo = new THREE.SphereGeometry(1, 32, 32);
  var palette = [0x0db9b0, 0x35d0ff, 0x7fe8e2, 0xb8f1ff];

  for (var i = 0; i < 26; i++) {
    var mat = new THREE.MeshPhysicalMaterial
      ? new THREE.MeshPhysicalMaterial({
          color: palette[i % palette.length],
          transparent: true,
          opacity: 0.32,
          roughness: 0.1,
          metalness: 0.1,
          clearcoat: 1,
          clearcoatRoughness: 0.1
        })
      : new THREE.MeshPhongMaterial({
          color: palette[i % palette.length],
          transparent: true,
          opacity: 0.32,
          shininess: 90
        });

    var b = new THREE.Mesh(geo, mat);
    var scale = 0.3 + Math.random() * 1.5;
    b.scale.setScalar(scale);
    b.position.set(
      (Math.random() - 0.28) * 22,   // bias right so text stays clear
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8 - 2
    );
    b.userData = {
      speed: 0.15 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.3,
      wobble: Math.random() * Math.PI * 2,
      baseX: b.position.x
    };
    scene.add(b);
    bubbles.push(b);
  }

  // Torus rings for depth
  var ringGeo = new THREE.TorusGeometry(2.6, 0.05, 16, 80);
  var ringMat = new THREE.MeshBasicMaterial({ color: 0x0db9b0, transparent: true, opacity: 0.15 });
  var ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.position.set(6.5, 1, -3);
  ring1.rotation.x = 1.1;
  scene.add(ring1);
  var ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
  ring2.material.opacity = 0.1;
  ring2.scale.setScalar(1.7);
  ring2.position.set(7, -1, -5);
  ring2.rotation.x = -0.9;
  scene.add(ring2);

  // Mouse parallax
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    resize();
    var t = clock.getElapsedTime();

    bubbles.forEach(function (b) {
      b.position.y += b.userData.speed * 0.016;
      b.position.x = b.userData.baseX + Math.sin(t * 0.6 + b.userData.wobble) * 0.6;
      b.rotation.y += 0.004;
      if (b.position.y > 8) {
        b.position.y = -8;
        b.userData.baseX = (Math.random() - 0.28) * 22;
      }
    });

    ring1.rotation.z = t * 0.15;
    ring2.rotation.z = -t * 0.1;

    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();
