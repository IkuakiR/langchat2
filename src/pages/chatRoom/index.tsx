import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/chatRoom/page.module.scss';
import { io, Socket } from 'socket.io-client';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { ref, push, onValue } from 'firebase/database';
import Link from 'next/link';

type Message = {
    id: string;
    text: string;
    sender: number;
    createdAt: number;
    username: string;
    time: string;
    messageId: string;
    translatedText?: string;
};

const Home = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const roomId = 'room01';

    const [userId, setUserId] = useState<number | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [bookmarkedMessages, setBookmarkedMessages] = useState<Message[]>([]);
    const [translations, setTranslations] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            setUserId(Number(storedId));
        } else {
            const newId = Math.floor(Math.random() * 10000);
            localStorage.setItem('userId', newId.toString());
            setUserId(newId);
        }
    }, []);

    useEffect(() => {
        const storedBookmarks = localStorage.getItem('bookmarks');
        if (storedBookmarks) {
            try {
                setBookmarkedMessages(JSON.parse(storedBookmarks));
            } catch (error) {
                console.error('Error parsing bookmarks:', error);
            }
        }
    }, []);

    useEffect(() => {
        const messagesRef = ref(db, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages: Message[] = [];
            if (data) {
                Object.keys(data).forEach((key) => {
                    loadedMessages.push({
                        id: key,
                        ...data[key],
                    });
                });
                loadedMessages.sort((a, b) => a.createdAt - b.createdAt);
            }
            setChatMessages(loadedMessages);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleSendChat = () => {
        if (chatInput.trim() === '' || userId === null) return;
        const messagesRef = ref(db, 'messages');
        const messageId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const now = new Date();
        push(messagesRef, {
            text: chatInput,
            sender: userId,
            createdAt: now.getTime(),
            username: `User${userId}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageId: messageId,
        });
        setChatInput('');
    };

    const handleBookmark = (msg: Message) => {
        if (msg.sender === userId) return;
        if (bookmarkedMessages.find((m) => m.id === msg.id)) return;
        const newBookmark = { ...msg, translatedText: translations[msg.id] || '', lang: 'english' };
        const newBookmarks = [...bookmarkedMessages, newBookmark];
        setBookmarkedMessages(newBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    };

    const isJapanese = (text: string): boolean => {
        return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FBF]/.test(text);
    };

    useEffect(() => {
        chatMessages.forEach((msg) => {
            if (msg.sender !== userId && !translations[msg.id]) {
                const targetLang = isJapanese(msg.text) ? 'en' : 'ja';
                fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: msg.text, target: targetLang }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.translation) {
                            setTranslations((prev) => ({ ...prev, [msg.id]: data.translation }));
                        }
                    })
                    .catch((error) => console.error('Translation error:', error));
            }
        });
    }, [chatMessages, userId, translations]);

    useEffect(() => {
        if (userId === null) return;
        const socket = io();
        socketRef.current = socket;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                const peerConnection = new RTCPeerConnection(configuration);
                peerConnectionRef.current = peerConnection;
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });
                peerConnection.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', { candidate: event.candidate, room: roomId });
                    }
                };
                socket.emit('join-room', roomId, userId);
            })
            .catch((err) => console.error("Error getting media devices: ", err));

        socket.on('offer', async (data: { offer: RTCSessionDescriptionInit }) => {
            if (!peerConnectionRef.current) return;
            await peerConnectionRef.current.setRemoteDescription(data.offer);
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('answer', { answer, room: roomId });
        });

        socket.on('answer', async (data: { answer: RTCSessionDescriptionInit }) => {
            if (!peerConnectionRef.current) return;
            await peerConnectionRef.current.setRemoteDescription(data.answer);
        });

        socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
            if (!peerConnectionRef.current) return;
            try {
                await peerConnectionRef.current.addIceCandidate(data.candidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        socket.on('user-connected', async () => {
            if (!peerConnectionRef.current) return;
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', { offer, room: roomId });
        });

        return () => {
            socket.disconnect();
            peerConnectionRef.current?.close();
        };
    }, [userId]);

    if (userId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>ルーム01</h1>
            <div className={styles.mainContainer}>
                <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '45vw' }} />
                <div className={styles.textChat}>
                    {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.message} ${msg.sender === userId ? styles.right : styles.left}`}
                            onMouseEnter={() => setHoveredMessageId(msg.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                        >
                            <div className={styles.messageHeader}>
                                <span className={styles.username}>{msg.username}</span>
                                {msg.sender !== userId &&
                                    bookmarkedMessages.find((m) => m.id === msg.id) && (
                                        <span className={styles.bookmarkDot}></span>
                                    )}
                            </div>
                            {msg.sender === userId ? (
                                <div className={styles.messageWrap}>
                                    <span className={styles.time}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <div className={styles.messageText}>{msg.text}</div>
                                </div>
                            ) : (
                                <div className={styles.messageWrap}>
                                    <div className={styles.messageText}>{msg.text}</div>
                                    <span className={styles.time}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {hoveredMessageId === msg.id && (
                                        <button
                                            className={styles.bookmarkButton}
                                            onClick={() => handleBookmark(msg)}
                                        >
                                            <Image
                                                src="/images/bookmarkButton.svg"
                                                alt="Bookmark"
                                                width={40}
                                                height={40}
                                            />
                                        </button>
                                    )}
                                </div>
                            )}
                            {msg.sender !== userId && translations[msg.id] && (
                                <div className={styles.translatedText}>
                                    {translations[msg.id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.chatForm}>
                <div className={styles.inputForm}>
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="メッセージを入力"
                    />
                </div>
                <div onClick={handleSendChat} style={{ cursor: 'pointer' }}>
                    <Image
                        src="/images/sendButton.svg"
                        alt="sendButton"
                        width={50}
                        height={50}
                        className={styles.sendButton}
                    />
                </div>
            </div>
            <Link href={'/chatDone'}>
                <div className={styles.finishButton}>
                    <Image
                        src="/images/finishButton.svg"
                        alt="Finish Call"
                        width={60}
                        height={60}
                        className={styles.sendButton}
                    />
                </div>
            </Link>
        </div>
    );
};

export default Home;