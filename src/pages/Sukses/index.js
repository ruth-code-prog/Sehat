import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CurrencyFormatter from 'react-native-currency-formatter';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Button,
  Gap,
  HomeProfile,
  Loading,
  ModalPenunjang,
  PopUp,
} from '../../components';
import FIREBASE from '../../config/FIREBASE';
import {colors, getData} from '../../utils';
import TextUser from '../TextUser';

const Sukses = () => {
  const navigation = useNavigation();
  const [userHomeData, setUserHomeData] = useState({});
  const [videoData, setVideoData] = useState([]);
  const [profile, setProfile] = useState({
    fullName: '',
  });
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [indexActive, setIndexActive] = useState(0);
  const [popUp, setPopUp] = useState(false);

  const [penunjangModal, setPenunjangModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      FIREBASE.auth().onAuthStateChanged(async data => {
        if (data) {
          getUserHomeData(data.uid);
        } else {
          AsyncStorage.clear();
        }
      });
    }, []),
  );

  useEffect(() => {
    getImage();
    getUserData();
  }, []);

  const getUserData = () => {
    getData('user')
      .then(res => {
        const data = res;
        let arr = [];
        data?.image?.filter(val => val).map(val => arr.push({url: val}));
        setImageData(arr);
        setProfile(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const getUserHomeData = uid => {
    FIREBASE.database()
      .ref('users/' + uid)
      .on('value', snapshot => {
        if (snapshot.val()) {
          setUserHomeData(snapshot.val());
        }
      });
  };

  const getImage = () => {
    if (!popUp) {
      setPopUp(true);
    }
  };

  const ImageLoading = ({item, index}) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [loadingShare, setLoadingShare] = useState(false);

    const shareImage = url => {
      setLoadingShare(true);
      const fs = RNFetchBlob.fs;
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item?.url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(base64Data => {
          // here's base64 encoded image
          console.log(base64Data);
          setLoadingShare(false);

          Share.open({
            url: `data:image/jpeg;base64, ${base64Data}`,
          })
            .then(res => {
              console.log('ree', res);
            })
            .catch(err => {
              err && console.error(err);
            });
          // remove the file from storage
          return fs.unlink(imagePath);
        })
        .catch(err => {
          setLoadingShare(false);
          console.error(err);
        });
    };
    return (
      <View style={{marginBottom: 24}}>
        <TouchableOpacity
          onPress={() => {
            setModalImage(true);
            setIndexActive(index);
          }}>
          <Image
            onLoadEnd={() => {
              setLoadingImage(false);
            }}
            source={{uri: item?.url}}
            style={styles.imageBox}
          />
          {loadingImage && (
            <View style={{marginVertical: 24}}>
              <ActivityIndicator color={colors.primary} size={40} />
            </View>
          )}
        </TouchableOpacity>
        {loadingShare ? (
          <ActivityIndicator size={24} />
        ) : (
          <TouchableOpacity
            onPress={() => shareImage(item?.url)}
            style={styles.btnShare}>
            <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>
              Bagikan Foto
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/ILprivacyBackground.png')}
      style={styles.container}>
      {loading && <Loading />}
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.point}> Welcome</Text>
        <HomeProfile profile={profile} />
        <Gap height={20} />
        {imageData?.map((item, index) => (
          <ImageLoading index={index} key={index} item={item} />
        ))}
        <Gap height={20} />
        <Button
          onPress={() =>
          navigation.navigate('DrugReferensi')}
          title="Drug Referensi"
          style={{width: '100%'}}
        />
        <Gap height={20} />
        <Button
          onPress={() =>
            navigation.navigate('Video', {
              profile,
            })
          }
          title="TeleMedicine Berbayar"
          style={{width: '100%'}}
        />
        <Gap height={20} />
        <Button
          onPress={() => setPenunjangModal(true)}
          title="User Input Image"
          style={{width: '100%'}}
        />
        <View style={styles.image}>
          <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
            <Image
              source={require('../../assets/logOut.png')}
              style={styles.chat}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <TextUser />
        <Modal visible={modalImage} transparent>
          <ImageViewer
            index={indexActive}
            enableSwipeDown
            onSwipeDown={() => setModalImage(false)}
            imageUrls={imageData}
          />
        </Modal>
      </ScrollView>
      <PopUp visible={popUp} onClose={() => setPopUp(false)} />
      <ModalPenunjang
        visible={penunjangModal}
        profile={userHomeData}
        onSubmit={() => setPenunjangModal(false)}
        onClose={() => setPenunjangModal(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#34495E',
  },
  chat: {
    width: 100,
    height: 100,
  },
  imageBox: {
    height: 200,
    width: 200,
    borderRadius: 20,
  },
  //url: {marginTop: 6}
  point: {
    fontSize: 14,
    color: '#E5B654',
    marginTop: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#E5B654',
    marginTop: 12,
  },
  btnShare: {
    backgroundColor: colors.button.primary.background,
    padding: 8,
    marginTop: 8,
  },
});

export default Sukses;
