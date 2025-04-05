import React, { useState, useEffect } from 'react';
import CurrentLocationMap from '../../../components/Map/Map'
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
const ReportForm = () => {

  const [reportUrl, setReportUrl] = useState('')
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    crimetype: "",
    description: "",
    crimeDate: "",
    crimeTime: "",
    location: {
      coordinates: [], // [longitude, latitude]
      address: ""
    },
    crimeimageURL: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationUpdate = (coordinates, address) => {
    setFormData({
      ...formData,
      location: {
        coordinates: [coordinates[1], coordinates[0]], // MongoDB uses [longitude, latitude]
        address: address
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  useEffect(() => {
    console.log(reportUrl)
  }, [reportUrl])


  // Add this function to your React component
  // Add this function to your React component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let uploadedImageURL = "";

    try {
      // Step 1: Upload image if selected
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);

        const imageUploadResponse = await fetch('http://localhost:4000/api/upload-image', {
          method: 'POST',
          body: imageFormData
        });

        const imageResult = await imageUploadResponse.json();
        if (imageUploadResponse.ok) {
          uploadedImageURL = imageResult.imageData.url;
        } else {
          setMessage(`Error uploading image: ${imageResult.message}`);
          setLoading(false);
          return;
        }
      }

      // Step 2: Format the data for the API
      const incidentData = {
        fullName: formData.fullName || "",
        email: formData.email || "",
        crimetype: formData.crimetype,
        location: {
          latitude: parseFloat(formData.location.coordinates[0]),
          longitude: parseFloat(formData.location.coordinates[1]),
          address: formData.location.address
        },
        crimeDate: formData.crimeDate,
        crimeTime: formData.crimeTime,
        description: formData.description,
        crimeimageURL: uploadedImageURL // ✅ Include the image URL here
      };

      // Step 3: Submit the report
      const response = await fetch('http://localhost:4000/report/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Incident report submitted successfully!');
        setFormData({
          fullName: '',
          email: '',
          crimetype: '',
          location: { coordinates: [], address: '' },
          crimeDate: '',
          crimeTime: '',
          description: '',
          crimeimageURL: ''
        });
        setSelectedFile(null);
        setReportUrl(`${window.location.origin}/report/${result.data._id}`)
        console.log(result)
      } else {
        setMessage(`Error: ${result.message || 'Failed to submit report'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error: Network or server issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Update the location handler to ensure numeric values
  // const handleLocationUpdate = (position) => {
  //   if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
  //     setFormData({
  //       ...formData,
  //       location: {
  //         lat: position.lat,
  //         lng: position.lng
  //       }
  //     });
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6">Report an Incident</h2>

        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter name (Optional)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter email (Optional)"
            />
          </div>
          <label className="block text-gray-700 mb-2">Incident Type</label>
          <select
            name="crimetype"
            value={formData.crimetype}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select incident type</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Suspicious Activity">Suspicious Activity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Location</label>
          <div className="border rounded p-4">
            <CurrentLocationMap
              formData={formData}
              onLocationSelect={handleLocationUpdate}
            />
            <p className="mt-2 text-sm text-gray-600">
              Drag the marker to pinpoint the exact location of the incident
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="crimeDate"
              value={formData.crimeDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Time</label>
            <input
              type="time"
              name="crimeTime"
              value={formData.crimeTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            placeholder="Provide details about the incident..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Evidence (optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">
              {selectedFile ? selectedFile.name : "click to browse"}
            </p>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div
              className='bg-black text-white rounded transition-colors hover:bg-gray-800 px-4 h-[40px] cursor-pointer flex items-center justify-center w-[250px] m-auto'
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <p>Choose</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;