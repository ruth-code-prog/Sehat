import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Button, Gap, Input, Link} from '../../components';
import FIREBASE from '../../config/FIREBASE';
import {colors, fonts, showError, showSuccess, storeData, useForm} from '../../utils';

const ForgetPass = ({navigation}) => {

  const [email, setEmail] = useState('');

  const SendEmail = () => {
    var auth = FIREBASE.auth();
    auth
      .sendPasswordResetEmail(email)
      .then((res) => {
        showSuccess('Reset Password sudah terkirim ke Email Anda');
        navigation.replace('Login');
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <Text style={styles.title}>Lupa Password?</Text>
        <Input
          label="Email Address"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
        <Gap height={40} />
        <Button title="Forget Password" onPress={SendEmail} />
        <Gap height={30} />
        <Link
          title="Login"
          size={16}
          align="center"
          onPress={() => navigation.navigate('Login')}
        />
      </ScrollView>
    </View>
  );
};

export default ForgetPass;

const styles = StyleSheet.create({
  page: {paddingHorizontal: 40, backgroundColor: '#112340', flex: 1, justifyContent: 'center'},
  title: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 153,
  },
});
