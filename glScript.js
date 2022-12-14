// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 45, WIDTH/HEIGHT, 1, 1000 );
// scene.add( camera );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( WIDTH, HEIGHT );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
//     cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;
// renderer.render( scene, camera );
// requestAnimationFrame( animate );
// }
// animate();
const container = document.createElement('div')
const lCanvas = document.createElement('canvas')
const rCanvas = document.createElement('canvas')
container.classList = 'container'
lCanvas.classList = 'left-canvas'
rCanvas.classList = 'right-canvas'
container.appendChild(lCanvas)
container.appendChild(rCanvas)
document.querySelector('body').appendChild(container)
let lgl = lCanvas.getContext('webgl2')
let rgl = rCanvas.getContext('webgl2')
const canvasWidth = window.innerWidth/2;
const canvasHeight = window.innerHeight;
// lgl.viewport(0,0,canvasWidth, canvasHeight)
// rgl.viewport(0,0,canvasWidth, canvasHeight)
// lgl.clearColor(0,0,0,0)
// lgl.clear(lgl.COLOR_BUFFER_BIT)

const leftCameraID = "a8c366552b9026fef3466f211d90a38004d8cdb7b4abd5f550df3314a6bb5977"
const rightCameraID = "8589d31a4b1df559be9596bfd02a794cc2038f97f2035e7b8782feab6d0d00ba"

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec4 aPosition;
layout(location = 1) in vec2 aTexCoord;
out vec2 vTexCoord;
void main() {
    gl_Position = aPosition;
    vTexCoord = aTexCoord;
}`

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform sampler2D uSampler;
in vec2 vTexCoord;
out vec4 fragColor;
void main() {
    fragColor = texture(uSampler, vTexCoord);
}
`

const lProgram = lgl.createProgram();
const lvs = lgl.createShader(lgl.VERTEX_SHADER);
lgl.shaderSource(lvs, vertexShaderSource)
lgl.compileShader(lvs)
lgl.attachShader(lProgram, lvs)

const lfs = lgl.createShader(lgl.FRAGMENT_SHADER);
lgl.shaderSource(lfs, fragmentShaderSource)
lgl.compileShader(lfs)
lgl.attachShader(lProgram, lfs)

lgl.linkProgram(lProgram)
if(!lgl.getProgramParameter(lProgram, lgl.LINK_STATUS)) {
    console.log('ERROR')
}

lgl.useProgram(lProgram)
const vertexBufferData = new Float32Array([
    -1, -1, -1, 1, 1, -1,
    -1, 1, 1, 1, 1, -1
])
const texCoordBufferData = new Float32Array([
    0,1, 0,0, 1, 1,
    0,0,1, 0, 1, 1
])
const pixels = new Uint8Array([
    255,255,255,128,0,0,0,128,0,0,0,128,
    255,255,0,255,0,255,255,255,0,0,0,255,
    255,255,255,128,0,0,0,128,0,0,0,128,
    255,255,0,255,0,255,255,255,0,0,0,255
    
])


const vertexBuffer = lgl.createBuffer()
lgl.bindBuffer(lgl.ARRAY_BUFFER, vertexBuffer)
lgl.bufferData(lgl.ARRAY_BUFFER, vertexBufferData, lgl.STATIC_DRAW)
lgl.vertexAttribPointer(0,2, lgl.FLOAT, false,0,0)
lgl.enableVertexAttribArray(0)

const texCoordBuffer = lgl.createBuffer()
lgl.bindBuffer(lgl.ARRAY_BUFFER, texCoordBuffer)
lgl.bufferData(lgl.ARRAY_BUFFER, texCoordBufferData, lgl.STATIC_DRAW)
lgl.vertexAttribPointer(1,2, lgl.FLOAT, false,0,0)
lgl.enableVertexAttribArray(1)

const loadImage= () => new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
        resolve(image)
    })
    image.src = './image.jpg'
})
const run = async () => {

    const image = await loadImage()
    const texture = lgl.createTexture();
    lgl.bindTexture(lgl.TEXTURE_2D, texture )
    lgl.texImage2D(lgl.TEXTURE_2D, 0, lgl.RGBA, 640, 426,0, lgl.RGBA, lgl.UNSIGNED_BYTE, image)
    
    lgl.generateMipmap(lgl.TEXTURE_2D)
    
    lgl.drawArrays(lgl.TRIANGLES, 0, 6)
}


run();
let camera = navigator.mediaDevices.getUserMedia({video: true, exact: leftCameraID})
    .then (stream => {
        console.log(stream)
    })

