import React, {Component, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import FIREBASE from '../../config/FIREBASE';
import {JadwalCard} from '../../components';

const DrugReferensi = props => {
  const [jadwals, setJadwals] = useState([]);
  const [jadwalsAll, setJadwalsAll] = useState([]);
  const [searchJadwalLoading, setSearchJadwalLoading] = useState(false);

  useEffect(() => {
    getJadwals();
  }, []);

  const getJadwals = () => {
    FIREBASE.database()
      .ref('jadwal')
      .on('value', res => {
        const arr = [...res.val()];
        setJadwals(arr.filter(val => val !== null));
        setJadwalsAll(arr.filter(val => val !== null));
      });

    setSearchJadwalLoading(false);
  };

  const handleJadwalsFilter = val => {
    setSearchJadwalLoading(true);
    let arr = [...jadwalsAll];
    var searchRegex = new RegExp(val, 'i');
    arr = arr.filter(item => searchRegex?.test(item?.title));
    setJadwals(arr);
    setTimeout(() => {
      setSearchJadwalLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.colom}>
          <Text style={styles.row}>CARI OBAT REFERENSI</Text>
          <View style={styles.imageDok}>
            <Image
              source={require('../../assets/dokterChat.png')}
              style={styles.rowCenter}
            />
          </View>
        </View>

        <View style={styles.cariObat}>
          <TextInput
            onChangeText={val => handleJadwalsFilter(val, jadwals)}
            selectTextOnFocus
            style={styles.searchInput}
            placeholder="MASUKAN KELUHAN/ DIAGNOSA"
            placeholderTextColor="#27AE60"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10, paddingHorizontal: 2}}>
          {searchJadwalLoading ? (
            <ActivityIndicator
              size={40}
              color="#00A2E9"
              style={{marginVertical: 40, marginLeft: 40}}
            />
          ) : (
            jadwals?.map((item, index) => (
              <JadwalCard
                onRemove={() => handleRemoveFavorite(item, jadwals)}
                onAdd={() => handleAddFavorite(item, jadwals)}
                onPress={() => handleBuy(item)}
                type="jadwal"
                key={index}
                item={item}
              />
            ))
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
};
export default DrugReferensi;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingLeft: 10,
    paddingTop: 12,
  },
  colom: {
    alignItems: 'stretch',
    paddingLeft: 40,
  },
  cariObat: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingLeft: 40,
    paddingRight: 10,
    width: '96%',
  },
  searchInput: {
    color: '#00A2E9',
    fontWeight: 'bold',
  },
  row: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 2,
  },

  rowCenter: {
    height: 40,
    width: 40,
    marginTop: -40,
    marginBottom: 10,
    marginLeft: 200,
  },
  imageDok: {
    alignItems: 'center',
  },
});
