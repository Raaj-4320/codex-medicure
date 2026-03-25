import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationState {
  country: string;
  state: string;
  city: string;
  area: string;
  locality: string;
  pincode: string;
  landmark: string;
}

interface LocationContextType {
  location: LocationState | null;
  setLocation: (loc: LocationState) => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
  isLocationSet: false,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationState | null>(() => {
    const saved = localStorage.getItem('medsmart_location');
    return saved ? JSON.parse(saved) : null;
  });

  const setLocation = (loc: LocationState) => {
    setLocationState(loc);
    localStorage.setItem('medsmart_location', JSON.stringify(loc));
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLocationSet: !!location }}>
      {children}
    </LocationContext.Provider>
  );
};
