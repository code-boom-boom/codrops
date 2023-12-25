import * as THREE from 'three'
import { rule3 } from './Helpers'

export default class Fan {
  isBlowing = false
  speed = 0
  acc = 0
  redMat: THREE.MeshLambertMaterial
  greyMat: THREE.MeshLambertMaterial
  yellowMat: THREE.MeshLambertMaterial
  core: THREE.Mesh
  propeller: THREE.Group
  sphere: THREE.Mesh
  threegroup: THREE.Group
  tPosX = 0
  tPosY = 0
  targetSpeed = 0

  constructor() {
    this.redMat = new THREE.MeshLambertMaterial({
      color: 0xad3525,
      shading: THREE.FlatShading
    })
    this.greyMat = new THREE.MeshLambertMaterial({
      color: 0x653f4c,
      shading: THREE.FlatShading
    })
    this.yellowMat = new THREE.MeshLambertMaterial({
      color: 0xfdd276,
      shading: THREE.FlatShading
    })

    const coreGeom = new THREE.BoxGeometry(10, 10, 20)
    const sphereGeom = new THREE.BoxGeometry(10, 10, 3)
    const propGeom = new THREE.BoxGeometry(10, 30, 2)
    propGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0))

    this.core = new THREE.Mesh(coreGeom, this.greyMat)
    this.core.name = 'Core'

    // propellers
    const prop1 = new THREE.Mesh(propGeom, this.redMat)
    prop1.name = 'Prop 1'
    const prop2 = prop1.clone()
    prop2.name = 'Prop 2'
    prop2.rotation.z = Math.PI / 2
    const prop3 = prop1.clone()
    prop3.name = 'Prop 3'
    prop3.rotation.z = Math.PI
    const prop4 = prop1.clone()
    prop4.name = 'Prop 4'
    prop4.rotation.z = -Math.PI / 2

    this.propeller = new THREE.Group()
    this.propeller.name = 'Propeller'
    this.propeller.add(prop1)
    this.propeller.add(prop2)
    this.propeller.add(prop3)
    this.propeller.add(prop4)

    this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat)
    this.sphere.position.z = 15

    this.threegroup = new THREE.Group()
    this.threegroup.add(this.core)
    this.threegroup.add(this.propeller)
    this.threegroup.add(this.sphere)
  }

  update(xTarget: number, yTarget: number) {
    this.threegroup.lookAt(new THREE.Vector3(0, 80, 60))
    this.tPosX = rule3(xTarget, -200, 200, -250, 250)
    this.tPosY = rule3(yTarget, -200, 200, 250, -250)

    this.threegroup.position.x += (this.tPosX - this.threegroup.position.x) / 10
    this.threegroup.position.y += (this.tPosY - this.threegroup.position.y) / 10

    this.targetSpeed = this.isBlowing ? 0.3 : 0.01
    if (this.isBlowing && this.speed < 0.5) {
      this.acc += 0.001
      this.speed += this.acc
    } else if (!this.isBlowing) {
      this.acc = 0
      this.speed *= 0.98
    }
    this.propeller.rotation.z += this.speed
  }
}
