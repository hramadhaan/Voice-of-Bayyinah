import {VIEW_SUB_ARTIKEL} from '../action/ArtikelKategoriAction';


const initialState = {
  subArtikel: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VIEW_SUB_ARTIKEL:
      return {
        subArtikel: action.subKategori,
      };
    default:
      return state;
  }
};
