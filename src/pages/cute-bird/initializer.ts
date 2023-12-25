import * as THREE from 'three'
import Bird from './Bird'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
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
let floor, bird1: Bird, bird2: Bird, bird3: Bird

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

  window.addEventListener('resize', onWindowResize, false)
  document.addEventListener('mousemove', handleMouseMove, false)
  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchend', handleTouchEnd, false)
  document.addEventListener('touchmove', handleTouchMove, false)
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
  const tempHA = (mousePos.x - windowHalfX) / 200
  const tempVA = (mousePos.y - windowHalfY) / 200
  const userHAngle = Math.min(Math.max(tempHA, -Math.PI / 3), Math.PI / 3)
  const userVAngle = Math.min(Math.max(tempVA, -Math.PI / 3), Math.PI / 3)
  bird1.look(userHAngle, userVAngle)

  if (bird1.hAngle < -Math.PI / 5 && !bird2.intervalRunning) {
    bird2.lookAway(true)
    bird2.intervalRunning = true
    bird2.behaviourInterval = setInterval(function () {
      bird2.lookAway(false)
    }, 1500)
  } else if (bird1.hAngle > 0 && bird2.intervalRunning) {
    bird2.stare()
    clearInterval(bird2.behaviourInterval)
    bird2.intervalRunning = false
  } else if (bird1.hAngle > Math.PI / 5 && !bird3.intervalRunning) {
    bird3.lookAway(true)
    bird3.intervalRunning = true
    bird3.behaviourInterval = setInterval(function () {
      bird3.lookAway(false)
    }, 1500)
  } else if (bird1.hAngle < 0 && bird3.intervalRunning) {
    bird3.stare()
    clearInterval(bird3.behaviourInterval)
    bird3.intervalRunning = false
  }

  bird2.look(bird2.shyAngles.h, bird2.shyAngles.v)
  bird2.bodyBird.material.color.setRGB(
    bird2.color.r,
    bird2.color.g,
    bird2.color.b
  )

  bird3.look(bird3.shyAngles.h, bird3.shyAngles.v)
  bird3.bodyBird.material.color.setRGB(
    bird3.color.r,
    bird3.color.g,
    bird3.color.b
  )

  render()
  requestAnimationFrame(loop)
}

const render = () => {
  renderer.render(scene, camera)
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

const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length > 1) {
    event.preventDefault()
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY }
  }
}

const handleTouchEnd = () => {
  mousePos = { x: windowHalfX, y: windowHalfY }
}

const handleTouchMove = (event: TouchEvent) => {
  if (event.touches.length == 1) {
    event.preventDefault()
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY }
  }
}

const initializer = (target: HTMLDivElement) => {
  init(target)
  createLights()
  createFloor()
  createBirds()
  loop()
}

const unmount = () => {
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchmove', handleTouchMove)
}

export { initializer, unmount }
