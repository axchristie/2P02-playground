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

let reveal = false
let array

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
camera.position.set(0, 2.5, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/************
 ** LIGHTS **
 ************/
// Directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5)
directionalLight.position.set(10, 1.4, -1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
// Torus Knot
//const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.1)
//const torusKnotMaterial = new THREE.MeshNormalMaterial()
//const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
//
//scene.add(torusKnot)

// Sphere1
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1)
const cylinderMaterialRed = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') })
const cylinderMaterialGreen = new THREE.MeshBasicMaterial({ color: new THREE.Color('green') })
const cylinderMaterialBlue = new THREE.MeshBasicMaterial({ color: new THREE.Color('blue') })

const cylinderRed = new THREE.Mesh(cylinderGeometry, cylinderMaterialRed)
const cylinderGreen = new THREE.Mesh(cylinderGeometry, cylinderMaterialGreen)
const cylinderBlue = new THREE.Mesh(cylinderGeometry, cylinderMaterialBlue)

cylinderRed.position.x = -4
cylinderGreen.position.x = 0
cylinderBlue.position.x = 4

scene.add(cylinderRed)
scene.add(cylinderGreen)
scene.add(cylinderBlue)

/********
 ** UI **
 ********/
let preset = {}

const obj = {
	text:  'The quick brown fox jumped over the lazy doge.',
	term1: 'the',
	term1Value: 0,
	term2: 'fox',
	term2Value: 0,
	term3: 'doge',
	term3Value: 0,
	parseText() {
		preset = textFolder.save()
		textFolder.hide()
		termsFolder.show()
	},
	reveal() {
		preset = termsFolder.save()
		process()
		const timer = clock.start()
		reveal = true
	}
}


const ui = new dat.GUI()

// Text
const textFolder = ui.addFolder('Input Text')
textFolder.add(obj, 'text')
textFolder.add(obj, 'parseText').name('Continue')

const termsFolder = ui.addFolder('Input Terms')
termsFolder.hide()
termsFolder.add(obj, 'term1').name('red term')
termsFolder.add(obj, 'term2').name('green term')
termsFolder.add(obj, 'term3').name('blue term')
termsFolder.add(obj, 'reveal').name('reveal')

const process = () =>
{
	// Remove punctutation and case
	//const parsedText = obj.text.replace(".", "").toLowerCase()
	const parsedText = obj.text.toLowerCase()
	// Tokenize text
	array = parsedText.split(/[^\w']+/)
		console.log(array)
	// Iterate through tokens
	/*
	for (let i = 0; i < array.length; i++)
	{
		if(array[i] === obj.term1)
		{
			obj.term1Value += 1
		}
		if(array[i] === obj.term2)
		{
			obj.term2Value += 1
		}
		if(array[i] === obj.term3)
		{
			obj.term3Value += 1
		}
	}
		console.log(obj.term1, obj.term1Value)
		console.log(obj.term2, obj.term2Value)
		console.log(obj.term3, obj.term3Value)
		*/
}

/****************
 ** EXPERIMENT **
 ****************/
const experiment = (timer, array) =>
{
	if(timer < array.length)
	{
		console.log(array[timer])
		if(array[timer] === obj.term1)
		{
			obj.term1Value += 0.01
		}
		if(array[timer] === obj.term2)
		{
			obj.term2Value += 0.01
		}
		if(array[timer] === obj.term3)
		{
			obj.term3Value += 0.01
		}
	} else {
		reveal = false
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
	const elapsedTimeInt = Math.floor(elapsedTime)

	// Experiment
	//sphere.scale.y += 0.02
	if(reveal)
	{
		experiment(elapsedTimeInt, array)
	}
	
	// Update cylinders
	cylinderRed.scale.y = obj.term1Value
	cylinderGreen.scale.y = obj.term2Value
	cylinderBlue.scale.y = obj.term3Value
	
	//torusKnot.position.y = obj.term1Value

	// Orbit Controls
	controls.update()
	
	// Renderer
	renderer.render(scene, camera)

	// Request next frame
	window.requestAnimationFrame(animation)
}

animation()

