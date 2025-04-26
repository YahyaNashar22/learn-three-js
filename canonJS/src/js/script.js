import * as THREE from "three";
import * as CANNON from 'cannon-es';
import { OrbitControls } from "three/examples/jsm/Addons.js";



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

camera.position.set(0, 20, -30);
orbit.update();

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    colo: 0xFFFFFF,
    side: THREE.DoubleSide,
    wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane()
});
world.add(groundBody);

const timeStep = 1 / 60;


function animate() {
    world.step(timeStep);
    
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});


