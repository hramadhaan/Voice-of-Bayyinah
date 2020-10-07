import {
  CREATE_KATEGORI,
  UPDATE_KATEGORI,
  DELETE_KATEGORI,
  FETCH_KATEGORI,
} from '../action/KategoriAction';
import Kategori from '../../models/Kategori';

const initialState = {
  kategoris: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_KATEGORI:
      const newKategori = new Kategori(
        action.kategoriData.id,
        action.kategoriData.kategori,
        action.kategoriData.gambar,
        action.kategoriData.fileName,
      );
      return {
        ...state,
        kategoris: state.kategoris.concat(newKategori),
      };
    case FETCH_KATEGORI:
      return {
        kategoris: action.kategori,
      };
    case DELETE_KATEGORI:
      return {
        ...state,
        kategoris: state.kategoris.filter(
          (product) => product.id !== action.kid,
        ),
      };
    case UPDATE_KATEGORI:
      const kategoriIndex = state.kategoris.findIndex(
        (kat) => kat.id === action.kid,
      );

      const updatedKategori = new Kategori(
        action.kid,
        action.kategoriData.kategori,
        action.kategoriData.gambar,
        action.kategoriData.fileName,
      );

      const updateKategoris = [...state.kategoris];
      updateKategoris[kategoriIndex] = updatedKategori;

      return {
        ...state,
        kategoris: updateKategoris,
      };
  }
  return state;
};
