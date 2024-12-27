import React, { createContext, useState, useContext } from "react";

interface ColorContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  tertiaryColor: string;
  setTertiaryColor: (color: string) => void;
}

const ColorContext = createContext<ColorContextType>({
  primaryColor: "#ca00fc", 
  setPrimaryColor: () => {},
  secondaryColor: "#d8a9fc", 
  setSecondaryColor: () => {},
  tertiaryColor: "#F1DAFF", 
  setTertiaryColor: () => {},
});

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState("#ca00fc");
  const [secondaryColor, setSecondaryColor] = useState("#d8a9fc");
  const [tertiaryColor, setTertiaryColor] = useState("#F1DAFF");

  return (
    <ColorContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        tertiaryColor,
        setTertiaryColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);
