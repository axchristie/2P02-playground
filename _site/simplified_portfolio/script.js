import * as THREE from "three"

/***********
 ** SETUP **
 **********/
// sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: window.innerWidth / window.innerHeight
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

// Test Sphere
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

cube.position.set(-2, 0, 0)
scene.add(cube)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)

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

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
