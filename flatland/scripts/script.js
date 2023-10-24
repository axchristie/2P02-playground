// sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: window.innerWidth / window.innerHeight
}

// Mouse
const mouse = {}
mouse.x = 0
mouse.y = 0

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// Test Sphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshBasicMaterial({
	wireframe: true
})
const testSphere = new THREE.Mesh(geometry, material)

testSphere.position.set(0, 0, 0)
scene.add(testSphere)

// Torus Knot
/*
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
const torusKnotMaterial = new THREE.MeshBasicMaterial({
	wireframe: true
})
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)

torusKnot.position.set(0, 0, 0)
scene.add(torusKnot)
*/

// Plane
const planeGeometry = new THREE.PlaneGeometry(5, 5, 20, 20)
const planeMaterial = new THREE.MeshBasicMaterial({
	side: THREE.DoubleSide,
	color: new THREE.Color('blue'),
	wireframe: false
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


window.addEventListener('mousemove', (event) =>
	{
		mouse.x = event.clientX / sizes.width - 0.5
		mouse.y = -(event.clientY / sizes.height) + 0.5
	})

// Animate
const clock = new THREE.Clock()

const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Animate torus knot
	testSphere.position.x = mouse.x * 5
	testSphere.position.y = mouse.y * 5

	// Mouse controls

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
