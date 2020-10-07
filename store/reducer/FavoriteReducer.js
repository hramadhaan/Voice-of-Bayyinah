import {DELETE_FAVORITE, VIEW_FAVORITE} from '../action/FavoriteAction';

const initialState = {
  favorite: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VIEW_FAVORITE:
      return {
        favorite: action.favorite,
      };
    case DELETE_FAVORITE:
      return {
        ...state,
        favorite: state.favorite.filter(
          (favorite) => favorite.id !== action.fid,
        ),
      };
  }
  return state;
};
