// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('green')

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
const geometry = new THREE.SphereGeometry(2)
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color('red')
const testSphere = new THREE.Mesh(geometry, material)

scene.add(testSphere)

// Test Sphere2
const geometry2 = new THREE.SphereGeometry(1)
const material2 = new THREE.MeshBasicMaterial()
material2.color = new THREE.Color('yellow')
const testSphere2 = new THREE.Mesh(geometry2, material2)

testSphere2.position.set(0, 0, 2)
scene.add(testSphere2)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

// Animate
const animation = () =>
{
	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
