import * as THREE from 'three'

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

  constructor() {
    this.redMat = new THREE.MeshLambertMaterial({
      color: 0xad3525,
      flatShading: true
    })
    this.greyMat = new THREE.MeshLambertMaterial({
      color: 0x653f4c,
      flatShading: true
    })
    this.yellowMat = new THREE.MeshLambertMaterial({
      color: 0xfdd276,
      flatShading: true
    })

    const coreGeom = new THREE.BoxGeometry(10, 10, 20)
    const sphereGeom = new THREE.BoxGeometry(10, 10, 3)
    const propGeom = new THREE.BoxGeometry(10, 30, 2)
    propGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 25, 0))

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
}
