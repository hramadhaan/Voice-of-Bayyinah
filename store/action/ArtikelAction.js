import moment from 'moment';
import Artikel from '../../models/Artikel';
import firebase from 'firebase';

export const ADD_ARTIKEL = 'ADD_ARTIKEL';
export const VIEW_ARTIKEL = 'VIEW_ARTIKEL';
export const UPDATE_ARTIKEL = 'UPDATE_ARTIKEL';
export const REMOVE_ARTIKEL = 'REMOVE_ARTIKEL';

export const fetchArtikel = () => {
  return async (dispatch) => {
    try {
      await firebase
        .database()
        .ref('artikel')
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          const loadedArtikel = [];
          for (const key in data) {
            loadedArtikel.push(
              new Artikel(
                key,
                data[key].judul,
                data[key].penulis,
                data[key].kategori,
                data[key].partOne,
                data[key].partTwo,
                data[key].partThree,
                data[key].hashtag,
                data[key].timeStamp,
              ),
            );
          }
          dispatch({type: VIEW_ARTIKEL, artikel: loadedArtikel.reverse()});
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const addArtikel = (
  judul,
  penulis,
  kategori,
  partOne,
  partTwo,
  partThree,
  hashtag,
) => {
  return async (dispatch) => {
    try {
      const date = moment().format('DD-MM-YYYY h:mm:ss a');

      const ref = await firebase.database().ref('artikel').push();

      await ref
        .set({
          judul: judul,
          penulis: penulis,
          kategori: kategori,
          partOne: partOne,
          partTwo: partTwo,
          partThree: partThree,
          hashtag: hashtag,
          timeStamp: date,
        })
        .then(async () => {
          const key = await ref.key;
          console.log('Key: ' + key);
          await firebase
            .database()
            .ref('artikel-kategori')
            .child(kategori)
            .child(key)
            .set({
              judul: judul,
              penulis: penulis,
              kategori: kategori,
              partOne: partOne,
              partTwo: partTwo,
              partThree: partThree,
              hashtag: hashtag,
              timeStamp: date,
            });
          dispatch({
            type: ADD_ARTIKEL,
            artikelData: {
              id: key,
              judul: judul,
              penulis: penulis,
              kategoriId: kategori,
              partOne: partOne,
              partTwo: partTwo,
              partThree: partThree,
              hashtag: hashtag,
              timeStamp: date,
            },
          });
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const updateArtikel = (
  id,
  judul,
  penulis,
  kategori,
  partOne,
  partTwo,
  partThree,
  hashtag,
  kategoriLawas,
) => {
  return async (dispatch) => {
    try {
      await firebase
        .database()
        .ref('artikel')
        .child(id)
        .update({
          judul: judul,
          penulis: penulis,
          kategori: kategori,
          partOne: partOne,
          partTwo: partTwo,
          partThree: partThree,
          hashtag: hashtag,
        })
        .then(async () => {
          await firebase
            .database()
            .ref('artikel-kategori')
            .child(kategoriLawas)
            .child(id)
            .remove()
            .then(async () => {
              await firebase
                .database()
                .ref('artikel-kategori')
                .child(kategori)
                .child(id)
                .set({
                  judul: judul,
                  penulis: penulis,
                  kategori: kategori,
                  partOne: partOne,
                  partTwo: partTwo,
                  partThree: partThree,
                  hashtag: hashtag,
                });
            });

          dispatch({
            type: UPDATE_ARTIKEL,
            aid: id,
            artikelData: {
              judul: judul,
              penulis: penulis,
              kategori: kategori,
              partOne: partOne,
              partTwo: partTwo,
              partThree: partThree,
              hashtag: hashtag,
            },
          });
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const deleteArtikel = (id, kategori) => {
  return async (dispatch) => {
    await firebase
      .database()
      .ref('artikel')
      .child(id)
      .remove()
      .then(() => {
        firebase
          .database()
          .ref('artikel-kategori')
          .child(kategori)
          .child(id)
          .remove();

        dispatch({type: REMOVE_ARTIKEL, aid: id});
      });
  };
};
