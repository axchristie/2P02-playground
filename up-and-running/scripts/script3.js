// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
scene.add(camera)
camera.position.set(0, 0, 5)

// Test Sphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(geometry, material)

testSphere.position.set(0, 0, 0)
scene.add(testSphere)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

// Animate
const clock = new THREE.Clock()

const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Animate sphere
	console.log(Math.sin(elapsedTime))
	testSphere.position.z = Math.sin(elapsedTime)

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
