// pages/index.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!roomId) return;
        // 例: /room/abc123
        router.push(`/room/${roomId}`);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>ビデオ通話に参加</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="ルームIDを入力"
                    style={{ padding: '0.5rem', fontSize: '1rem' }}
                />
                <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                    参加
                </button>
            </form>
        </div>
    );
};

export default IndexPage;
