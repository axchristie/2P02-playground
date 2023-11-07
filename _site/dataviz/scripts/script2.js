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
camera.position.set(0, 0, -5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.set(0, 0, 0)
scene.add(cube)


/********
 ** UI **
 ********/

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()
	
	// Orbit Controls
	controls.update()
	
	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
