// BlankPage.js
import React from 'react';
import { View, Text } from 'react-native';
import FakeNavBar from './FakeNavBar';

const BlankPage = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Add your header or any other content here */}
      <FakeNavBar />
      <Text>This is a blank page</Text>
    </View>
  );
};

export default BlankPage;
