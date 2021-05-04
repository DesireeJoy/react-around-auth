import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";

function App() {
  //States
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlaceOpen, setIsAddPlaceOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  function handleDeleteConfirm(e) {
    e.preventDefault();
    setIsDeleteOpen(false);

    api
      .removeCard(selectedCard._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== selectedCard._id);
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }
  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .then(() => {
        api
          .getCardList()

          .then((res) => {
            setCards(res);
          })

          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((res) => {
        setCurrentUser(res);
      })
      .then(() => {
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));
  }

  //Open Popups
  function handleEditAvatarClick(e) {
    e.preventDefault();
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick(e) {
    e.preventDefault();
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick(e) {
    e.preventDefault();
    setIsAddPlaceOpen(true);
  }

  function handleUpdateAvatar(avatar) {
    api
      .setAvatar({ avatar })
      .then((res) => {
        setCurrentUser(res);
      })
      .then(() => {
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));
  }

  //Close Popups
  function closeAllPopups() {
    setIsAddPlaceOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteOpen(false);
    setEnlargeImage(false);
  }
  function handleCardClick(card) {
    setEnlargeImage(true);
    setSelectedCard(card);
  }
  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => setIsAddPlaceOpen(false))
      .catch((err) => console.log(err));
  }
  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })

      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    // Check one more time if this card was already liked

    const isLiked = card.likes.some((c) => c._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        // Create a new array based on the existing one and put a new card into it
        const newCards = cards.map((item) =>
          item._id === card._id ? newCard : item
        );

        // Update the state
        setCards(newCards);

        return false;
      })
      .catch((err) => console.log(err));
  }
  function handleDeleteWarn(card) {
    setSelectedCard(card);
    setIsDeleteOpen(true);
  }
  return (
    <div>
      <div className="body">
        <div className="page">
          <CurrentUserContext.Provider value={currentUser}>
            <Switch>
              <Route path="/signup"></Route>
              <Route path="/signin"></Route>
              <Header />
            </Switch>

            <Main
              handleEditAvatarClick={handleEditAvatarClick}
              handleEditProfileClick={handleEditProfileClick}
              handleAddPlaceClick={handleAddPlaceClick}
              handleCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDeleteClick={handleDeleteWarn}
            />
            <ImagePopup
              onClose={closeAllPopups}
              selectedCard={selectedCard}
              isOpen={enlargeImage}
            />
            <DeleteConfirmPopup
              isOpen={isDeleteOpen}
              onClose={closeAllPopups}
              onSubmit={handleDeleteConfirm}
              name="delete"
              title="Are you sure?"
              buttonText="Yes"
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
              isOpen={isAddPlaceOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <Footer />
          </CurrentUserContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
