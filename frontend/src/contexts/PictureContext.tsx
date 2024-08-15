import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PictureContextProps {
  onPictureAdded: () => void;
}

interface PictureProviderProps {
  children: ReactNode;
}

const PictureContext = createContext<PictureContextProps | undefined>(undefined);

export const PictureProvider: React.FC<PictureProviderProps> = ({ children }) => {
  const [refreshPictures, setRefreshPictures] = useState(0);

  const onPictureAdded = () => {
    setRefreshPictures(refreshPictures + 1);
  };

  return (
    <PictureContext.Provider value={{ onPictureAdded }}>
      {children}
    </PictureContext.Provider>
  );
};

export const usePictureContext = () => {
  const context = useContext(PictureContext);
  if (!context) {
    throw new Error('usePictureContext must be used within a PictureProvider');
  }
  return context;
};
