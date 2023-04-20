import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { FBXLoader } from './jsm/loaders/FBXLoader.js'
import Stats from './jsm/libs/stats.module.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

const backLight = new THREE.PointLight(0xffffff, 1, 100);
backLight.position.set(0, 0, -15);
scene.add(backLight);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 1, 1.2)

const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.set(0, 2, 10);
scene.add(camera2);

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)


const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );


let mixer;
let animationReady = false;
let modelAnimations = [];
let currentAnimationIndex ; 
let fbxObject ;
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/Pirate By P. Konstantinov.fbx',
    (object) => {
        mixer = new THREE.AnimationMixer(object)
        object.traverse(function (element) {
                if (element.material) {
                    element.material.transparent = false
                }
                if (element.isMesh) {
                    element.material.side = THREE.DoubleSide;
                }
        })        
        object.scale.set(.01, .01, .01)
        scene.add(object)
        fbxObject = object
        fbxLoader.load('models/Walking.fbx' , (object) => {
            let modelAnimation = object.animations[0]
            modelAnimation.tracks.shift()
            const animationAction = mixer.clipAction(modelAnimation)
            modelAnimations.push(animationAction)
            animationReady = true 
            fbxLoader.load('models/Walking Backwards.fbx' , (object) => {
                let modelAnimation = object.animations[0]
                modelAnimation.tracks.shift()
                const animationAction = mixer.clipAction(modelAnimation)
                modelAnimations.push(animationAction)
                fbxLoader.load('models/Left Strafe Walk.fbx' , (object) => {
                    let modelAnimation = object.animations[0]
                    modelAnimation.tracks.shift()
                    const animationAction = mixer.clipAction(modelAnimation)
                    modelAnimations.push(animationAction)
                    fbxLoader.load('models/Right Strafe Walking.fbx' , (object) => {
                        let modelAnimation = object.animations[0]
                        modelAnimation.tracks.shift()
                        const animationAction = mixer.clipAction(modelAnimation)
                        modelAnimations.push(animationAction)
                        fbxLoader.load('models/Walking Arc Left.fbx' , (object) => {
                            let modelAnimation = object.animations[0]
                            modelAnimation.tracks.shift()
                            const animationAction = mixer.clipAction(modelAnimation)
                            modelAnimations.push(animationAction)
                            console.log(modelAnimations)  
                        },               
                        (xhr) => {
                            console.log( 'Animation Arc Left ' +(xhr.loaded / xhr.total * 100) + '% loaded')
                        },
                        (error) => {
                            console.log(error)
                        })
                    },               
                    (xhr) => {
                        console.log( 'Animation Right ' +(xhr.loaded / xhr.total * 100) + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    })
                },               
                (xhr) => {
                    console.log( 'Animation Left ' +(xhr.loaded / xhr.total * 100) + '% loaded')
                },
                (error) => {
                    console.log(error)
                })
            },               
            (xhr) => {
                console.log( 'Animation Backward ' +(xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => {
                console.log(error)
            })
        },               
        (xhr) => {
            console.log( 'Animation Walk' +(xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error) => {
            console.log(error)
        })

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

let keysHeldDown = []
let animationStopped = false;

window.addEventListener('keydown' , (e) => { 
    const key = e.key.toLowerCase();
    const controlArrayValue = keysHeldDown.includes(key)
    if(!controlArrayValue){
        keysHeldDown.push(key)
    }
    console.log(keysHeldDown)
    
})

document.addEventListener('keyup', function(e) {
    const key = e.key.toLowerCase();
    keysHeldDown.splice(keysHeldDown.indexOf(key), 1);
    console.log(keysHeldDown)
    stopCurrentAnimation()
    fbxObject.rotation.y = 0
});
const updatePosition = () => { 
    delta.set(0, 0, 0);
        if(keysHeldDown.length > 0){
            if(checkIfThereIs('w') && checkIfThereIs('a')){
                delta.z += speed;
                delta.x += speed;
                fbxObject.rotation.y = 0.5
                if (!animationStopped) {
                    stopCurrentAnimation();
                    animationStopped = true;
                }
                startAnimation(0);
            } else if(checkIfThereIs('w') && checkIfThereIs('d')){
                delta.z += speed;
                delta.x -= speed;
                fbxObject.rotation.y = -0.5
                if (!animationStopped) {
                    stopCurrentAnimation();
                    animationStopped = true;
                }
                startAnimation(0);
            } else if(checkIfThereIs('s') && checkIfThereIs('a')){
                delta.z -= speed;
                delta.x -= speed;
                fbxObject.rotation.y = 0.5
                if (!animationStopped) {
                    stopCurrentAnimation();
                    animationStopped = true;
                }
                startAnimation(1);
            } else if(checkIfThereIs('s') && checkIfThereIs('d')){
                delta.z -= speed;
                delta.x += speed;
                fbxObject.rotation.y = -0.5
                if (!animationStopped) {
                    stopCurrentAnimation();
                    animationStopped = true;
                }
                startAnimation(1);
            } else if(checkIfThereIs('w') && keysHeldDown.length === 1){
                fbxObject.rotation.y = 0
                delta.z += speed;
                startAnimation(0);
            } else if(checkIfThereIs('s') && keysHeldDown.length === 1){
                delta.z -= speed;
                startAnimation(1);
                fbxObject.rotation.y = 0
            } else if(checkIfThereIs('a') && keysHeldDown.length === 1){
                delta.x += speed;
                startAnimation(2);
            } else if(checkIfThereIs('d') && keysHeldDown.length === 1){
                delta.x -= speed;
                startAnimation(3);
            }
        }

    position.add(delta);
    if(fbxObject) fbxObject.position.copy(position);
}

const startAnimation =  (index) => { 
        if(modelAnimations.length > 0){ 
            const currentAnimation = modelAnimations[index]
            currentAnimation.play() 
            currentAnimationIndex = index
        }
}
const stopCurrentAnimation = () => {
    if (modelAnimations.length > 0 && currentAnimationIndex !== undefined && modelAnimations[currentAnimationIndex]) {
      const currentAnimation = modelAnimations[currentAnimationIndex];
      currentAnimation.stop();
      const lastElement = keysHeldDown[keysHeldDown.length - 1];
      if (lastElement === 'w') currentAnimationIndex = 0;
      if (lastElement === 's') currentAnimationIndex = 1;
      if (lastElement === 'a') currentAnimationIndex = 2;
      if (lastElement === 'd') currentAnimationIndex = 3;
      const currentAnimation2 = modelAnimations[currentAnimationIndex];
      currentAnimation2.stop();
      currentAnimationIndex = undefined;
      animationStopped = false;
    }
  }
const checkIfThereIs = (value) => {
    const index = keysHeldDown.indexOf(value);
    return index != -1 ? true : false
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

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    if(animationReady) mixer.update(clock.getDelta())

    render()

    updatePosition();

    stats.update()

}

function render() {
    renderer.render(scene, camera)
}

animate()