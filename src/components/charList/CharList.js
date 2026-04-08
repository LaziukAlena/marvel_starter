import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./charList.scss";

const CharList = (props) => {
  const [char, setChar] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    updateAllChar(offset, true);
  }, []);

  const updateAllChar = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset).then(onCharLoader);
  };

  const onCharLoader = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setChar((char) => [...char, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const setActiveID = (id) => {
    setActiveId(id);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {spinner}
      <CharListView
        chars={char}
        activeId={activeId}
        setActiveId={setActiveID}
        onCharSelected={props.onCharSelected}
      />
      {errorMessage}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => updateAllChar(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const CharListView = ({ chars, activeId, setActiveId, onCharSelected }) => {
  const elements = chars.map((item) => {
    const { id, name, thumbnail } = item;

    let imgStyle = { objectFit: "cover" };
    if (
      thumbnail ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
    ) {
      imgStyle = { objectFit: "unset" };
    }

    const handleKeyDown = (event, id) => {
      if (event.key === "Enter") {
        onCharSelected(id);
      }
    };

    return (
      <li
        key={id}
        className={`char__item ${activeId === id ? "char__item_selected" : ""}`}
        onMouseEnter={() => setActiveId(id)}
        onMouseLeave={() => setActiveId(null)}
        onFocus={() => setActiveId(id)}
        onBlur={() => setActiveId(null)}
        onClick={() => onCharSelected(id)}
        onKeyDown={(event) => handleKeyDown(event, id)}
        tabIndex="0"
      >
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div className="char__name">{name}</div>
      </li>
    );
  });

  return <ul className="char__grid">{elements}</ul>;
};

CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
