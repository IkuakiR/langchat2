// pages/api/socket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';

interface SocketServer extends HTTPServer {
    io?: SocketIOServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: Socket & {
        server: SocketServer;
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (!res.socket) {
        console.error('レスポンスに socket が存在しません。');
        return res.status(500).end();
    }

    if (res.socket.server.io) {
        console.log('Socket.IO サーバはすでに起動済みです');
    } else {
        console.log('Socket.IO サーバを初期化します...');
        const io = new SocketIOServer(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('クライアント接続:', socket.id);

            socket.on('join-room', (roomId: string) => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} がルーム ${roomId} に参加しました`);
                socket.to(roomId).emit('user-connected', socket.id);
            });

            socket.on('offer', (roomId: string, offer: RTCSessionDescriptionInit) => {
                console.log(`Socket ${socket.id} からルーム ${roomId} へ offer を転送`);
                socket.to(roomId).emit('offer', socket.id, offer);
            });

            socket.on('answer', (roomId: string, answer: RTCSessionDescriptionInit) => {
                console.log(`Socket ${socket.id} からルーム ${roomId} へ answer を転送`);
                socket.to(roomId).emit('answer', socket.id, answer);
            });

            socket.on('candidate', (roomId: string, candidate: RTCIceCandidateInit) => {
                console.log(`Socket ${socket.id} からルーム ${roomId} へ candidate を転送`);
                socket.to(roomId).emit('candidate', socket.id, candidate);
            });
        });
    }
    res.end();
}
