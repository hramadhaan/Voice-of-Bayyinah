import Artikel from '../../models/Artikel';
import firebase from 'firebase';

export const VIEW_SUB_ARTIKEL = 'VIEW_SUB_ARTIKEL';

export const fetchSubArtikel = (kategoriId) => {
  return async (dispatch) => {
    firebase
      .database()
      .ref('artikel-kategori')
      .child(kategoriId)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        console.log('Data Action: ' + data);
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
        dispatch({
          type: VIEW_SUB_ARTIKEL,
          subKategori: loadedArtikel.reverse(),
        });
      });
  };
};
