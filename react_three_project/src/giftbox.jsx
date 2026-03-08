import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
//import { Text } from '@react-three/drei';




import { Text, Sparkles } from '@react-three/drei'; // Add Sparkles to your imports

export default function GiftBox({ textures, isOpen }) { // Added isOpen prop
  const groupRef = useRef();
  const faceRefs = useRef([]);
  const textRef = useRef();

  const faceConfigs = [
    { pos: [0, 0, 1.5], rot: [0, 0, 0], color: 0x006400 },
    { pos: [0, 0, -1.5], rot: [0, Math.PI, 0], color: 0x228B22 },
    { pos: [-1.5, 0, 0], rot: [0, -Math.PI / 2, 0], color: 0x008000 },
    { pos: [1.5, 0, 0], rot: [0, Math.PI / 2, 0], color: 0x32CD32 },
    { pos: [0, 1.5, 0], rot: [-Math.PI / 2, 0, 0], color: 0x00AA00 },
    { pos: [0, -1.5, 0], rot: [Math.PI / 2, 0, 0], color: 0x00BB00 },
  ];

  useFrame((state, delta) => {
  const { mouse, clock } = state;

  if (groupRef.current) {
    // 1. Constant rotation (your existing logic)
    groupRef.current.rotation.y += 0.005;

    // 2. MOUSE RESPONSE: This makes the cube tilt toward your cursor
    // We multiply by 0.5 so the movement is subtle and smooth
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.5, 
      0.1
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -mouse.x * 0.5, 
      0.1
    );
  }



  
    // 1. Constant rotation for the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      if (textRef.current) {
  // This makes the text float up and down smoothly
  textRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  
  // Keep your existing scale logic too
  const targetScale = isOpen ? 1 : 0;
  textRef.current.scale.setScalar(THREE.MathUtils.lerp(textRef.current.scale.x, targetScale, 0.1));
}
    }

    // 2. Open/Close Logic (Controlled by your button now, not just a timer)
    // We use MathUtils.lerp for smooth engineering transitions
    const targetMove = isOpen ? 3.5 : 0; 
    
    faceRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      
      // Update positions based on the 'isOpen' state smoothly
      if (i === 0) mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 1.5 + targetMove, 0.1);
      if (i === 1) mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, -1.5 - targetMove, 0.1);
      if (i === 2) mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, -1.5 - targetMove, 0.1);
      if (i === 3) mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, 1.5 + targetMove, 0.1);
      if (i === 4) mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 1.5 + targetMove, 0.1);
      if (i === 5) mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, -1.5 - targetMove, 0.1);
    });

    // 3. Text Visibility Logic
    if (textRef.current) {
      textRef.current.visible = isOpen;
      const targetScale = isOpen ? 1 : 0;
      textRef.current.scale.setScalar(THREE.MathUtils.lerp(textRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef}>
      {faceConfigs.map((config, i) => (
        <mesh 
          key={i} 
          ref={(el) => (faceRefs.current[i] = el)} 
          position={config.pos} 
          rotation={config.rot}
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial 
            color={textures[i] ? "#ffffff" : config.color} 
            map={textures[i] || null} 
            side={THREE.DoubleSide}
            transparent={true} // CRITICAL: Allows the texture to show properly
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>
      ))}
      
      
      {isOpen && (
  <group position={[0, 0, 0]}>
    {/* The Fireworks Effect: 100 golden particles shimmering around the text */}
    <Sparkles 
      count={100} 
      scale={4} 
      size={6} 
      speed={0.4} 
      opacity={1} 
      color="#FFD700" 
    />
    
    {/* Add this inside your {isOpen && (...)} group */}
<Text
  ref={textRef}
  position={[0, 0.6, 0]} // Raised slightly higher
  fontSize={0.55}
  color="#FFD700" // Golden base
  maxWidth={3}
  textAlign="center"
  fontStyle="italic"
  
  // High-end styling
  outlineWidth={0.05}
  outlineColor="#3d2b00"
  
  // This makes the text "glow" by using a special material
  material-emissive="#FFD700" 
  material-emissiveIntensity={1.5} 
>
  Advance{"\n"}Eid Mubarak
</Text>
  </group>
)}



    </group>
  );
}






{/* <Text
        ref={textRef}
        visible={false}
        position={[0, 0, 0]} 
        fontSize={0.4}
        color="#FFD700" 
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        Advance{"\n"}Eid Mubarak
      </Text> */}