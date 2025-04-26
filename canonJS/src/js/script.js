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

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00FF00,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xFF0000,
    wireframe: true
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
    wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 20, 0),
    material: boxPhysMat
});
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;


const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 15, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31;


const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    // ? we removed the Plane() shape because it's infinite and takes the whole scene.
    // shape: new CANNON.Plane(),
    // ? values are half of the values used when creating the geometry ( applicable on BOX )
    // ? z value is set to 0.1 to be as thin as possible
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);


const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {
        friction: 0
    }
);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {
        restitution: 0.9
    }
);

world.addContactMaterial(groundBoxContactMat);
world.addContactMaterial(groundSphereContactMat);


const timeStep = 1 / 60;


function animate() {
    world.step(timeStep);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);


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


