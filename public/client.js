import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { FBXLoader } from './jsm/loaders/FBXLoader.js'
import Stats from './jsm/libs/stats.module.js'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(0.8, 1.4, 1.0)
scene.add(light)

const light1 = new THREE.PointLight(0xffffff, 4);
light1.position.set(0, 5, -2);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 2);
light2.position.set(0, -5, 2);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 0, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
cube.scale.set(30, 0.5, 30);
cube.position.y = -0.26

let fbxObject ;
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/Pirate By P. Konstantinov.fbx',
    (object) => {
        object.traverse(function (element) {
                if (element.material) {
                    element.material.transparent = false
                }
                if (element.isMesh) {
                    element.material.metalness = 0.5;
                }
        })
        object.scale.set(.01, .01, .01)
        scene.add(object)
        fbxObject = object
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
const position = new THREE.Vector3(); ;
const speed = 0.001
const delta = new THREE.Vector3()

const keysPressed = [];

window.addEventListener('keydown' , (e) => { 
    const key = e.key.toLowerCase();
    if (!keysPressed.includes(key)) {
      keysPressed.push(key);
    }
})

const updatePosition = () => { 
    delta.set(0, 0, 0);

    // hareket vektörüne göre değişiklik yap
    if (keysPressed.includes('w')) {
      delta.z -= speed;
    }
    if (keysPressed.includes('s')) {
      delta.z += speed;
    }
    if (keysPressed.includes('a')) {
      delta.x -= speed;
    }
    if (keysPressed.includes('d')) {
      delta.x += speed;
    }
      // mevcut pozisyonu güncelle
    position.add(delta);
    fbxObject.position.copy(position);
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    updatePosition();

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()