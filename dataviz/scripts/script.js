import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls} from "OrbitControls"

/***********
 ** SETUP **
 ***********/
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
camera.position.set(0, 10, -20)
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
const redMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') })
const greenMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('green') })
const blueMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('blue') })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

const drawCube = (n, material) =>
{
	const cube = new THREE.Mesh(cubeGeometry, material)

	cube.position.x = Math.random() * 10 - 5
	cube.position.z = Math.random() * 10 - 5
	cube.position.y = n

	cube.rotation.x = Math.random() * 2 * Math.PI
	cube.rotation.y = Math.random() * 2 * Math.PI
	cube.rotation.z = Math.random() * 2 * Math.PI

	scene.add(cube)
}


/********
 ** UI **
 ********/
let preset = {}

const uiobj = {
	text: 'The quick brown fox jumped, over the lazy doge.',
	term1: 'the',
	term2: 'fox',
	term3: 'doge',
	textArray: [],
	saveText() {
		saveText()
	},
	reveal() {
		saveTerms()
		parseTextAndTerms()
	}
}

const ui = new dat.GUI()

// Text
const textFolder = ui.addFolder('Source Text')
textFolder
	.add(uiobj, 'text')
textFolder
	.add(uiobj, 'saveText').name('Continue')

// Terms
const termsFolder = ui.addFolder('Search Terms')
termsFolder.hide()
termsFolder
	.add(uiobj, 'term1')
termsFolder
	.add(uiobj, 'term2')
termsFolder
	.add(uiobj, 'term3')
termsFolder
	.add(uiobj, 'reveal').name('Reveal')

// Functions
const saveText = () =>
{
	preset = textFolder.save
	textFolder.hide()
	termsFolder.show()
}

const saveTerms = () =>
{
	preset = termsFolder.save()
	termsFolder.hide()
}

const parseTextAndTerms = () =>
{
	// Downcase text
	const parsedText = uiobj.text.replace(".", "").toLowerCase()

	// Tokenize text
	uiobj.textArray = parsedText.split(/[^\w']+/)

	// Find term 1 and set material
	findTermInParsedText(uiobj.term1, redMaterial)
	
	// Find term 2 and set material
	findTermInParsedText(uiobj.term2, greenMaterial)

	// Find term 3 and set material
	findTermInParsedText(uiobj.term3, blueMaterial)
}

const findTermInParsedText = (term, material) =>
{
	// Find loop
	for (let i = 0; i < uiobj.textArray.length; i++)
	{
		if(uiobj.textArray[i] === term){
			console.log(term)
			const n = (100 / uiobj.textArray.length) * i * 0.2
			drawCube(n, material)
		}
	}
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

	// rotate cube
	//cube.rotation.x += 0.1

	// Orbit controls
	controls.update()

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()

