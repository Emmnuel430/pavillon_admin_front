import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const UpdateGalerie = () => {
  const { id } = useParams(); // Récupère l'id de la galerie à modifier
  const navigate = useNavigate();

  const [categorie, setCategorie] = useState("");
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = user ? user.id : null;

  // Récupérer les données existantes de la galerie
  useEffect(() => {
    const fetchGalerie = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galeries/${id}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de la galerie");
        const data = await response.json();
        setCategorie(data.categorie || "");
        setTitre(data.titre || "");
        setImage(data.image || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGalerie();
  }, [id]);

  const handleConfirm = () => {
    setShowModal(false);
    updateGalerie();
  };

  const handleCancel = () => setShowModal(false);

  const updateGalerie = async () => {
    if (!categorie || !titre) {
      setError("Categorie et titre sont requis.");
      return;
    }

    setError("");
    setLoading(true);

    if (!userId) {
      alert("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/admin-gest");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categorie", categorie);
      formData.append("titre", titre);
      if (image) {
        formData.append("image", image);
      } else {
        formData.append("delete_image", "1");
      }

      let result = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galeries/${id}`,
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
      alert("Galerie mise à jour avec succès !");
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
        <h1>Modifier la galerie</h1>

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
        {image && !(image instanceof File) && (
          <div className="alert alert-warning">
            <button
              categorie="button"
              className="mb-2 px-3 py-1 btn btn-danger text-white rounded"
              onClick={() => setImage(null)}
            >
              Supprimer l'image
            </button>
            <br />
            Une image est déjà associée . Cliquez ci-dessus pour en choisir une
            nouvelle.
          </div>
        )}
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
            "Mettre à jour"
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la mise à jour"
        body={<p>Voulez-vous vraiment mettre à jour cette image ?</p>}
        btnColor="success"
      />
    </Layout>
  );
};

export default UpdateGalerie;
