// server.ts
import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const expressApp = express();
    const httpServer = createServer(expressApp);
    const io = new Server(httpServer);

    // Socket.IO の接続処理
    io.on('connection', (socket) => {
        console.log('New client connected');

        // 例：ルーム参加イベント
        socket.on('join-room', (roomId: string, userId: string | number) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            // 同じルームの他のユーザーに通知
            socket.to(roomId).emit('user-connected', userId);

            // シグナリングメッセージの転送
            socket.on('offer', (data) => {
                socket.to(roomId).emit('offer', data);
            });
            socket.on('answer', (data) => {
                socket.to(roomId).emit('answer', data);
            });
            socket.on('ice-candidate', (data) => {
                socket.to(roomId).emit('ice-candidate', data);
            });
        });
    });

    // Next.js の全リクエストを Express 経由で処理
    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
