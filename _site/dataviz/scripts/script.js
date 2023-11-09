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
scene.background = new THREE.Color('white')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.aspectRatio,
	0.1,
	100)
camera.position.set(0, 20, -10)
camera.lookAt(200, 500, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
// Cubes
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const cubeMaterial = new THREE.MeshNormalMaterial()
const redMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('red') })
const greenMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('green') })
const blueMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('blue') })
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

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10)
const floorMaterial = new THREE.MeshNormalMaterial({
	emissive: new THREE.Color('yellow'),
	side: THREE.DoubleSide
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI * 0.5
floor.position.y = -5
//scene.add(floor)


/***********
 ** LIGHT **
 ***********/
const directionalLight = new THREE.DirectionalLight( 0xffffff, 15)
directionalLight.position.set(0, 30, 0)
scene.add(directionalLight)

/********
 ** UI **
 ********/
let preset = {}

const uiobj = {
	text: '',
	term1: '',
	term2: '',
	term3: '',
	turntable: false,
	textArray: [],
	saveText() {
		saveText()
	},
	reveal() {
		saveTerms()
		parseTextAndTerms()
	},
	toggleRedMaterial() {
		if(redMaterial.visible)
		{
		redMaterial.visible = false
		} else {
		redMaterial.visible = true
		}
	},
	toggleGreenMaterial() {
		if(greenMaterial.visible)
		{
		greenMaterial.visible = false
		} else {
		greenMaterial.visible = true
		}
	},
	toggleBlueMaterial() {
		if(blueMaterial.visible)
		{
		blueMaterial.visible = false
		} else {
		blueMaterial.visible = true
		}
	}
}


// Load source text
fetch('https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer\'s%20Stone.txt')
	.then(response => response.text())
	.then((data) => {
		uiobj.text = data
	})

const ui = new dat.GUI()

// Text
const textFolder = ui.addFolder('Source Text')
textFolder
	.add(uiobj, 'text')
textFolder
	.add(uiobj, 'saveText').name('Continue')
textFolder.hide()

// Terms
const termsFolder = ui.addFolder('Search Terms')
termsFolder
	.add(uiobj, 'term1').name('Red term')
termsFolder
	.add(uiobj, 'term2').name('Green term')
termsFolder
	.add(uiobj, 'term3').name('Blue term')
termsFolder
	.add(uiobj, 'reveal').name('Reveal')

// Interaction
const cubeFolder = ui.addFolder('Cubes')
const cameraFolder = ui.addFolder('Camera')

cubeFolder.hide()
cameraFolder.hide()

cubeFolder
	.add(uiobj, 'toggleRedMaterial')
	.name('Red')

cubeFolder
	.add(uiobj, 'toggleGreenMaterial')
	.name('Green')

cubeFolder
	.add(uiobj, 'toggleBlueMaterial')
	.name('Blue')

cameraFolder
	.add(uiobj, 'turntable')
	.name('play/pause')


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
	cubeFolder.show()
	cameraFolder.show()

	// Legend
	document.getElementById("red").innerHTML = uiobj.term1
	document.getElementById("green").innerHTML = uiobj.term2
	document.getElementById("blue").innerHTML = uiobj.term3
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
			const n = (100 / uiobj.textArray.length) * i * 0.2
			drawCube(n, material)
			drawCube(n, material)
			drawCube(n, material)
			drawCube(n, material)
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

	// Turntable Camera
	if(uiobj.turntable){
		camera.position.y = 15
		camera.position.x = Math.sin(elapsedTime * 0.2) * 15
		camera.position.z = Math.cos(elapsedTime * 0.2) * 15
	}

	// Orbit controls
	controls.update()

	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()

