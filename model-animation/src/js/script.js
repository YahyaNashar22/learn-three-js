import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

const doggyUrl = new URL('../assets/doggo2.glb', import.meta.url);


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

renderer.setClearColor(0xA3A3A3); // bg color

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 4, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(doggyUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // The mixer is the animation player, like the timeline in blender
    mixer = new THREE.AnimationMixer(model);
    // Get all applications
    const clips = gltf.animations;

    // * CASE 1: select specific animation by name
    // ? Get the name of the application
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // ? Convert the clip into a playable action
    // const action = mixer.clipAction(clip);
    // ? play animation
    // action.play();

    // * CASE 2: select all animations
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

},
    undefined, function (error) {
        console.log(error)
    });

const clock = new THREE.Clock();
function animate() {
    // ensure mixer is loaded first
    if (mixer) {
        // play the animation
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});


