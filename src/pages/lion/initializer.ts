import * as THREE from 'three'
import Lion from './Lion'
import Fan from './Fan'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
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
  fan: Fan,
  isBlowing = false

//SCREEN VARIABLES
let HEIGHT,
  WIDTH,
  windowHalfX: number,
  windowHalfY: number,
  mousePos = { x: 0, y: 0 }

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
  renderer.shadowMapEnabled = true
  container.appendChild(renderer.domElement)
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2

  window.addEventListener('resize', onWindowResize, false)
  document.addEventListener('mousemove', handleMouseMove, false)
  document.addEventListener('mousedown', handleMouseDown, false)
  document.addEventListener('mouseup', handleMouseUp, false)
  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchmove', handleTouchMove, false)
  document.addEventListener('touchend', handleTouchEnd, false)
}

const onWindowResize = () => {
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
}

const handleMouseMove = (event: MouseEvent) => {
  mousePos = { x: event.clientX, y: event.clientY }
}

const handleMouseDown = () => {
  isBlowing = true
}

const handleMouseUp = () => {
  isBlowing = false
}

const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length > 1) {
    event.preventDefault()
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY }
    isBlowing = true
  }
}

const handleTouchEnd = () => {
  isBlowing = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (event.touches.length == 1) {
    event.preventDefault()
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY }
    isBlowing = true
  }
}

const createLights = () => {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.8)
  shadowLight.position.set(200, 200, 200)
  shadowLight.castShadow = true
  shadowLight.shadowDarkness = 0.1

  backLight = new THREE.DirectionalLight(0xffffff, 0.4)
  backLight.position.set(-100, 200, 50)
  backLight.castShadow = true
  backLight.shadowDarkness = 0.1

  scene.add(backLight)
  scene.add(light)
  scene.add(shadowLight)
}

const createFloor = () => {
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000, 500),
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

const createFan = () => {
  fan = new Fan()
  fan.threegroup.position.z = 350
  scene.add(fan.threegroup)
}

const loop = () => {
  render()
  const xTarget = mousePos.x - windowHalfX
  const yTarget = mousePos.y - windowHalfY

  fan.isBlowing = isBlowing
  fan.update(xTarget, yTarget)
  if (isBlowing) {
    lion.cool(xTarget, yTarget)
  } else {
    lion.look(xTarget, yTarget)
  }

  requestAnimationFrame(loop)
}

const render = () => {
  renderer.render(scene, camera)
}

const initialize = (target: HTMLDivElement) => {
  init(target)
  createLights()
  createFloor()
  createLion()
  createFan()
  loop()
}

export default initialize
