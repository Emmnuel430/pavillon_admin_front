import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const AddGalerie = () => {
  const [categorie, setCategorie] = useState("");
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = user ? user.id : null;

  if (!userId) {
    alert("Utilisateur non authentifié. Veuillez vous connecter.");
    navigate("/admin-gest");
    return;
  }

  const handleConfirm = () => {
    setShowModal(false);
    addGalerie();
  };

  const handleCancel = () => setShowModal(false);

  const addGalerie = async () => {
    if (!categorie || !titre) {
      setError("Categorie et titre sont requis.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("categorie", categorie);
      formData.append("titre", titre);
      if (image) {
        formData.append("image", image);
      }

      let result = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galeries`,
        {
          method: "POST",
          body: formData,
        }
      );

      result = await result.json();

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Image ajoutée avec succès !");
      setCategorie("");
      setTitre("");
      setImage(null);
      navigate("/admin-gest/galeries");
    } catch (e) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-gest/galeries</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajouter une nouvelle image</h1>

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

        {/* Categorie */}
        <label htmlFor="categorie" className="form-label">
          Categorie
        </label>
        <input
          type="text"
          id="categorie"
          className="form-control"
          placeholder="Exple: Mariage , Anniversaire..."
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        />
        <br />

        {/* Titre */}
        <label htmlFor="titre" className="form-label">
          Titre
        </label>
        <input
          type="text"
          id="titre"
          className="form-control"
          placeholder="Titre de la galerie"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <br />

        {/* Image */}
        <label htmlFor="image" className="form-label">
          Image
        </label>
        <input
          type="file"
          id="image"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <br />

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary w-100"
          disabled={!categorie || !titre || loading}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            "Ajouter"
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer l'ajout"
        body={<p>Voulez-vous vraiment ajouter cette image ?</p>}
        btnColor="primary"
      />
    </Layout>
  );
};

export default AddGalerie;
