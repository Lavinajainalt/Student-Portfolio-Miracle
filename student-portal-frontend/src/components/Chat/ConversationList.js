import React, { useState } from 'react';
import { FaPlus, FaTimes, FaUser } from 'react-icons/fa';

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
}) => {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [participantId, setParticipantId] = useState('');

  const handleCreateNewChat = () => {
    if (participantId) {
      onNewConversation([parseInt(participantId)]);
      setNewChatDialogOpen(false);
      setParticipantId('');
    }
  };

  const getParticipantNames = (conversation) => {
    return conversation.participants
      .map((p) => `${p.first_name} ${p.last_name}`)
      .join(', ');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setNewChatDialogOpen(true)}
        >
          <FaPlus />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <FaUser />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {getParticipantNames(conversation)}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {conversation.last_message
                  ? conversation.last_message.content
                  : 'No messages yet'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {newChatDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Start New Chat</h2>
              <button
                onClick={() => setNewChatDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participant ID
              </label>
              <input
                type="number"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user ID"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the ID of the user you want to chat with
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNewChatDialogOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewChat}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!participantId}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList; 