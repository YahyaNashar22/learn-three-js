import * as THREE from "three";
import * as dat from 'dat.gui';
import { OrbitControls } from "three/examples/jsm/Addons.js";


const nebula = new URL("../images/start_dust.png", import.meta.url).href;
const stars = new URL("../images/stars.png", import.meta.url).href;


const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

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

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 10, 0);
box.castShadow = true;
scene.add(box);



const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

sphere.position.set(-10, 10, 0);

const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;


const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);


const spotLight = new THREE.SpotLight(0xFFFF00);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.position.set(-100, 100, 0);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = fog;

// renderer.setClearColor(0xFF00EA);

console.log(nebula);
console.log(stars);


const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars, stars, // Right, Left
    stars, stars, // Top, Bottom
    nebula, nebula // Front, Back
])

const box2Geometry = new THREE.BoxGeometry();
// const box2Material = new THREE.MeshStandardMaterial({ map: textureLoader.load(nebula) });
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) })

];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(10, 10, 0);
box2.castShadow = true;
scene.add(box2);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

// const vShader = `
// void main(){
//     gl_position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }`;

// const fShader = `
// void main(){
//     gl_FragColor =  vec4(0.5, 0.5, 1.0, 1.0);
// }`;

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent
});

const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const gui = new dat.GUI();

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    spotlightY: 100,
    spotlightX: -100,
    spotlightZ: 0,
    spotlightAngle: 0.2,
    penumbra: 0,
    intensity: 3,
    angle: 0.2,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
    sphere.material.color.set(e);
})

gui.add(options, "wireframe").onChange(function (e) {
    sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 3);

gui.add(options, 'spotlightY', -1000, 100);
gui.add(options, 'spotlightX', -100, 100);
gui.add(options, 'spotlightZ', 0, 100);




let step = 0;

const mousePosition = new THREE.Vector2();

// get the coordinates of the cursor
window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -((e.clientY / window.innerHeight) * 2 - 1);
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;


function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLight.position.y = options.spotlightY;
    spotLight.position.z = options.spotlightZ;
    spotLight.position.x = options.spotlightX;



    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === sphereId) {
            // Generate a random hex color

            intersects[i].object.material.color.set(0xEAFAAf);
        }
    }

    plane2.geometry.attributes.position.array[0] -= 100 * Math.random();
    plane2.geometry.attributes.position.array[1] -= 100 * Math.random();
    plane2.geometry.attributes.position.array[2] -= 100 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] -= 100 * Math.random();
    // * IMPORTANT FOR ANIMATION TO WORK 
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)