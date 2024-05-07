import http from 'http'
import path from 'path'
import { spawn } from 'child_process'
import express from 'express'
import { Server as SocketIO } from 'socket.io'
import cors from 'cors'
import { URL, fileURLToPath } from 'url'

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
// const path = require('path')

// app.use(express.static(path.join(path.dirname(), 'public')));
// app.use(cors)
var rtmpUrl
var streamKey
// app.get('/api/',(req,res) => {
//     res.send("<h1>hello</h1>")
//     })
app.get('/', (req, res) =>{
    // rtmpUrl = req.query.rtmpUrl
    // streamKey = req.query.streamKey
    // console.log(req.query)
    // const options = [
    //     '-i',
    //     '-',
    //     '-c:v', 'libx264',
    //     '-preset', 'ultrafast',
    //     '-tune', 'zerolatency',
    //     '-r', `${25}`,
    //     '-g', `${25 * 2}`,
    //     '-keyint_min', 25,
    //     '-crf', '25',
    //     '-pix_fmt', 'yuv420p',
    //     '-sc_threshold', '0',
    //     '-profile:v', 'main',
    //     '-level', '3.1',
    //     '-c:a', 'aac',
    //     '-b:a', '128k',
    //     '-ar', 128000 / 4,
    //     '-f', 'flv',
    //     `${rtmpUrl}/${streamKey}`,
    // ];
    
    // const ffmpegProcess = spawn('ffmpeg', options);
    
    // ffmpegProcess.stdout.on('data', (data) => {
    //     console.log(`ffmpeg stdout: ${data}`);
    // });
    
    // ffmpegProcess.stderr.on('data', (data) => {
    //     console.error(`ffmpeg stderr: ${data}`);
    // });
    
    // ffmpegProcess.on('close', (code) => {
    //     console.log(`ffmpeg process exited with code ${code}`);
    // });
    // console.log("hello");
    res.sendFile(__dirname,'public','index.html');
    // console.log("hello");
    // res.send("hello")
})



io.on('connection', socket => {
    const url = new URL(socket.handshake.headers.referer);
    const rtmpUrl = url.searchParams.get("rtmpUrl");
    const streamKey = url.searchParams.get("streamKey");
    const options = [
        '-i',
        '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-r', `${25}`,
        '-g', `${25 * 2}`,
        '-keyint_min', 25,
        '-crf', '25',
        '-pix_fmt', 'yuv420p',
        '-sc_threshold', '0',
        '-profile:v', 'main',
        '-level', '3.1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', 128000 / 4,
        '-f', 'flv',
        `${rtmpUrl}/${streamKey}`,
    ];
    
    const ffmpegProcess = spawn('ffmpeg', options);
    console.log('Socket Connected', socket.id);
    socket.on('binarystream', stream => {
        console.log('Binary Stream Incommming...')
        ffmpegProcess.stdin.write(stream, (err) => {
            console.log('Err', err)
        })
    })
})

server.listen(9000, () => console.log(`HTTP Server is runnning on PORT 9000`))