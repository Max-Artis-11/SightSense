import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// Google Maps iframe embed code
const iFrameCode = `
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2525.92356063523!2d-1.9763398231369977!3d50.72135726782064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4873a6c139a0a79f%3A0x1fb2eda78ff7a5e3!2sPoole%20Hospital!5e0!3m2!1sen!2suk!4v1744533481982!5m2!1sen!2suk" 
    width="100%" 
    height="100%" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
`;

export default function Aid() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: `<html><body>${iFrameCode}</body></html>` }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
