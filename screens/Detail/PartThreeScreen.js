import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  ToastAndroid,
  PermissionsAndroid,
  Share,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import BottomSheet from 'reanimated-bottom-sheet';
import Tooltip from 'react-native-walkthrough-tooltip';

const PartThreeScreen = (props) => {
  const artikelKatId = props.navigation.getParam('artikelId');
  const artikelId = props.navigation.getParam('postId');
  const favId = props.navigation.getParam('favId');
  const kategoriId = props.navigation.getParam('kategori');
  const kategoriKatalog = useSelector((state) =>
    state.kategori.kategoris.find((kat) => kat.id === kategoriId),
  );

  const [isEnabled, setIsEnabled] = useState(false);
  const [path, setPath] = useState(true);
  const [tips, setIsTips] = useState(false);

  let artikelKatalog;

  const loadKey = useCallback(async () => {
    try {
      const key = await AsyncStorage.getItem('dark');
      console.log(key);
      if (key !== null) {
        setIsEnabled(true);
      } else if (key === null) {
        setIsEnabled(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    loadKey().then(() => {});
  }, [loadKey]);

  if (artikelKatId === undefined && artikelId === undefined) {
    artikelKatalog = useSelector((state) =>
      state.artikel.artikel.find((art) => art.id === favId),
    );
    console.log('Katalog' + artikelKatalog);
  } else if (artikelId === undefined) {
    artikelKatalog = useSelector((state) =>
      state.artikelKategori.subArtikel.find((art) => art.id === artikelKatId),
    );
  } else if (artikelKatId === undefined) {
    artikelKatalog = useSelector((state) =>
      state.artikel.artikel.find((art) => art.id === artikelId),
    );
  }

  if (artikelKatalog === undefined) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isEnabled ? 'black' : 'white',
          },
        ]}>
        <Text
          style={{
            color: isEnabled ? 'white' : 'black',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          Artikel kamu hilang atau terhapus dari database
        </Text>
      </View>
    );
  }

  if (kategoriKatalog === undefined) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isEnabled ? 'black' : 'white',
          },
        ]}>
        <Text
          style={{
            color: isEnabled ? 'white' : 'black',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          Artikel kamu hilang atau terhapus dari database
        </Text>
      </View>
    );
  }

  const askPermissions = () => {
    async function requestExternealWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Voice of Bayyinah External Storage Write Permission',
            message:
              'Voice of Bayyinah needs acces to Storage data in your SD Card',
          },
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          // SOMETINGH
          createPdf();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', 'err');
      }
    }
    if (Platform.OS === 'android') {
      requestExternealWritePermission();
    }
  };

  const createPdf = async () => {
    // PART ONE
    const partOne = artikelKatalog.partOne;
    const partOneH = partOne.replace(/(?:\r\n|\r|\n)/g, '<br>');
    const partOneF = partOneH.replace('#', '');

    // PART TWO
    const partTwo = artikelKatalog.partTwo;
    const partTwoH = partTwo.replace(/(?:\r\n|\r|\n)/g, '<br>');
    const partTwoF = partTwoH.replace('#', '');

    // PART THREE
    const partThree = artikelKatalog.partThree;
    const partThreeH = partThree.replace(/(?:\r\n|\r|\n)/g, '<br>');
    const partThreeF = partThreeH.replace('#', '');

    let options = {
      html: `<h1 style="text-align: center;">${artikelKatalog.judul}</h1>
      <strong>Penulis: ${artikelKatalog.penulis}</strong>
      <p>${partOneF}</p>
      <p>${partTwoF}</p>
      <p>${partThreeF}</p>`,
      fileName: `${artikelKatalog.judul}`,
      directory: 'Download/voice_of_bayyinah',
    };
    let file = await RNHTMLtoPDF.convert(options);
    setPath(file.filePath);
    ToastAndroid.show(file.filePath, ToastAndroid.LONG);
    console.log('Download: ', file.filePath);
    FileViewer.open(file.filePath, {showOpenWithDialog: true})
      .then(() => {
        console.log('berhasil');
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${artikelKatalog.partThree}\n\nArtikel tentang ${artikelKatalog.judul}, Ayo Download Aplikasinya Voice of Bayyinah di Google Play Store`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  if (artikelKatalog.partThree === '') {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: isEnabled ? 'white' : 'black',
          }}>
          Part 3 belum tersedia saat ini
        </Text>
      </View>
    );
  }

  const renderTooltip = (section, message) => (
    <View>
      <Text style={{fontWeight: 'bold', fontSize: 17, textAlign: 'left'}}>
        {section}
      </Text>
      <Text style={{fontSize: 15, textAlign: 'left', marginTop: 4}}>
        {message}
      </Text>
    </View>
  );

  const renderContent = () => (
    <View
      style={{
        backgroundColor: isEnabled ? '#212121' : 'white',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        padding: 16,
        height: 140,
      }}>
      <View
        style={{
          borderTopWidth: 3,
          borderTopColor: '#ccc',
          width: '30%',
          alignSelf: 'center',
        }}
      />

      <View style={styles.button}>
        <Tooltip
          isVisible={tips}
          displayInsets={{top: 100, right: 100}}
          content={renderTooltip(
            'Perhatikan',
            'Untuk mendapatkan hasil share yang sempurna, maka harus memilih tombol "Copy to Clipboard" lalu tempel ke teks yang ingin dibagikan',
          )}
          placement={'top'}
          onClose={() => setIsTips(false)}>
          <Button title="Share" color="red" onPress={onShare} />
        </Tooltip>
      </View>

      <View style={styles.button}>
        <Button title="Download as PDF" color="red" onPress={askPermissions} />
      </View>
    </View>
  );

  const sheetRef = useRef(null);

  return (
    <>
      <ScrollView>
        <View
          style={{
            marginBottom: 50,
            flex: 1,
          }}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{uri: kategoriKatalog.gambar}}
              style={styles.image}
              resizeMode="cover">
              <View
                style={{flex: 1, backgroundColor: 'black', opacity: 0.31}}
              />
              <Text style={styles.title}>{kategoriKatalog.kategori}</Text>
            </ImageBackground>
          </View>
          <View style={{paddingHorizontal: 12, paddingVertical: 16}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isEnabled ? 'white' : 'black',
              }}
              selectable>
              {artikelKatalog.judul}{' '}
            </Text>
            <Text
              style={{
                color: isEnabled ? 'white' : 'black',
              }}>
              Oleh: {artikelKatalog.penulis}
            </Text>
            <View
              style={{
                borderColor: 'red',
                borderBottomWidth: 2,
                marginVertical: 16,
              }}
            />
            <Text
              selectable={true}
              style={{
                lineHeight: 22,
                color: isEnabled ? 'white' : 'black',
              }}>
              {artikelKatalog.partThree}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: isEnabled ? '#4c4c4c' : 'red',
          position: 'absolute',
          bottom: 15,
          right: 15,
          height: 60,
          width: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={async () => {
          await sheetRef.current.snapTo(140);
          setTimeout(() => {
            setIsTips(true);
          }, 200);
        }}>
        <Icon name="share-2" color="white" size={24} />
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, 140]}
        borderRadius={10}
        renderContent={renderContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  imageContainer: {
    height: 180,
  },
  image: {
    height: '100%',
    width: '100%',
    color: 'black',
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    top: 15,
    left: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

PartThreeScreen.navigationOptions = (navData) => {
  return {
    title: 'Part III',
  };
};

export default PartThreeScreen;
