import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Gap} from '../../components';

import VideoNotif from '../../components/atoms/VideoNotif';
import FIREBASE from '../../config/FIREBASE';
import {colors} from '../../utils';

const Obat = () => {
  const [data, setData] = useState([]);
  const [modalImage, setModalImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [indexActive, setIndexActive] = useState(0);

  const getNotifImage = () => {
    FIREBASE.database()
      .ref('notifImage')
      .once('value')
      .then(snapshot => {
        const dataSnapshot = snapshot.val() || {};
        let arr = [];

        Object.entries(dataSnapshot).map(val => {
          arr.push({
            url: val[1],
          });
        });

        setData(arr);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getNotifImage();
  }, []);

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={10} />
        <Text style={styles.subtitle}>Supported By Alo Care Apps</Text>
        <Gap height={20} />
        <VideoNotif />
        <Gap height={30} />
        <Text style={styles.subtitle}>
          Referensi Hasil Pemeriksaan Penunjang
        </Text>
        <Gap height={20} />
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{paddingHorizontal: 20}}
          ItemSeparatorComponent={() => <Gap height={20} />}
          ListFooterComponent={() => <Gap height={200} />}
          renderItem={({item, index}) => (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setModalImage(true);
                  setIndexActive(index);
                }}>
                <Image
                  width={200}
                  height={200}
                  style={styles.image}
                  source={{uri: item?.url}}
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() =>
            loading ? (
              <View style={{alignItems: 'center'}}>
                <ActivityIndicator size={40} color={colors.primary} />
              </View>
            ) : null
          }
        />
      </ScrollView>
      <Modal visible={modalImage} transparent>
        <ImageViewer
          index={indexActive}
          enableSwipeDown
          onSwipeDown={() => setModalImage(false)}
          imageUrls={data}
        />
      </Modal>
    </View>
  );
};

export default Obat;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#112340',
  },
  header: {
    paddingHorizontal: 12,
    //paddingTop: 8,
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FBFCFC',
    paddingLeft: 10,
    textAlign: 'center',
  },
  KalkulatorDosisObat: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FBFCFC',
  },
  DosisObatEmergency: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FBFCFC',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 20,
  },
});
