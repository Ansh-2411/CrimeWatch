import React, { useState } from 'react';
import axios from 'axios';
// Card components with improved styling
const Card = ({ className, children }) => (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 w-[450px] h-[700px] ${className || ''}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        {children}
    </div>
);

const CardTitle = ({ children }) => (
    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
        <span className="mr-2 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
            </svg>
        </span>
        {children}
    </h3>
);

const CardDescription = ({ children }) => (
    <p className="text-gray-600 text-sm">
        {children}
    </p>
);

const CardContent = ({ children }) => (
    <div className="p-6">
        {children}
    </div>
);

const ChatbotAssistant = () => {
    const [chatMsg, setChatMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getChat = async (e) => {
        e.preventDefault();

        if (!chatMsg) return; // Don't send empty messages

        // Add the user's message to the messages array
        setMessages([...messages, { sender: 'user', text: chatMsg }]);

        // Show loading state
        setIsLoading(true);

        try {
            // Send the chat message to the backend
            const response = await axios.post('http://127.0.0.1:5000/crime-guidance',
                { crime_type: chatMsg },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);

            // Format the response data into sections
            const formattedResponse = {
                sender: 'bot',
                sections: [
                    { title: 'Legal Rules', content: response.data.legal_rules },
                    { title: 'Filing Guide', content: response.data.filing_guide },
                    { title: 'Victim Rights', content: response.data.victim_rights }
                ]
            };

            // Add the formatted response to messages
            setMessages(prevMessages => [...prevMessages, formattedResponse]);

            // Clear the input field
            setChatMsg('');
        } catch (error) {
            console.error('Error during the request:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: 'bot',
                    text: 'An error occurred while processing your request.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <Card className="sticky top-8 max mx-auto">
            <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                    Our AI assistant can guide you through the reporting process and answer questions about crime reporting.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg bg-gray-50 p-4 h-[510px] flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded ${msg.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-800'
                                    }`}
                            >
                                {msg.text ? (
                                    <p>{msg.text}</p>
                                ) : msg.sections ? (
                                    <div className="space-y-2">
                                        {msg.sections.map((section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                                <h4 className="font-bold text-sm">{section.title}</h4>
                                                <p className="text-sm whitespace-pre-line">{section.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="bg-gray-300 text-gray-800 p-3 rounded">
                                <p className="italic">Assistant is thinking...</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded bg-white border border-gray-300 text-gray-900"
                            placeholder="Type your message..."
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && getChat(e)}
                        />
                        <button
                            onClick={getChat}
                            className="bg-black text-white p-2 rounded"
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>

    );
};

export default ChatbotAssistant;