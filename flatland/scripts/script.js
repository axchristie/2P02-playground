import * as THREE from "three"
import * as dat from 'lil-gui'
import { OrbitControls } from "OrbitControls"

/***********
 ** SETUP **
 ***********/
// sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: window.innerWidth / window.innerHeight
}

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// Clipping plane
const localPlane = new THREE.Plane( new THREE.Vector3(0, 1, 0), 0)

// Test Sphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshNormalMaterial({
	wireframe: false,
	clippingPlanes: [ localPlane ]
})

const testSphere = new THREE.Mesh(geometry, material)

testSphere.position.set(0, 0, 0)
//scene.add(testSphere)

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
const torusKnotMaterial = new THREE.MeshNormalMaterial({
	wireframe: false,
	clippingPlanes: [ localPlane ]
})
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)

torusKnot.position.set(0, 0, 0)
scene.add(torusKnot)

// Plane
const planeGeometry = new THREE.PlaneGeometry(5, 5, 20, 20)
const planeMaterial = new THREE.MeshBasicMaterial({
	side: THREE.DoubleSide,
	color: new THREE.Color('white'),
	wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)


plane.rotation.x = Math.PI * 0.5
scene.add(plane)

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
scene.add(camera)
camera.position.set(-2, 2, 3)
camera.lookAt(plane.position)


// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.localClippingEnabled = false

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/********
 ** UI **
 ********/
const sphereAnimationObject = {}
sphereAnimationObject.active = false
sphereAnimationObject.play = () =>
{
	if(!sphereAnimationObject.active){
		sphereAnimationObject.active = true
	} else {
		sphereAnimationObject.active = false
	}
}
const ui = new dat.GUI()
// Clipping
const clippingFolder = ui.addFolder('Clipping')
clippingFolder
	.add(renderer, 'localClippingEnabled')
	.name('Clipping')

// Sphere
const sphereFolder = ui.addFolder('Sphere')
sphereFolder
	.add(torusKnot.position, 'y')
	.min(-5)
	.max(5)
	.step(0.1)
	.name('Sphere Y')

sphereFolder
	.add(sphereAnimationObject, 'play')
	.name('toggle animation')

/********************
 ** ANIMATION LOOP **
 ********************/
// Animate
const clock = new THREE.Clock()

const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Orbit Controls
	controls.update()

	// Animate Sphere
	torusKnot.rotation.x = elapsedTime * 0.5
	torusKnot.rotation.y = elapsedTime * 0.5
	if(sphereAnimationObject.active)
	{
		//testSphere.position.y = Math.sin(elapsedTime)
		torusKnot.position.y = Math.sin(elapsedTime)
	}

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
