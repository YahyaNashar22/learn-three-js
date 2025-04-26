import * as THREE from "three";
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

camera.position.set(0, 6, 6);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);

const helper = new THREE.AxesHelper(20);
scene.add(helper);

// represents the normalized position of the cursor
const mouse = new THREE.Vector2();
// hold the coordinates where the plane intersects with the plane
const intersectionPoint = new THREE.Vector3();
// indicates the direction of the plane
const planeNormal = new THREE.Vector3();
// plane to be created on each cursor move change
const plane = new THREE.Plane();
// emit the ray between the camera and the cursor
const raycaster = new THREE.Raycaster();

// keep updating the mouse variable with the normalized coordinates of the cursor
window.addEventListener('mousemove', function(e){
    mouse.x = (e.clientX / this.window.innerWidth) * 2 -1 ;
    mouse.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
    // keep updating the plane normal with the coordinates of the unit normal vector
    planeNormal.copy(camera.position).normalize();
    // create the plane
    // ? scene.position can be replaced with new THREE.Vector3(0, 0, 0)
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    // create ray
    raycaster.setFromCamera(mouse, camera);
    // get the intersection points
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

// handle creating different objects on mouse click
window.addEventListener('click', function(e){
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xFFEA00,
        metalness: 0,
        roughness: 0
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    // put the sphere at the right position by copying the intersection point.
    sphereMesh.position.copy(intersectionPoint);
})

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});


