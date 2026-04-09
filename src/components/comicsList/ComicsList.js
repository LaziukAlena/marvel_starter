import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./comicsList.scss";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const ComicsList = (props) => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    updateAllComics(offset, true);
  }, []);

  const updateAllComics = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset).then(onComicsLoader);
  };

  const onComicsLoader = (newListComics) => {
    let ended = false;
    if (newListComics.length < 8) {
      ended = true;
    }

    setComics((comics) => [...comics, ...newListComics]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 8);
    setComicsEnded(ended);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {spinner}
      <ComicsListView comics={comics} />
      {errorMessage}
      <button
        className="button button__main button__long"
        onClick={() => updateAllComics(offset)}
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const ComicsListView = ({ comics }) => {
  const comicBook = comics.map((item) => {
    const { id, title, price, thumbnail } = item;

    return (
      <li key={id} className="comics__item">
        <Link to={`/comics/${id}`}>
          <img src={thumbnail} alt={title} className="comics__item-img" />
          <div className="comics__item-name">{title}</div>
          <div className="comics__item-price">{price}$</div>
        </Link>
      </li>
    );
  });

  return <ul className="comics__grid">{comicBook}</ul>;
};

export default ComicsList;
