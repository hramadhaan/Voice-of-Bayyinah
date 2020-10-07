import Kategori from '../../models/Kategori';
import firebase from 'firebase';
import storage from '@react-native-firebase/storage';

export const FETCH_KATEGORI = 'FETCH_KATEGORI';
export const CREATE_KATEGORI = 'CREATE_KATEGORI';
export const UPDATE_KATEGORI = 'UPDATE_KATEGORI';
export const DELETE_KATEGORI = 'DELETE_KATEGORI';

export const fetchKategori = () => {
  return async (dispatch) => {
    try {
      await firebase
        .database()
        .ref('kategori')
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          const loadedKategori = [];
          for (const key in data) {
            loadedKategori.push(
              new Kategori(
                key,
                data[key].nama,
                data[key].image,
                data[key].fileName,
              ),
            );
          }

          dispatch({type: FETCH_KATEGORI, kategori: loadedKategori});
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const createKategori = (nama, image) => {
  return async (dispatch) => {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    storage()
      .ref('kategori')
      .child(filename)
      .putFile(uri)
      .then(async () => {
        const url = await storage()
          .ref('kategori')
          .child(filename)
          .getDownloadURL();

        firebase
          .database()
          .ref('kategori')
          .push({
            nama: nama,
            image: url,
            fileName: filename,
          })
          .then((snapshot) => {
            dispatch({
              type: CREATE_KATEGORI,
              kategoriData: {
                id: snapshot.key,
                kategori: nama,
                gambar: url,
                fileName: filename,
              },
            });
          });
      });
  };
};

export const deleteKategori = (id) => {
  return async (dispatch) => {
    firebase
      .database()
      .ref('kategori')
      .child(`${id}`)
      .remove()
      .then(async () => {
        firebase.database().ref('artikel-kategori').child(id).remove();
        firebase
          .database()
          .ref('artikel')
          .orderByChild('kategori')
          .equalTo(id)
          .once('value')
          .then((response) => {
            response.forEach((snapshot) => {
              // console.log(snapshot.key);
              firebase.database().ref('artikel').child(snapshot.key).remove();
            });
          });

        dispatch({
          type: DELETE_KATEGORI,
          kid: id,
        });
      });
  };
};

export const updatedKategori = (id, nama, image, fileName) => {
  return async (dispatch) => {
    // console.log(image);
    firebase
      .database()
      .ref('kategori')
      .child(id)
      .update({
        nama: nama,
      })
      .then(() => {
        dispatch({
          type: UPDATE_KATEGORI,
          kid: id,
          kategoriData: {
            kategori: nama,
            gambar: '',
            fileName: fileName,
          },
        });
      });

    if (image !== null) {
      const {uri} = image;
      const nameFile = uri.substring(uri.lastIndexOf('/') + 1);

      // HAPUS FILENAME
      await storage().ref('kategori').child(fileName).delete();

      await storage()
        .ref('kategori')
        .child(nameFile)
        .putFile(uri)
        .then(async () => {
          const url = await storage()
            .ref('kategori')
            .child(nameFile)
            .getDownloadURL();

          firebase.database().ref('kategori').child(id).update({
            image: url,
            fileName: nameFile,
          });
        });
    }
  };
};
