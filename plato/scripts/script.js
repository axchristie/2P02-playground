import * as THREE from "https://ga.jspm.io/npm:three@0.153.0/build/three.module.js"

/********************
 ** MOUSE CONTROLS **
 *******************/
let mouseDown = false
window.addEventListener('mousedown', (event) =>
	{
		mouseDown = true
	})

window.addEventListener('mouseup', (event) =>
	{
		mouseDown = false
	})

const mouse = {}
mouse.x = 0
mouse.y = 0

window.addEventListener('mousemove', (event) =>
	{
		mouse.x = event.clientX / sizes.width - 0.5
		mouse.y = -(event.clientY / sizes.height - 0.5)
	})

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
scene.background = new THREE.Color('darkgray')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.aspectRatio,
	0.1,
	100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true

/************
 ** LIGHTS **
 ************/
// Directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5)
directionalLight.position.set(5, 5, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512
directionalLight.shadow.mapSize.height = 512
scene.add(directionalLight)

/************
 ** MESHES **
 ************/
// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 5)
const planeMaterial = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color: new THREE.Color('gray')
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * 0.4
plane.receiveShadow = true
plane.position.set(0, -2, 0)
scene.add(plane)

// Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2.5)
const cylinderMaterial = new THREE.MeshStandardMaterial({
	color: new THREE.Color('gray')
})
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
cylinder.castShadow = true
cylinder.position.set(2, -0.5, 0)
//scene.add(cylinder)

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1.5, 0.1)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)

torusKnot.castShadow = true
torusKnot.position.set(4, 2, 0)
scene.add(torusKnot)


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
	
	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)

	// Mouse controls
	const multiplier = 0.1
	if(mouseDown){
		camera.position.x = (Math.sin(mouse.x * Math.PI * 2) * 10) + 5
		camera.position.z = (Math.cos(mouse.x * Math.PI * 2) * 10) + 5
		camera.position.y = (mouse.y + 1) * 10
	}
	camera.lookAt(plane.position)
}

animation()

