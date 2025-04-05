import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import CurrentLocationMap from '../../components/Map/Map'
import axios from 'axios';

import ReportForm from './components/ReportFrom';
import ChatbotAssistant from './components/ChatbotAssistance';

// Mock components
const Button = ({ size, className, children, fun = () => { } }) => {
  const sizeClasses = {
    lg: 'py-3 px-6 text-lg'
  };

  return (
    <button onClick={fun}
      className={`bg-black text-white rounded transition-colors hover:bg-gray-800 ${sizeClasses[size] || 'py-2 px-4'} ${className || ''}`}
    >
      {children}
    </button>
  );
};

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg overflow-hidden shadow-md ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="text-gray-600">
    {children}
  </p>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // Clone children and pass activeTab state
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
};

const TabsList = ({ className, children, activeTab, setActiveTab }) => {
  // Clone TabsTrigger children and pass state
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return (
    <div className={`flex rounded-md bg-gray-100 p-1 ${className || ''}`}>
      {childrenWithProps}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    className={`flex-1 text-center py-2 px-4 rounded ${activeTab === value
      ? 'bg-white text-black-600 shadow-sm'
      : 'text-gray-600 hover:text-gray-900'
      }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }) => {
  if (value !== activeTab) return null;
  return <div>{children}</div>;
};


export default function ReportPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording audio
  const startRecording = async () => {
    try {
      // Reset previous recordings
      audioChunksRef.current = [];
      setAudioBlob(null);
      setAudioURL('');
      setError('');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create new MediaRecorder instance with specific MIME type
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Specify codec for better compatibility
      });
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording completion
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setAudioURL(audioUrl);
      };

      // Start recording with a timeslice to ensure data is collected periodically
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure you have granted permission.');
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Upload recorded audio to Cloudinary
  const uploadRecording = async () => {
    if (!audioBlob) {
      setError('Please record audio first');
      return;
    }

    setLoading(true);

    try {
      // Create a proper filename with extension
      const fileName = `recording-${Date.now()}.webm`;

      // Create a File object instead of using the Blob directly
      const audioFile = new File([audioBlob], fileName, {
        type: 'audio/webm',
        lastModified: Date.now()
      });

      // Prepare the form data with the file
      const formData = new FormData();
      formData.append('audio', audioFile);

      // Ensure the form data is properly assembled
      // (You can log this for debugging, but it won't show the full content)
      console.log('FormData created:', formData);

      // Send to the server with proper timeout and size settings
      const response = await axios.post('http://localhost:4000/api/upload-audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000, // Increase timeout for larger files
          maxContentLength: 10 * 1024 * 1024 // 10MB max size
        }
      );

      setUploadedAudio(response.data.audioData);
      setLoading(false);

    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload audio. ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };
  const [chatMsg, setChatMsg] = useState('')
  const getChat = async (e) => {
    e.preventDefault();

    console.log("step 1", chatMsg);

    const formData = {
      "crime_type": chatMsg,
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/crime-guidance', formData, {
        headers: {
          'Content-Type': 'application/json',  // Use application/json instead of multipart/form-data
        },
      });

      console.log(response);
    } catch (error) {
      console.error("Error during the request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <a href="/" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </a>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report an Incident</CardTitle>
                <CardDescription>
                  Fill out the form below to report a crime or suspicious activity. All reports are reviewed by law
                  enforcement before being published.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="form">
                  <TabsList className="grid grid-cols-2 mb-6 w-full">
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="voice">Voice Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="form">
                    {/* form */}
                    <ReportForm />
                  </TabsContent>
                  <TabsContent value="voice">
                    <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-gray-50 rounded-xl shadow-lg">
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center shadow-xl mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-gray-700"
                        >
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                      </div>

                      <h3 className="text-2xl font-semibold text-gray-900">Voice Reporting</h3>
                      <p className="text-center text-gray-600 max-w-md">
                        Click the button below to start recording your report. Speak clearly and provide as much detail as possible.
                      </p>

                      <div className="audio-recorder-container mt-6 w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
                        <div className='flex justify-center'>
                          <h2 className="text-xl font-semibold text-gray-900">Record and Upload Audio</h2>

                        </div>

                        <div className="recorder-controls mt-4 flex justify-center space-x-4">
                          {!isRecording ? (
                            <button
                              onClick={startRecording}
                              className="start-btn py-2 px-6 bg-black text-white rounded-full hover:bg-gray-700 transition-all"
                              disabled={isRecording}
                            >
                              Start Recording
                            </button>
                          ) : (
                            <button
                              onClick={stopRecording}
                              className="stop-btn py-2 px-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                              disabled={!isRecording}
                            >
                              Stop Recording
                            </button>
                          )}
                        </div>

                        {audioURL && (
                          <div className="recorded-audio mt-6 ">
                            <h3 className="text-lg font-medium text-gray-800">Recording Preview:</h3>
                            <audio controls src={audioURL} className="w-full mt-2">
                              Your browser does not support the audio element.
                            </audio>
                            <div className='flex justify-center'>

                              <button
                                onClick={uploadRecording}
                                disabled={loading || !audioBlob}
                                className="upload-btn mt-4 py-2 px-6 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
                              >
                                {loading ? 'Uploading...' : 'Upload to Cloudinary'}
                              </button>
                            </div>
                          </div>
                        )}

                        {error && <p className="error-message mt-4 text-red-600 font-medium">{error}</p>}

                        {loading && <div className='flex justify-center w-full'> <p className="mt-4 ml-3 text-gray-600">Uploading your audio recording...</p></div>}

                        {uploadedAudio && (
                          <div className="uploaded-audio mt-6 bg-green-100 p-4 rounded-md shadow-md">
                            <h3 className="text-lg font-medium text-gray-800">Upload Successful!</h3>
                            {/* <p className="text-gray-700">Audio URL: <a href={uploadedAudio.path} target="_blank" rel="noopener noreferrer" className="text-blue-600">{uploadedAudio.path}</a></p> */}

                            <div className="audio-player mt-4">
                              <h4 className="text-lg text-gray-700">Uploaded Audio:</h4>
                              <audio controls src={uploadedAudio.path} className="w-full mt-2">
                                Your browser does not support the audio element.
                              </audio>
                            </div>

                            <div className="audio-details mt-4">
                              <h4 className="text-lg text-gray-700">File Details:</h4>
                              <p className="text-gray-600">Format: {uploadedAudio.format}</p>
                              <p className="text-gray-600">Size: {Math.round(uploadedAudio.size / 1024)} KB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          {/* Ai Chat boat */}
          <div>
            <ChatbotAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}