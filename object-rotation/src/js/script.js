import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const starsTexture = new URL("../img/stars.jpg", import.meta.url).href;
const sunTexture = new URL("../img/sun.jpg", import.meta.url).href;
const mercuryTexture = new URL("../img/mercury.jpg", import.meta.url).href;
const venusTexture = new URL("../img/venus.jpg", import.meta.url).href;
const earthTexture = new URL("../img/earth.jpg", import.meta.url).href;
const marsTexture = new URL("../img/mars.jpg", import.meta.url).href;
const jupiterTexture = new URL("../img/jupiter.jpg", import.meta.url).href;
const saturnTexture = new URL("../img/saturn.jpg", import.meta.url).href;
const saturnRingTexture = new URL("../img/saturn ring.png", import.meta.url).href;
const uranusTexture = new URL("../img/uranus.jpg", import.meta.url).href;
const uranusRingTexture = new URL("../img/uranus ring.png", import.meta.url).href;
const neptuneTexture = new URL("../img/neptune.jpg", import.meta.url).href;
const plutoTexture = new URL("../img/pluto.jpg", import.meta.url).href;



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
]);


const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);



const mercuryGeo = new THREE.SphereGeometry(3.2, 30, 30);
const mercuryMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(mercuryTexture)
});
const mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
const mercuryObj = new THREE.Object3D();
// * We appended it to the mercuryObj, so it's position is now relative to it
mercuryObj.add(mercury);
scene.add(mercuryObj);
mercury.position.x = 28;



const saturnGeo = new THREE.SphereGeometry(10, 30, 30);
const saturnMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(saturnTexture)
});
const saturn = new THREE.Mesh(saturnGeo, saturnMat);
const saturnObj = new THREE.Object3D();
saturnObj.add(saturn);
scene.add(saturnObj);
saturn.position.x = 138;

const saturnRingGeo = new THREE.RingGeometry(10, 20, 32);
const saturnRingMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(saturnRingTexture),
    side: THREE.DoubleSide
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturn.add(saturnRing);
saturn.position.x = 138;
saturnRing.rotation.x = -0.5 * Math.PI;


const pointLight = new THREE.PointLight(0xFFFFFF, 10000, 100000);
scene.add(pointLight);

function animate() {
    // make planets rotate
    sun.rotateY(0.004);
    mercury.rotateY(0.004);
    mercuryObj.rotateY(0.04);
    saturn.rotateY(0.038);
    saturnObj.rotateY(0.0009);



    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});


