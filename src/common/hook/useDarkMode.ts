import _ from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import Setting from '../storage/setting';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  useEffect(() => {
    getDarkMode().catch(console.error);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    updateDarkMode();
  }, [darkMode]);

  const getDarkMode = async () => {
    let _darkMode = await Setting.fetchDarkMode();
    setDarkMode(_darkMode);
  };

  const updateDarkMode = async () => {
    await Setting.updateDarkMode(darkMode);
  };

  return [darkMode, setDarkMode] as const;
};
