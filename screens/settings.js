import React from 'react';
import { View, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

class Settings extends React.Component {
  handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'There was an error logging out. Please try again.');
    }
  };

  render() {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Button title="Logout" onPress={this.handleLogout} />
      </View>
    );
  }
}

export default Settings;
