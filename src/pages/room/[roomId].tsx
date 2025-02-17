// pages/room/[roomId].tsx
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const RoomPage = () => {
    const router = useRouter();
    const { roomId } = router.query; // URL の [roomId] を取得

    // video 要素の ref
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // WebRTC 用オブジェクトの ref
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!roomId) return; // まだ roomId がセットされていない場合は何もしない

        // Socket.IO クライアントの生成（同一オリジン）
        const socket = io();
        socketRef.current = socket;

        // イベントリスナーは早い段階で登録する
        socket.on('connect', () => {
            console.log('シグナリングサーバに接続しました', socket.id);
            // ルームに参加
            socket.emit('join-room', roomId);
        });

        socket.on('offer', async (callerId: string, offer: RTCSessionDescriptionInit) => {
            console.log('オファーを受信:', offer);
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit('answer', roomId, answer);
            }
        });

        socket.on('answer', async (calleeId: string, answer: RTCSessionDescriptionInit) => {
            console.log('アンサーを受信:', answer);
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on('candidate', async (id: string, candidate: RTCIceCandidateInit) => {
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error('ICE Candidate の追加エラー:', err);
            }
        });

        socket.on('user-connected', async (newUserId: string) => {
            console.log('新規ユーザが参加:', newUserId);
            if (peerConnectionRef.current && peerConnectionRef.current.signalingState === 'stable') {
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socket.emit('offer', roomId, offer);
            }
        });

        // 次に、メディアデバイスの取得と RTCPeerConnection の設定を行う
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(async stream => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // RTCPeerConnection の生成（STUN サーバ付き）
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                peerConnectionRef.current = pc;

                // ローカルストリームのトラックをピアコネクションに追加
                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                // ICE Candidate 発見時の処理
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('candidate', roomId, event.candidate);
                    }
                };

                // リモート側からトラックを受信したら video 要素に設定
                pc.ontrack = (event) => {
                    if (remoteVideoRef.current && event.streams && event.streams[0]) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                        console.log('リモートトラックを受信:', event.streams[0]);
                    }
                };
            })
            .catch(err => {
                console.error('メディアデバイスへのアクセスエラー:', err);
            });

        // クリーンアップ
        return () => {
            socket.disconnect();
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>ルーム: {roomId}</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div>
                    <h2>ローカル映像</h2>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '300px', background: '#000' }}
                    />
                </div>
                <div>
                    <h2>リモート映像</h2>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: '300px', background: '#000' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
