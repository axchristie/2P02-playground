// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: window.innerWidth / window.innerHeight
}

// Distances
const objectsDistance = 4
let xDistance = 2
if(sizes.aspectRatio < 1)
{
	 xDistance = 1

	window.scrollTo(0, 500)
	sizes.height = window.innerHeight
	console.log('sizes.height is locked at ' + sizes.height)
}

// Resizing
window.addEventListener('resize', () =>
	{
		if(sizes.aspectRatio < 1)
		{
		// Do nothing to keep sizes.height locked.
		} else {
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Update camera
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		}
	})

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.set(0, 0, 3)
scene.add(camera)

// Meshes

const material = new THREE.MeshNormalMaterial()

const mesh0 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(1, 0.2, 100, 16),
	material
)

const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(0.5, 0.1),
	material
)

const mesh2 = new THREE.Mesh(
	new THREE.BoxGeometry(0.5, 0.5, 0.5),
	material
)

const mesh3 = new THREE.Mesh(
	new THREE.DodecahedronGeometry(0.5),
	material
)

mesh1.position.x = xDistance
mesh2.position.x = -xDistance
mesh3.position.x = xDistance

mesh0.position.y = - objectsDistance * 0
mesh1.position.y = - objectsDistance * 1
mesh2.position.y = - objectsDistance * 2
mesh3.position.y = - objectsDistance * 3

scene.add(mesh0, mesh1, mesh2, mesh3)

// Scroll
let scrollY = window.scrollY

window.addEventListener('scroll', () =>
	{
		scrollY = window.scrollY
	})

// Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', () =>
	{
		cursor.x = (event.clientX / sizes.width) - 0.5
		cursor.y = (event.clientY / sizes.width) - 0.5
	})

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true
})
renderer.setSize(sizes.width, sizes.height)

// Accelerometer
const acc = {}
acc.x = 0
acc.y = 0

function getAccel(){
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
            console.log("accelerometer permission granted")

        // Add a listener to get smartphone acceleration 
        // in the XYZ axes (units in m/s^2)
            window.addEventListener('deviceorientation', (event) => {

		// Expose each orientation angle in a more readable way
                rotation_degrees = event.alpha;
                frontToBack_degrees = event.beta;
                leftToRight_degrees = event.gamma;
                
                // Update velocity according to how tilted the phone is
                // Since phones are narrower than they are long, double the increase to the x velocity
                acc.x = vx + leftToRight_degrees * updateRate*2 
                acc.y = vy + frontToBack_degrees * updateRate
            })

        }
    })
}


// Animate
const clock = new THREE.Clock()

const animation = () =>
{
	// Return elapsedTime
	const elapsedTime = clock.getElapsedTime()

	// Animate camera
	camera.position.y = - scrollY / sizes.height * objectsDistance

	// Rotate meshes
	mesh0.rotation.x = - elapsedTime * 0.1
	mesh0.rotation.y = - elapsedTime * 0.1

	if(sizes.aspectRatio < 1)
	{
	// Mobile uses accY
	mesh1.rotation.x = - acc.y * 10
	mesh1.rotation.y = - acc.x * 10
	
	mesh2.rotation.x = - acc.y * 10
	mesh2.rotation.y = - acc.x * 10
	
	mesh3.rotation.x = - acc.y * 10
	mesh3.rotation.y = - acc.x * 10
	} else {
	// Regular uses cursor
	mesh1.rotation.x = - cursor.y * 0.5
	mesh1.rotation.y = - cursor.x * 0.5
	
	mesh2.rotation.x = - cursor.y * 0.5
	mesh2.rotation.y = - cursor.x * 0.5
	
	mesh3.rotation.x = - cursor.y * 0.5
	mesh3.rotation.y = - cursor.x * 0.5
	}
	
	// Render
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()
