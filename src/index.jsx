/* eslint-disable no-undef */
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import React from 'react';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import { supabase } from './services/supabase';

import * as Font from 'expo-font';

export default function App() {
  const [session, setSession] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      RedHatDisplay: require('../assets/fonts/RedHatDisplay-Regular.ttf'),
      RedHatDisplayBlack: require('../assets/fonts/RedHatDisplay-Black.ttf'),
      RedHatDisplaySemiBold: require('../assets/fonts/RedHatDisplay-SemiBold.ttf'),
    }).then(() => {
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!fontLoaded) return null;

  return (
    <NavigationContainer>
      {session && session.user.app_metadata.userrole === 'ADMIN' ? (
        <AdminNavigator key={session?.user?.id} session={session} />
      ) : session && session.user ? (
        <AppNavigator key={session?.user?.id} session={session} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
