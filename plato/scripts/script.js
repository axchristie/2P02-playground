import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls} from "OrbitControls"

/***********
 ** SETUP **
 ***********/
// Sizes
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
scene.background = new THREE.Color('dimgray')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.aspectRatio,
	0.1,
	100)
camera.position.set(5, 0.4, 0)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/************
 ** LIGHTS **
 ************/
// Directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5)
directionalLight.position.set(10, 1.4, -1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
// Plane
const planeGeometry = new THREE.PlaneGeometry(5, 10)
const planeMaterial = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color: new THREE.Color('gray')
})

// Wall
const wall = new THREE.Mesh(planeGeometry, planeMaterial)
wall.rotation.x = Math.PI * 0.5
wall.rotation.y = Math.PI * 0.5
wall.position.set(0, 0, 0)
wall.receiveShadow = true
scene.add(wall)

// Floor
const floor = new THREE.Mesh(planeGeometry, planeMaterial)
floor.rotation.x = Math.PI * 0.5
floor.position.set(2.5, -2.5, 0)
floor.receiveShadow = true
scene.add(floor)

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.1)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)

torusKnot.castShadow = true
torusKnot.position.set(7.5, 1, 0)
scene.add(torusKnot)

// Sun
const sphereGeometry = new THREE.SphereGeometry(1.5)
const sphereMaterial = new THREE.MeshBasicMaterial({
	color: new THREE.Color('orange')
})
const sun = new THREE.Mesh(sphereGeometry, sphereMaterial)

sun.position.set(15, 7.5, 0)
scene.add(sun)

/********
 ** UI **
 ********/
// Sun
const ui = new dat.GUI()
const lightFolder = ui.addFolder('sun')

lightFolder
	.add(directionalLight.position, 'x')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('sun x')

lightFolder
	.add(directionalLight.position, 'y')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('sun y')

lightFolder
	.add(directionalLight.position, 'z')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('sun z')

// Camera
const cameraUIObject = {}
cameraUIObject.sun = false
cameraUIObject.reset = () =>
{
	camera.position.set(5, 0.4, 0)
}


const cameraFolder = ui.addFolder('view')
cameraFolder
	.add(cameraUIObject, 'sun')
	.name('Look at the sun')

cameraFolder
	.add(cameraUIObject, 'reset')
	.name('Reset camera')

/*
cameraFolder
	.add(camera.position, 'x')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('x')

cameraFolder
	.add(camera.position, 'y')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('y')

cameraFolder
	.add(camera.position, 'z')
	.min(-10)
	.max(10)
	.step(0.1)
	.name('z')
*/

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Animate directional light
	//directionalLight.position.z = Math.sin(elapsedTime)
	
	// Animate torus knot
	torusKnot.rotation.y = elapsedTime * 0.2

	// Orbit Controls
	controls.update()
	
	// Animate camera
	if(cameraUIObject.sun)
	{
		camera.lookAt(torusKnot.position)
	}

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
