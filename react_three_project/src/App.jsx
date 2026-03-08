import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import GiftBox from './giftbox'; // Make sure the file name matches exactly
import './App.css';





export default function App() {
  const [uiVisible, setUiVisible] = useState(true);
  const [textures, setTextures] = useState(Array(6).fill(null));
  // ADD THIS LINE: This controls the opening animation
  const [isOpen, setIsOpen] = useState(false); 

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const loader = new THREE.TextureLoader();
      loader.load(event.target.result, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; 
        const newTextures = [...textures];
        newTextures[index] = tex;
        setTextures(newTextures);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="canvas-container">
      <div id="ui">
        <div id="ui-header">
          <span id="ui-title">📷 Add photos to cube faces</span>
          {/* ADD THIS BUTTON: To open the gift */}
          <button 
            id="open-btn" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ backgroundColor: '#FFD700', color: 'black', fontWeight: 'bold', marginLeft: '10px' }}
          >
            {isOpen ? 'CLOSE BOX' : 'OPEN BOX'}
          </button>
          
          <button id="toggle-btn" onClick={() => setUiVisible(!uiVisible)}>
            {uiVisible ? 'Hide ▲' : 'Photos ▼'}
          </button>
        </div>
        
        {uiVisible && (
          <div id="ui-body">
            <div className="face-buttons">
              {['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'].map((label, i) => (
                <label key={i} className="face-label">
                  {label}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                  <span className={`status ${textures[i] ? 'loaded' : ''}`}>
                    {textures[i] ? '✅ Loaded' : 'no image'}
                  </span>
                </label>
              ))}
            </div>
            <div id="hint" style={{ marginTop: '8px', fontSize: '10px', color: '#555' }}>
              Images stay on your PC — nothing is uploaded
            </div>
          </div>
        )}
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 16]} fov={75} />
        <color attach="background" args={['#000008']} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
        <pointLight position={[-5, 5, 5]} color="#FFD700" intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* CRITICAL: Pass the isOpen state to the GiftBox component */}
        <GiftBox textures={textures} isOpen={isOpen} />
      </Canvas>
    </div>
  );
}