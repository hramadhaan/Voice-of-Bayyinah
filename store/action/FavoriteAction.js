import firebase from 'firebase';

import Artikel from '../../models/Artikel';

export const VIEW_FAVORITE = 'VIEW_FAVORITE';
export const DELETE_FAVORITE = 'DELETE_FAVORITE';

export const fetchFavorite = () => {
  return async (dispatch) => {
    try {
      await firebase
        .database()
        .ref('favorites')
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          const loadedFavorite = [];
          for (const key in data) {
            // console.log(data[key].judul);
            loadedFavorite.push(
              new Artikel(
                key,
                data[key].idSubKategori,
                data[key].judul,
                data[key].penulis,
                data[key].kategori,
                data[key].pdfSatu,
                data[key].fileNameSatu,
                data[key].pdfDua,
                data[key].fileNameDua,
                data[key].pdfTiga,
                data[key].fileNameTiga,
                data[key].pdfFull,
                data[key].fileNameFull,
                data[key].hashtag,
                data[key].timeStamp,
              ),
            );
          }

          dispatch({
            type: VIEW_FAVORITE,
            favorite: loadedFavorite,
          });
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const deleteFavorite = (id) => {
  return async (dispatch) => {
    await firebase
      .database()
      .ref('favorites')
      .child(`${id}`)
      .remove()
      .then(() => {
        dispatch({type: DELETE_FAVORITE, fid: id});
      });
  };
};
