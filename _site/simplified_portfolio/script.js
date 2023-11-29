import * as THREE from "three"
import { GLTFLoader } from "GLTFLoader"

/***********
 ** SETUP **
 **********/
// sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: window.innerWidth / window.innerHeight
}

let xDistance = 2
let meshSize = 2

// Mobile
if(sizes.aspectRatio < 1)
{
	xDistance = 1
	meshSize = 1
}

// Resizing
window.addEventListener('resize', () =>
	{
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight
		sizes.aspectRatio = window.innerWidth / window.innerHeight

		// Update camera
		camera.aspect = sizes.aspectRatio
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	})

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.aspectRatio,
	0.1,
	100
)
camera.position.set(0, 0, 5)
scene.add(camera)

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 50)
//scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x404040, 20)
scene.add(directionalLight)

// Test Sphere
const geometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize)
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

cube.position.set(-xDistance, 0, 0)
//scene.add(cube)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)

/*****************
 ** GLTF MODELS **
 *****************/
const loader = new GLTFLoader()
let model = null

loader.load(
	// resource URL
	'assets/car/scene.gltf',
	function(gltf){
		model = gltf.scene
		scene.add(model)

		model.position.set(-2, 0, 0)
	},
	function(xhr){
		console.log('loading')
	},
	function(error){
		console.log('error loading 3D model')
	}
)

/**********************
 ** DOM INTERACTIONS **
 **********************/
const domObject = {
	part: 1
}

document.querySelector('#first').onclick = function(){
	document.querySelector('#first').classList.add('hidden')
	document.querySelector('#second').classList.remove('hidden')
	domObject.part = 2
}

document.querySelector('#second').onclick = function(){
	document.querySelector('#second').classList.add('hidden')
	document.querySelector('#third').classList.remove('hidden')
	domObject.part = 3
}

document.querySelector('#third').onclick = function(){
	document.querySelector('#third').classList.add('hidden')
	document.querySelector('#first').classList.remove('hidden')
	domObject.part = 1
}

/************
 ** CURSOR **
 ************/
const cursor = {
	x: 0,
	y: 0
}

window.addEventListener('mousemove', () =>
	{
		cursor.x = event.clientX / sizes.width - 0.5
		cursor.y = - event.clientY / sizes.height + 0.5
	})

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Move camera with scrollY
	camera.position.y = - scrollY / sizes.height * 4

	// DOM Object
	// Cube
	/*
	if(domObject.part === 2)
	{
		if(cube.rotation.y <= Math.PI * 0.5)
		{
			cube.rotation.y += 0.02
		}
	}
	if(domObject.part === 3)
	{
		if(cube.rotation.x <= Math.PI * 0.5)
		{
			cube.rotation.x += 0.02
		}
	}
	if(domObject.part === 1)
	{
		if(cube.rotation.x >= 0 && cube.rotation.y >= 0)
		{
			cube.rotation.x -= 0.02
			cube.rotation.y -= 0.02
		}
	}
	*/
	// 3D Model Rotation
	/*
	if(domObject.part === 2)
	{
		if(model.rotation.y <= Math.PI * 0.5)
		{
			model.rotation.y += 0.02
		}
	}
	if(domObject.part === 3)
	{
		if(model.rotation.x <= Math.PI * 0.5)
		{
			model.rotation.x += 0.02
		}
	}
	if(domObject.part === 1)
	{
		if(model){
		if(model.rotation.x >= 0 && cube.rotation.y >= 0)
		{
			model.rotation.x -= 0.02
			model.rotation.y -= 0.02
		}
		}
	}
	*/
	// 3D Model Cursor Control
	// console.log(cursor.x, cursor.y)
	if(model)
	{
		model.rotation.y = cursor.x * 2
		model.rotation.x = cursor.y + 0.25
	}

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
