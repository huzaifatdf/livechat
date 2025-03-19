
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Chat() {

    const [input, setInput] = useState('');

        const [messages, setMessages] = useState([]);
        useEffect(() => {
            console.log("Listening for messages...");

            const chatChannel = window.Echo.channel('chat');

            chatChannel.listen('.NewChatMessage', (e) => {
                console.log("Received event:", e);
                setMessages(prevMessages => [...prevMessages, e.message]);
            });

            return () => {
                console.log("Leaving channel...");
                chatChannel.stopListening('.NewChatMessage');
                window.Echo.leaveChannel('chat');
            };
        }, []);



    const sendMessage = async () => {
        await axios.post('/send-message', { message: input });
        setInput('');
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Chat
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </AuthenticatedLayout>
    );
}
