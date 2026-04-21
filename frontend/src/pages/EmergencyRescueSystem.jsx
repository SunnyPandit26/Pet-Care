import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, MapPin, Phone, User, Send, 
  CheckCircle, Clock, Navigation, X, 
  Shield, Heart, Stethoscope, ChevronRight, Siren,
  Dog, PawPrint, LocateFixed, AlertCircle, Camera,
  Ban, Loader2, FileText, Download, CreditCard, Wallet, BadgeCheck, Receipt, Banknote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


// Condition options
const conditionOptions = [
  { value: '', label: 'Select Condition', icon: null, color: '', bgColor: '' },
  { value: 'bleeding', label: 'Bleeding', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
  { value: 'not-moving', label: 'Not Moving', icon: Dog, color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { value: 'injured', label: 'Injured', icon: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
  { value: 'unknown', label: 'Unknown', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
];

// Mock vets data (5 vets)
const mockVets = [
  { id: 1, name: 'Dr. Mehta', clinic: 'City Pet Hospital', phone: '+91 98765 43210', distance: '1.2 km', avatar: 'DM', color: 'from-blue-500 to-blue-600', eta: '5 mins' },
  { id: 2, name: 'Dr. Sharma', clinic: 'Happy Paws Clinic', phone: '+91 98765 43211', distance: '2.1 km', avatar: 'DS', color: 'from-emerald-500 to-emerald-600', eta: '8 mins' },
  { id: 3, name: 'Dr. Reddy', clinic: 'Animal Care Center', phone: '+91 98765 43212', distance: '2.8 km', avatar: 'DR', color: 'from-purple-500 to-purple-600', eta: '10 mins' },
  { id: 4, name: 'Dr. Patel', clinic: 'Pet Wellness Hub', phone: '+91 98765 43213', distance: '3.2 km', avatar: 'DP', color: 'from-pink-500 to-pink-600', eta: '12 mins' },
  { id: 5, name: 'Dr. Gupta', clinic: 'VetCare Hospital', phone: '+91 98765 43214', distance: '4.1 km', avatar: 'DG', color: 'from-orange-500 to-orange-600', eta: '15 mins' },
];

// Status steps
const statusSteps = [
  { id: 'sent', label: 'Request Sent', icon: Send },
  { id: 'waiting', label: 'Waiting for Response', icon: Loader2 },
  { id: 'accepted', label: 'Accepted', icon: CheckCircle },
  { id: 'onway', label: 'On the Way', icon: Navigation },
];

// Play siren sound
const playSiren = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.log('Audio context not available');
  }
};

export default function EmergencyRescueSystem() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [currentStep, setCurrentStep] = useState('upload'); // upload, form, sending, waiting, accepted
  const [uploadedImage, setUploadedImage] = useState(null);
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [helperData, setHelperData] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [reportData, setReportData] = useState(null);
  
  // Multi-vet system state
  const [vets, setVets] = useState([]);
  const [acceptedVet, setAcceptedVet] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('sent');
  const [statusMessage, setStatusMessage] = useState('');

  // Post-rescue payment state
  const [rescueCompleted, setRescueCompleted] = useState(false);
  const [showPaymentDecision, setShowPaymentDecision] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'user' or 'fund'
  const [paymentForm, setPaymentForm] = useState({ name: '', phone: '', id: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [rescueCost] = useState(500);
  const [totalFund, setTotalFund] = useState(12450);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result);
          playSiren();
          setCurrentStep('form');
        }
      };
      reader.onerror = () => {
        alert('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Get GPS location
  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setHelperData(prev => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          }));
          setGpsLoading(false);
        },
        (error) => {
          setHelperData(prev => ({
            ...prev,
            location: 'Location access denied - Please enter manually'
          }));
          setGpsLoading(false);
        }
      );
    } else {
      setHelperData(prev => ({
        ...prev,
        location: 'GPS not supported - Please enter manually'
      }));
      setGpsLoading(false);
    }
  };

  // Submit emergency report
  const submitReport = () => {
    if (!uploadedImage) {
      alert('Please upload an image of the dog');
      return;
    }
    if (!condition) {
      alert('Please select the dog\'s condition');
      return;
    }
    if (!helperData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    const report = {
      image: uploadedImage,
      condition: conditionOptions.find(opt => opt.value === condition),
      notes: notes,
      helperName: helperData.name,
      helperPhone: helperData.phone,
      location: helperData.location,
      coordinates: coordinates,
      timestamp: new Date().toISOString()
    };

    setReportData(report);
    
    // Initialize vets with pending status
    const vetsWithStatus = mockVets.map(vet => ({
      ...vet,
      status: 'pending' // pending, accepted, cancelled
    }));
    setVets(vetsWithStatus);
    
    setCurrentStep('sending');
    setCurrentStatus('sent');
    setStatusMessage('Sending request to nearby vets...');

    // Simulate sending process
    setTimeout(() => {
      setCurrentStep('waiting');
      setCurrentStatus('waiting');
      setStatusMessage('Waiting for vets to respond...');
      
      // Simulate one vet accepting after random time (2-5 seconds)
      const acceptDelay = 2000 + Math.random() * 3000;
      
      setTimeout(() => {
        const acceptingVetIndex = Math.floor(Math.random() * vetsWithStatus.length);
        const acceptingVet = vetsWithStatus[acceptingVetIndex];
        
        // Update vets: one accepted, others cancelled
        const updatedVets = vetsWithStatus.map((vet, index) => {
          if (index === acceptingVetIndex) {
            return { ...vet, status: 'accepted' };
          }
          return { ...vet, status: 'cancelled' };
        });
        
        setVets(updatedVets);
        setAcceptedVet(acceptingVet);
        setCurrentStatus('accepted');
        setCurrentStep('accepted');
        setStatusMessage(`${acceptingVet.name} accepted your request!`);
        
        // Move to "On the Way" after 2 seconds
        setTimeout(() => {
          setCurrentStatus('onway');
          setStatusMessage(`${acceptingVet.name} is on the way! 🚑`);
        }, 2000);
        
      }, acceptDelay);
    }, 2000);
  };

  // Reset flow
  const resetFlow = () => {
    setCurrentStep('upload');
    setUploadedImage(null);
    setCondition('');
    setNotes('');
    setHelperData({ name: '', phone: '', location: '' });
    setCoordinates({ lat: null, lng: null });
    setReportData(null);
    setVets([]);
    setAcceptedVet(null);
    setCurrentStatus('sent');
    setStatusMessage('');
    setRescueCompleted(false);
    setShowPaymentDecision(false);
    setPaymentMethod(null);
    setPaymentForm({ name: '', phone: '', id: '' });
    setPaymentSuccess(false);
    setReceiptData(null);
  };

  // Mark rescue as completed
  const markRescueComplete = () => {
    setRescueCompleted(true);
    setShowPaymentDecision(true);
  };

  // Handle payment method selection
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'fund') {
      // Deduct from donation fund
      setTotalFund(prev => prev - rescueCost);
      generateReceipt('Donation Fund');
      setPaymentSuccess(true);
    }
  };

  // Handle user payment submission
  const handleUserPayment = () => {
    if (paymentForm.name && paymentForm.phone) {
      generateReceipt('User Payment');
      setPaymentSuccess(true);
    }
  };

  // Generate receipt
  const generateReceipt = (method) => {
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    setReceiptData({
      transactionId,
      amount: rescueCost,
      method,
      vetName: acceptedVet?.name,
      vetClinic: acceptedVet?.clinic,
      date: new Date().toLocaleString('en-IN'),
      payerName: paymentForm.name || 'Anonymous',
      payerPhone: paymentForm.phone || '-'
    });
  };

  // Download report
  const downloadReport = () => {
    const reportContent = `
EMERGENCY RESCUE REPORT
=======================

Rescue ID: ${Date.now()}
Date & Time: ${formatTimestamp(reportData?.timestamp)}

DOG CONDITION
-------------
Condition: ${reportData?.condition?.label}
Notes: ${reportData?.notes || 'None'}

LOCATION
--------
Address: ${reportData?.location}
GPS: ${reportData?.coordinates?.lat ? `${reportData.coordinates.lat.toFixed(4)}, ${reportData.coordinates.lng.toFixed(4)}` : 'Not available'}

VET DETAILS
-----------
Name: ${acceptedVet?.name}
Clinic: ${acceptedVet?.clinic}
Phone: ${acceptedVet?.phone}

REPORTER INFORMATION
-------------------
Name: ${reportData?.helperName}
Phone: ${reportData?.helperPhone || 'Not provided'}

STATUS: RESCUE COMPLETED
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rescue_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download receipt
  const downloadReceipt = () => {
    const receiptContent = `
RESCUE PAYMENT RECEIPT
======================

Transaction ID: ${receiptData?.transactionId}
Date: ${receiptData?.date}

PAYMENT DETAILS
---------------
Amount Paid: ₹${receiptData?.amount}
Payment Method: ${receiptData?.method}
Payer Name: ${receiptData?.payerName}
Payer Phone: ${receiptData?.payerPhone}

VET DETAILS
-----------
Name: ${receiptData?.vetName}
Clinic: ${receiptData?.vetClinic}

STATUS: PAYMENT TRANSFERRED TO VERIFIED VET ACCOUNT

Thank you for supporting this rescue! ❤️
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${receiptData?.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color for vets
  const getVetStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-gray-300 text-gray-500';
      default: return 'bg-yellow-400 text-yellow-900';
    }
  };

  // Get status icon for vets
  const getVetStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Get status label
  const getVetStatusLabel = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
              <Siren className="w-4 h-4" />
              Emergency Dog Rescue System
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Dog Emergency Rescue
            </h1>
            <p className="text-gray-600">
              Upload a photo, describe the condition, and we'll notify multiple nearby vets.
            </p>
          </motion.div>

          {/* Status Progress */}
          {(currentStep !== 'upload' && currentStep !== 'form') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between max-w-lg mx-auto">
                {statusSteps.map((step, index) => {
                  const isActive = statusSteps.findIndex(s => s.id === currentStatus) >= index;
                  const isCurrent = currentStatus === step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex flex-col items-center ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 
                            isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100'
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                        >
                          <step.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                        </motion.div>
                        <span className="text-xs mt-1 font-medium whitespace-nowrap">{step.label}</span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-12 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all ${
                          isActive ? 'bg-red-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-red-100"
              >
                <div className="text-center">
                  <motion.div 
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Camera className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Dog Photo</h2>
                  <p className="text-gray-600 mb-6">
                    Take a clear photo of the dog. This helps vets prepare before arriving.
                  </p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                  
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Photo
                    </span>
                  </motion.button>
                  
                  <p className="mt-4 text-sm text-red-600 font-medium">
                    * Photo upload is mandatory for emergency reporting
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Form */}
            {currentStep === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Uploaded Evidence Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-red-500" />
                    Uploaded Evidence
                  </h3>
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Dog to be rescued" 
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      onClick={() => setCurrentStep('upload')}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Emergency Details Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Emergency Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Condition Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dog's Condition *
                      </label>
                      <div className="relative">
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white appearance-none"
                        >
                          {conditionOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <ChevronRight className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Selected Condition Display */}
                    {condition && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border-2 ${conditionOptions.find(opt => opt.value === condition)?.borderColor} ${conditionOptions.find(opt => opt.value === condition)?.bgColor}`}
                      >
                        <div className="flex items-center gap-3">
                          {(() => {
                            const ConditionIcon = conditionOptions.find(opt => opt.value === condition)?.icon;
                            return ConditionIcon ? <ConditionIcon className={`w-6 h-6 ${conditionOptions.find(opt => opt.value === condition)?.color}`} /> : null;
                          })()}
                          <div>
                            <span className={`font-bold ${conditionOptions.find(opt => opt.value === condition)?.color}`}>
                              {conditionOptions.find(opt => opt.value === condition)?.label}
                            </span>
                            <p className="text-sm text-gray-600">Selected condition</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Describe the dog's appearance, exact location, behavior, or any other important details..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Helper Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500" />
                    Your Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={helperData.name}
                          onChange={(e) => setHelperData({ ...helperData, name: e.target.value })}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={helperData.phone}
                          onChange={(e) => setHelperData({ ...helperData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dog's Location *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={helperData.location}
                          onChange={(e) => setHelperData({ ...helperData, location: e.target.value })}
                          placeholder="e.g., Near City Mall, Main Road, Sector 15"
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                        />
                        <motion.button
                          onClick={getCurrentLocation}
                          disabled={gpsLoading}
                          className="px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {gpsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <LocateFixed className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                      {coordinates.lat && (
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          GPS: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Emergency Button */}
                <motion.button
                  onClick={submitReport}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    🚨 Report Emergency
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Sending to Vets */}
            {currentStep === 'sending' && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-red-100"
              >
                <div className="text-center mb-6">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-red-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Send className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{statusMessage}</h3>
                  <p className="text-gray-600 text-sm">Notifying 5 nearby veterinary clinics</p>
                </div>

                {/* Vets List - Pending */}
                <div className="space-y-3">
                  {vets.map((vet, index) => (
                    <motion.div
                      key={vet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${vet.color} flex items-center justify-center text-white font-bold`}>
                        {vet.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{vet.name}</h4>
                        <p className="text-sm text-gray-600">{vet.clinic} • {vet.distance}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400 text-yellow-900 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Waiting for Response */}
            {currentStep === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-red-100"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{statusMessage}</h3>
                  <p className="text-gray-600 text-sm">Vets are reviewing your emergency report</p>
                </div>

                {/* Vets List - Animating */}
                <div className="space-y-3">
                  {vets.map((vet, index) => (
                    <motion.div
                      key={vet.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        vet.status === 'accepted' ? 'border-green-200 bg-green-50' :
                        vet.status === 'cancelled' ? 'border-gray-200 bg-gray-100' :
                        'border-yellow-200 bg-yellow-50'
                      }`}
                      animate={vet.status === 'pending' ? { 
                        borderColor: ['#fef08a', '#fbbf24', '#fef08a'],
                      } : {}}
                      transition={{ repeat: vet.status === 'pending' ? Infinity : 0, duration: 1.5 }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${vet.color} flex items-center justify-center text-white font-bold ${
                        vet.status === 'cancelled' ? 'opacity-50 grayscale' : ''
                      }`}>
                        {vet.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${vet.status === 'cancelled' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {vet.name}
                        </h4>
                        <p className={`text-sm ${vet.status === 'cancelled' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {vet.clinic} • {vet.distance}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getVetStatusColor(vet.status)}`}>
                        {getVetStatusIcon(vet.status)}
                        {getVetStatusLabel(vet.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Accepted */}
            {currentStep === 'accepted' && acceptedVet && (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Success Banner */}
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white text-center"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                >
                  <motion.div 
                    className="flex items-center justify-center gap-2 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1">✅ {acceptedVet.name} accepted your request!</h3>
                  {currentStatus === 'onway' && (
                    <motion.p 
                      className="text-white/90 flex items-center justify-center gap-2 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Navigation className="w-5 h-5 animate-pulse" />
                      On the way 🚑
                    </motion.p>
                  )}
                </motion.div>

                {/* Accepted Vet Card */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${acceptedVet.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      <Stethoscope className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{acceptedVet.name}</h3>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          ACCEPTED
                        </span>
                      </div>
                      <p className="text-gray-600">{acceptedVet.clinic}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {acceptedVet.distance}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          ETA: {acceptedVet.eta}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-4 h-4 text-green-500" />
                          {acceptedVet.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${acceptedVet.phone}`}
                      className="w-full block py-3 bg-blue-500 text-white font-semibold rounded-xl text-center hover:bg-blue-600 transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" />
                        Call {acceptedVet.name}
                      </span>
                    </a>
                  </div>
                </motion.div>

                {/* Other Vets - Cancelled */}
                <motion.div 
                  className="bg-gray-50 rounded-2xl p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-sm text-gray-500 mb-3 text-center">Other vets (automatically cancelled)</p>
                  <div className="space-y-2">
                    {vets.filter(v => v.status === 'cancelled').map((vet, index) => (
                      <motion.div
                        key={vet.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 opacity-60"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center text-white text-sm font-bold grayscale">
                          {vet.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-500 line-through">{vet.name}</h4>
                          <p className="text-xs text-gray-400">{vet.clinic}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-xs">
                          Cancelled
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Emergency Report Summary */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Emergency Report Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-24">Time:</span>
                      <span className="text-gray-900 font-medium">{formatTimestamp(reportData?.timestamp)}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-24">Condition:</span>
                      <span className={`font-semibold ${reportData?.condition?.color}`}>
                        {reportData?.condition?.label}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-24">Reporter:</span>
                      <span className="text-gray-900">{reportData?.helperName}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-24">Location:</span>
                      <span className="text-gray-900">{reportData?.location}</span>
                    </div>
                    {reportData?.coordinates?.lat && (
                      <div className="flex gap-4">
                        <span className="text-gray-500 w-24">GPS:</span>
                        <span className="text-gray-900">
                          {reportData.coordinates.lat.toFixed(4)}, {reportData.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    )}
                    {reportData?.notes && (
                      <div className="pt-3 border-t border-gray-100">
                        <span className="text-gray-500 block mb-1">Notes:</span>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{reportData.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className="text-gray-500 text-sm block mb-2">Evidence Photo:</span>
                    <img 
                      src={reportData?.image} 
                      alt="Evidence" 
                      className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </motion.div>

                {/* Mark Rescue Complete Button - Only show if not completed */}
                {!rescueCompleted && (
                  <motion.button
                    onClick={markRescueComplete}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BadgeCheck className="w-5 h-5" />
                    Mark Rescue as Completed
                  </motion.button>
                )}

                {/* Rescue Completed Banner */}
                {rescueCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg p-5 text-white text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">✅ Rescue Completed!</h3>
                    <p className="text-white/90 text-sm mt-1">The dog has been successfully rescued and treated.</p>
                  </motion.div>
                )}

                {/* Emergency Report - Download Option */}
                {rescueCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Emergency Report Generated</h3>
                        <p className="text-sm text-gray-500">Rescue ID: {Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                      <p className="text-gray-600 mb-2"><strong>Dog Condition:</strong> {reportData?.condition?.label}</p>
                      <p className="text-gray-600 mb-2"><strong>Rescue Location:</strong> {reportData?.location}</p>
                      <p className="text-gray-600 mb-2"><strong>Vet:</strong> {acceptedVet?.name} ({acceptedVet?.clinic})</p>
                      <p className="text-gray-600"><strong>Treatment:</strong> Emergency first aid administered, vitals stabilized, scheduled for follow-up care.</p>
                    </div>

                    <motion.button
                      onClick={downloadReport}
                      className="w-full py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      Download Report
                    </motion.button>
                  </motion.div>
                )}

                {/* Payment Decision UI */}
                {showPaymentDecision && !paymentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-amber-600" />
                      Payment for Rescue Services
                    </h3>
                    <p className="text-gray-600 mb-5 text-sm">
                      Amount to pay: <span className="font-bold text-amber-600 text-lg">₹{rescueCost}</span>
                    </p>

                    {paymentMethod === null && (
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          onClick={() => handlePaymentMethod('user')}
                          className="py-4 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CreditCard className="w-6 h-6" />
                          <span className="text-sm">I will pay for this rescue</span>
                        </motion.button>

                        <motion.button
                          onClick={() => handlePaymentMethod('fund')}
                          className="py-4 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Wallet className="w-6 h-6" />
                          <span className="text-sm">Use Donation Fund</span>
                        </motion.button>
                      </div>
                    )}

                    {/* User Payment Form */}
                    {paymentMethod === 'user' && !paymentSuccess && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-gray-600 mb-4">Please enter your details to complete the payment of ₹{rescueCost}</p>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                          <input
                            type="text"
                            value={paymentForm.name}
                            onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={paymentForm.phone}
                            onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ID Number (Optional)</label>
                          <input
                            type="text"
                            value={paymentForm.id}
                            onChange={(e) => setPaymentForm({ ...paymentForm, id: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            placeholder="Aadhar / PAN / Any ID"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <motion.button
                            onClick={() => setPaymentMethod(null)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Back
                          </motion.button>
                          <motion.button
                            onClick={handleUserPayment}
                            disabled={!paymentForm.name || !paymentForm.phone}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Pay ₹{rescueCost}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Payment Success Messages */}
                {paymentSuccess && receiptData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    {/* Success Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-5 text-white text-center">
                      <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                      {receiptData.method === 'User Payment' ? (
                        <>
                          <h3 className="text-lg font-bold">Payment Successful!</h3>
                          <p className="text-white/90 text-sm">Thank you for supporting this rescue ❤️</p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold">₹{rescueCost} Paid from Donation Fund</h3>
                          <p className="text-white/90 text-sm">Payment transferred to verified vet account</p>
                        </>
                      )}
                    </div>

                    {/* Receipt Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 border border-green-100"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Payment Receipt</h3>
                          <p className="text-sm text-gray-500">TXN: {receiptData.transactionId}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mb-5 bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Paid:</span>
                          <span className="font-bold text-gray-900">₹{receiptData.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium text-gray-900">{receiptData.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vet:</span>
                          <span className="font-medium text-gray-900">{receiptData.vetName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium text-gray-900">{receiptData.date}</span>
                        </div>
                        {receiptData.payerName && receiptData.payerName !== 'Anonymous' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Payer:</span>
                            <span className="font-medium text-gray-900">{receiptData.payerName}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        onClick={downloadReceipt}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="w-5 h-5" />
                        Download Receipt
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Reset Button */}
                <motion.button
                  onClick={resetFlow}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Report Another Emergency
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
