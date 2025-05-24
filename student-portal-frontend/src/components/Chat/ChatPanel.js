import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './ConversationList';
import MessageArea from './MessageArea';

const ChatPanel = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations/');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}/messages/`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!selectedConversation) return;

    try {
      const response = await axios.post(`/api/conversations/${selectedConversation.id}/messages/`, {
        content,
      });
      setMessages([...messages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createNewConversation = async (participantIds) => {
    try {
      const response = await axios.post('/api/conversations/', {
        participants: participantIds,
      });
      setConversations([...conversations, response.data]);
      setSelectedConversation(response.data);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)]">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 border-r border-gray-200">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onNewConversation={createNewConversation}
          />
        </div>
        <div className="col-span-9">
          <MessageArea
            messages={messages}
            selectedConversation={selectedConversation}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPanel; 