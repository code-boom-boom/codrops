import * as THREE from 'three'
import Lion from './Lion'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight: THREE.DirectionalLight,
  backLight: THREE.DirectionalLight,
  light: THREE.HemisphereLight,
  renderer: THREE.WebGLRenderer,
  container

//SCENE
let floor: THREE.Mesh,
  lion: Lion,
  fan,
  isBlowing = false

//SCREEN VARIABLES
let HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = { x: 0, y: 0 },
  dist = 0

const init = (target: HTMLDivElement) => {
  container = target
  container.innerHTML = ''
  scene = new THREE.Scene()
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  aspectRatio = WIDTH / HEIGHT
  fieldOfView = 60
  nearPlane = 1
  farPlane = 2000
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  )
  camera.position.z = 800
  camera.position.y = 0
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(WIDTH, HEIGHT)
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2
}

const createLights = () => {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.8)
  shadowLight.position.set(200, 200, 200)
  shadowLight.castShadow = true

  backLight = new THREE.DirectionalLight(0xffffff, 0.4)
  backLight.position.set(-100, 200, 50)
  backLight.castShadow = true

  scene.add(backLight)
  scene.add(light)
  scene.add(shadowLight)
}

const createFloor = () => {
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 500),
    new THREE.MeshBasicMaterial({ color: 0xebe5e7 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -100
  floor.receiveShadow = true

  scene.add(floor)
}

const createLion = () => {
  lion = new Lion()
  scene.add(lion.threegroup)
}

const loop = () => {
  render()
}

const render = () => {
  renderer.render(scene, camera)
}

const initialize = (target: HTMLDivElement) => {
  init(target)
  createLights()
  createFloor()
  createLion()
  loop()
}

export default initialize