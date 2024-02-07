'use client'

import React, { FormEvent, FormEventHandler, useState } from 'react'
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import styled from 'styled-components';

const MessagesList = styled.ul`
    list-style-type: none; 
    margin: 0; 
    padding: 0; 
`;

const Message = styled.li`
    padding: 0.5rem 1rem; 

    &:nth-child(odd) { 
        background: #efefef; 
    }
`;

const MessageForm = styled.form`
    background: rgba(0, 0, 0, 0.15); 
    padding: 0.25rem; 
    position: fixed; 
    bottom: 0; 
    left: 0; 
    right: 0; 
    display: flex; 
    height: 3rem; 
    box-sizing: border-box; 
    backdrop-filter: blur(10px); 
`;

const MessageInput = styled.input`
    border: none; 
    padding: 0 1rem; 
    flex-grow: 1; 
    border-radius: 2rem; 
    margin: 0.25rem;

    &:focus { 
        outline: none; 
    }
`;

const SendButton = styled.button`
    border: none; 
    padding: 0 1rem; 
    margin: 0.25rem; 
    border-radius: 3px; 
    font-weight: 700;
    outline: none; 
    color: #000;
    transition: .3s all ease-in-out;

    &:hover {
        background-color: #000;
        color: #fff;
    }
`;

const Chat: React.FC<{ room?: string}> = ({ room }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    const [currentInputMessage, setCurrentInputMessage] = useState<string>('');

    useEffect(() => {
        const newSocket = io('http://192.168.239:3001/global');
        const initSocket = async (socket: Socket) => {
            socket.on('connected', (message: string) => {
                socket.emit('joinRoom', room);
            })
    
            socket.on('joinRoom', message => {
                console.log(message)
            })
    
            socket.on('received', (message: string) => {
                setMessages((prevMessages: string[]) => [...prevMessages, message]);
            });
        }

        initSocket(newSocket);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    const handleMessageSubmit: FormEventHandler = (event: FormEvent) => {
        event.preventDefault();
        
        try {
            socket?.emit('message', { room, message: currentInputMessage });
            setCurrentInputMessage('');
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>      
            <MessagesList>
                { messages && 
                    messages.map((message: string, idx: number) => 
                        <Message key={idx}>{message}</Message>
                    )
                }
            </MessagesList>

            <MessageForm onSubmit={handleMessageSubmit}>
                <MessageInput  
                    autoComplete="off" 
                    value={currentInputMessage} 
                    onChange={(event: any) => setCurrentInputMessage(event.target.value)} 
                />
                
                <SendButton>Send</SendButton>
            </MessageForm>
        </div>
    )
}

export default Chat;