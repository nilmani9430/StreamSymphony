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

var rtmpUrl
var streamKey

app.get('/', (req, res) =>{
    res.sendFile(__dirname,'public','index.html');

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