import React, { useState, useEffect } from 'react';
import { CityCanvas } from './components/CityCanvas';
import { Random } from './utils/Random';
import './App.css';

interface CitySize {
  name: string;
  min: number;
  max: number;
}

const citySizes: CitySize[] = [
  { name: 'Small Town', min: 6, max: 10 },
  { name: 'Large Town', min: 10, max: 15 },
  { name: 'Small City', min: 15, max: 24 },
  { name: 'Large City', min: 24, max: 40 },
];

function getUrlParams(): { size: number; seed: number } {
  const params = new URLSearchParams(window.location.search);
  const sizeParam = params.get('size');
  const seedParam = params.get('seed');
  
  let size = 15;
  let seed = -1;
  
  if (sizeParam) {
    const parsed = parseInt(sizeParam);
    if (!isNaN(parsed) && parsed >= 6 && parsed <= 40) {
      size = parsed;
    }
  }
  
  if (seedParam) {
    const parsed = parseInt(seedParam);
    if (!isNaN(parsed) && parsed > 0) {
      seed = parsed;
    }
  }
  
  return { size, seed };
}

function updateUrlParams(size: number, seed: number): void {
  const url = new URL(window.location.href);
  url.searchParams.set('size', size.toString());
  url.searchParams.set('seed', seed.toString());
  window.history.replaceState({ size, seed }, '', url.toString());
}

const App: React.FC = () => {
  const [size, setSize] = useState<number>(15);
  const [seed, setSeed] = useState<number>(-1);
  
  useEffect(() => {
    const { size: urlSize, seed: urlSeed } = getUrlParams();
    setSize(urlSize);
    
    if (urlSeed === -1) {
      Random.reset();
      const newSeed = Random.getSeed();
      setSeed(newSeed);
      updateUrlParams(urlSize, newSeed);
    } else {
      setSeed(urlSeed);
    }
  }, []);
  
  const handleSizeChange = (citySize: CitySize) => {
    const newSize = Math.floor((citySize.min + citySize.max) / 2);
    Random.reset();
    const newSeed = Random.getSeed();
    setSize(newSize);
    setSeed(newSeed);
    updateUrlParams(newSize, newSeed);
  };
  
  const handleRegenerate = () => {
    Random.reset();
    const newSeed = Random.getSeed();
    setSeed(newSeed);
    updateUrlParams(size, newSeed);
  };
  
  if (seed === -1) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="app">
      <CityCanvas size={size} seed={seed} />
      <div className="controls">
        <div className="button-group">
          {citySizes.map((citySize) => (
            <button
              key={citySize.name}
              onClick={() => handleSizeChange(citySize)}
              className="size-button"
            >
              {citySize.name}
            </button>
          ))}
        </div>
        <button onClick={handleRegenerate} className="regenerate-button">
          Regenerate
        </button>
      </div>
    </div>
  );
};

export default App;
