import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { FBXLoader } from './jsm/loaders/FBXLoader.js'
import Stats from './jsm/libs/stats.module.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.PointLight(0xffffff, 4);
light1.position.set(0, 5, -2);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 2);
light2.position.set(0, -5, 2);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 0, 1.0)
camera.lookAt( 0, 1, 0 );

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)


const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

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
                    element.frustumCulled = false
                    element.castShadow = true
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
const speed = 0.01
const delta = new THREE.Vector3()

let keyPressed = {};

window.addEventListener('keydown' , (e) => { 
    const key = e.key.toLowerCase();
    keyPressed['key'] = key
    keyPressed['hold'] = true;
    console.log(key)
})
document.addEventListener('keyup', function(e) {
    const key = e.key.toLowerCase();
    keyPressed['hold'] = false;
});

const updatePosition = () => { 
    delta.set(0, 0, 0);
    if(keyPressed['hold'] != false){
        const key = keyPressed['key']
        switch(key){
            case 'w':
                delta.z += speed;
                break;
            case 's':
                delta.z -= speed;
                break;
            case 'a' :
                delta.x += speed;
                break;
            case 'd' :
                delta.x -= speed;
                break;
        }
    }
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