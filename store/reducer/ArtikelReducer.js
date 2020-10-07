import {
  ADD_ARTIKEL,
  VIEW_ARTIKEL,
  UPDATE_ARTIKEL,
  REMOVE_ARTIKEL,
} from '../action/ArtikelAction';
import Artikel from '../../models/Artikel';

const initialState = {
  artikel: [],
  subArtikel: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTIKEL:
      const newArtikel = new Artikel(
        action.artikelData.id,
        action.artikelData.judul,
        action.artikelData.penulis,
        action.artikelData.kategoriId,
        action.artikelData.partOne,
        action.artikelData.partTwo,
        action.artikelData.partThree,
        action.artikelData.hashtag,
        action.artikelData.timeStamp,
      );
      return {
        ...state,
        artikel: state.artikel.concat(newArtikel),
      };
    case VIEW_ARTIKEL:
      return {
        artikel: action.artikel,
      };
    case UPDATE_ARTIKEL:
      const artikelIndex = state.artikel.findIndex(
        (art) => art.id === action.aid,
      );

      const updatedArtikel = new Artikel(
        action.aid,
        action.artikelData.judul,
        action.artikelData.penulis,
        action.artikelData.kategoriId,
        action.artikelData.partOne,
        action.artikelData.partTwo,
        action.artikelData.partThree,
        action.artikelData.hashtag,
        action.artikelData.timeStamp,
      );

      const updateArtikel = [...state.artikel];
      updateArtikel[artikelIndex] = updatedArtikel;

      return {
        ...state,
        artikel: updateArtikel,
      };
    case REMOVE_ARTIKEL:
      return {
        ...state,
        artikel: state.artikel.filter((artikel) => artikel.id !== action.aid),
      };
    default:
      return state;
  }
};
