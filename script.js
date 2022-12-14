const lCanvas = document.createElement('canvas')
const lctx = lCanvas.getContext('2d')
const lVideoElem = document.getElementById('lVideo')
document.querySelector('.canvas-container').appendChild(lCanvas)
const rCanvas = document.createElement('canvas')
const rctx = rCanvas.getContext('2d')
const rVideoElem = document.getElementById('rVideo')
document.querySelector('.canvas-container').appendChild(rCanvas)
let lCameraID, rCameraID;
let lCanvasWidth, lCanvasHeight,rCanvasWidth, rCanvasHeight
let lready = false;
let rReady = false;
let lastTime = 0;

async function getCameraDetails () {
    let devices = await navigator.mediaDevices.enumerateDevices()
    let cameras = devices.filter(device => {
        if(device.kind === "videoinput") return device;
    })
    if(cameras.length < 2) {
        throw new Error('Please connect cameras')
    }

    lCameraID = cameras[1].deviceId;
    rCameraID = cameras[0].deviceId;
    let lCamera = await navigator.mediaDevices.getUserMedia({video: {deviceId: lCameraID}})
    let rCamera = await navigator.mediaDevices.getUserMedia({video: {deviceId: rCameraID}})
    lVideoElem.srcObject = lCamera;
    rVideoElem.srcObject = rCamera;
    lVideoElem.addEventListener('play', () => {
        lCanvasWidth = lCanvas.width = lVideo.clientWidth *1.3;
        lCanvasHeight = lCanvas.height = lVideo.clientHeight*1.3;
        lready = true;
    })
    rVideoElem.addEventListener('play', () => {
        rCanvasWidth = rCanvas.width = rVideo.clientWidth * 1.3;
        rCanvasHeight = rCanvas.height = rVideo.clientHeight * 1.3;
        rReady = true;
    })
}

getCameraDetails()
window.requestAnimationFrame(tick);

function tick(timeStamp) {
    let dt = timeStamp - lastTime;
    lastTime = timeStamp;
    lctx.clearRect(0,0,lCanvasWidth, lCanvasHeight)
    rctx.clearRect(0,0,rCanvasWidth, rCanvasHeight)
    lctx.drawImage(lVideo,0,0,lCanvasWidth, lCanvasHeight)
    rctx.drawImage(rVideo,0,0,rCanvasWidth, rCanvasHeight)
    lctx.fillStyle = "rgba(128,128,128,0.5)"
    lctx.beginPath()
    lctx.arc(lCanvasWidth/2, lCanvasHeight/2, 150, 0, Math.PI * 2, false)
    lctx.fill()
    lctx.fillStyle = "rgba(0,0,0,1)"
    lctx.beginPath()
    lctx.arc(lCanvasWidth/2, lCanvasHeight/2, 75, 0, Math.PI * 2, false)
    lctx.fill()
    rctx.fillStyle = "rgba(128,128,128,0.5)"
    rctx.beginPath()
    rctx.arc(lCanvasWidth/2, lCanvasHeight/2, 150, 0, Math.PI * 2, false)
    rctx.fill()
    rctx.fillStyle = "rgba(0,0,0,1)"
    rctx.beginPath()
    rctx.arc(lCanvasWidth/2, lCanvasHeight/2, 75, 0, Math.PI * 2, false)
    rctx.fill()
    
    window.requestAnimationFrame(tick)
}


