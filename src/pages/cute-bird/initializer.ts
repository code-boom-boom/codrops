import * as THREE from 'three'
import { redirect } from 'react-router-dom'
import Bird from './Bird'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls,
  fieldOfView: number,
  aspectRatio: number,
  nearPlane: number,
  farPlane: number,
  shadowLight: THREE.DirectionalLight,
  backLight: THREE.DirectionalLight,
  light: THREE.HemisphereLight,
  renderer: THREE.WebGLRenderer,
  container: HTMLDivElement

//SCENE
let floor, bird1, bird2, bird3

//SCREEN VARIABLES

let HEIGHT: number,
  WIDTH: number,
  windowHalfX: number,
  windowHalfY: number,
  mousePos = { x: 0, y: 0 }

const init = (target: HTMLDivElement) => {
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
  camera.position.z = 1000
  camera.position.y = 300
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(WIDTH, HEIGHT)
  renderer.shadowMapEnabled = true

  container = target
  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2
}

const createLights = () => {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.8)
  shadowLight.position.set(200, 200, 200)
  shadowLight.castShadow = true
  shadowLight.shadowDarkness = 0.2

  backLight = new THREE.DirectionalLight(0xffffff, 0.4)
  backLight.position.set(-100, 200, 50)
  backLight.castShadow = true
  backLight.shadowDarkness = 0.1

  scene.add(light)
  scene.add(shadowLight)
  scene.add(backLight)
}

const createFloor = () => {
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 0xe0dacd })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -33
  floor.receiveShadow = true
  scene.add(floor)
}

const createBirds = () => {
  bird1 = new Bird()
  bird1.threegroup.position.x = 0
  scene.add(bird1.threegroup)

  bird2 = new Bird()
  bird2.threegroup.position.x = -250
  bird2.side = 'right'
  bird2.threegroup.scale.set(0.8, 0.8, 0.8)
  bird2.threegroup.position.y = -8
  scene.add(bird2.threegroup)

  bird3 = new Bird()
  bird3.threegroup.position.x = 250
  bird3.side = 'left'
  bird3.threegroup.scale.set(0.8, 0.8, 0.8)
  bird3.threegroup.position.y = -8
  scene.add(bird3.threegroup)
}

const loop = () => {
  render()
}

const render = () => {
  renderer.render(scene, camera)
}

const initializer = (target: HTMLDivElement) => {
  init(target)
  createLights()
  createFloor()
  createBirds()
  loop()
}

export default initializer
