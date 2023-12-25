import * as THREE from 'three'

interface SkinType {
  r: number
  g: number
  b: number
}

interface AngleType {
  h: number
  v: number
}

interface VectorType {
  x: number
  y: number
  z: number
}

export default class Bird {
  rSegments = 4
  hSegments = 3
  clyRay = 120
  bodyBirdInitPositions: VectorType[] = []
  vAngle = 0
  hAngle = 0
  normalSkin: SkinType = { r: 255 / 255, g: 222 / 255, b: 121 / 255 }
  shySkin: SkinType = { r: 255 / 255, g: 157 / 255, b: 101 / 255 }
  color: SkinType = {
    r: this.normalSkin.r,
    g: this.normalSkin.g,
    b: this.normalSkin.b
  }
  side = 'left'
  shyAngles: AngleType = { h: 0, v: 0 }
  // behaviourInterval
  intervalRunning: boolean = false
  threegroup: THREE.Group
  yellowMat: THREE.MeshLambertMaterial
  whiteMat: THREE.MeshLambertMaterial
  blackMat: THREE.MeshLambertMaterial
  orangeMat: THREE.MeshLambertMaterial
  wingLeftGroup: THREE.Group
  wingRightGroup: THREE.Group
  bodyBird: THREE.Mesh
  bodyVerticesLength: number
  face: THREE.Group
  leftEye: THREE.Mesh
  leftIris: THREE.Mesh
  rightEye: THREE.Mesh
  rightIris: THREE.Mesh
  beak: THREE.Mesh
  feather1: THREE.Mesh
  feather2: THREE.Mesh
  feather3: THREE.Mesh

  constructor() {
    this.threegroup = new THREE.Group()

    // materials
    this.yellowMat = new THREE.MeshLambertMaterial({
      color: 0xffde79,
      shading: THREE.FlatShading
    })
    this.whiteMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    })
    this.blackMat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      shading: THREE.FlatShading
    })
    this.orangeMat = new THREE.MeshLambertMaterial({
      color: 0xff5535,
      shading: THREE.FlatShading
    })

    // wings
    this.wingLeftGroup = new THREE.Group()
    this.wingRightGroup = new THREE.Group()

    const wingGeom = new THREE.BoxGeometry(60, 60, 5)
    const wingLeft = new THREE.Mesh(wingGeom, this.yellowMat)

    this.wingLeftGroup.add(wingLeft)
    this.wingLeftGroup.position.x = 70
    this.wingLeftGroup.position.z = 0
    this.wingLeftGroup.rotation.y = Math.PI / 2
    wingLeft.rotation.x = -Math.PI / 4
    const wingRight = new THREE.Mesh(wingGeom, this.yellowMat)
    this.wingRightGroup.add(wingRight)
    this.wingRightGroup.position.x = -70
    this.wingRightGroup.position.z = 0
    this.wingRightGroup.rotation.y = -Math.PI / 2
    wingRight.rotation.x = -Math.PI / 4

    //BODY
    const bodyGeom = new THREE.CylinderGeometry(
      40,
      70,
      200,
      this.rSegments,
      this.hSegments
    )
    this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat)
    this.bodyBird.position.y = 70

    this.bodyVerticesLength = (this.rSegments + 1) * this.hSegments
    for (let i = 0; i < this.bodyVerticesLength; i++) {
      const tv = (this.bodyBird.geometry as THREE.Geometry).vertices[i]
      this.bodyBirdInitPositions.push({ x: tv.x, y: tv.y, z: tv.z })
    }

    this.threegroup.add(this.bodyBird)
    this.threegroup.add(this.wingLeftGroup)
    this.threegroup.add(this.wingRightGroup)

    // EYES
    this.face = new THREE.Group()
    const eyeGeom = new THREE.BoxGeometry(60, 60, 10)
    const irisGeom = new THREE.BoxGeometry(10, 10, 10)

    this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat)
    this.leftEye.position.x = -30
    this.leftEye.position.y = 120
    this.leftEye.position.z = 35
    this.leftEye.rotation.y = -Math.PI / 4

    this.leftIris = new THREE.Mesh(irisGeom, this.blackMat)
    this.leftIris.position.x = -30
    this.leftIris.position.y = 120
    this.leftIris.position.z = 40
    this.leftIris.rotation.y = -Math.PI / 4

    this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat)
    this.rightEye.position.x = 30
    this.rightEye.position.y = 120
    this.rightEye.position.z = 35
    this.rightEye.rotation.y = Math.PI / 4

    this.rightIris = new THREE.Mesh(irisGeom, this.blackMat)
    this.rightIris.position.x = 30
    this.rightIris.position.y = 120
    this.rightIris.position.z = 40
    this.rightIris.rotation.y = Math.PI / 4

    // BEAK
    const beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4, 1)
    this.beak = new THREE.Mesh(beakGeom, this.orangeMat)
    this.beak.position.z = 65
    this.beak.position.y = 70
    this.beak.rotation.x = Math.PI / 2

    this.face.add(this.rightEye)
    this.face.add(this.rightIris)
    this.face.add(this.leftEye)
    this.face.add(this.leftIris)
    this.face.add(this.beak)

    //FEATHERS
    const featherGeom = new THREE.BoxGeometry(10, 20, 5)
    this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat)
    this.feather1.position.z = 55
    this.feather1.position.y = 185
    this.feather1.rotation.x = Math.PI / 4
    this.feather1.scale.set(1.5, 1.5, 1)

    this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat)
    this.feather2.position.z = 50
    this.feather2.position.y = 180
    this.feather2.position.x = 20
    this.feather2.rotation.x = Math.PI / 4
    this.feather2.rotation.z = -Math.PI / 8

    this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat)
    this.feather3.position.z = 50
    this.feather3.position.y = 180
    this.feather3.position.x = -20
    this.feather3.rotation.x = Math.PI / 4
    this.feather3.rotation.z = Math.PI / 8

    this.face.add(this.feather1)
    this.face.add(this.feather2)
    this.face.add(this.feather3)
    this.threegroup.add(this.face)

    this.threegroup.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}
