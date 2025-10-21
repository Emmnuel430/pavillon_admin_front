import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (publishAt) {
      const chosenDate = new Date(publishAt);
      const minDate = new Date(Date.now() + 5 * 60 * 1000);
      if (chosenDate < minDate) {
        setError(
          "La date de publication doit être au moins 5 minutes après maintenant."
        );
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      // Use FormData to allow file upload (mirrors AddGalerie.js)
      const user = JSON.parse(sessionStorage.getItem("user-info"));
      const userId = user ? user.id : null;

      if (!userId) {
        alert("Utilisateur non authentifié. Veuillez vous connecter.");
        navigate("/admin-tdi");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (publishAt) formData.append("publish_at", publishAt);
      if (image) formData.append("image", image);

      let response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/blogs`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || result.error || "Erreur lors de l'ajout.");
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Article ajouté !");
      setTitle("");
      setContent("");
      setImage("");
      setPublishAt("");
      navigate("/admin-tdi/blog");
    } catch (err) {
      setError("Une erreur s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/blog</Back>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 mt-5">
            <h1>Ajouter un article</h1>
            <br />

            {error && (
              <ToastMessage message={error} onClose={() => setError("")} />
            )}

            <div className="mb-3">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Titre de l'article"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                id="image"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Article (texte) *</label>
              <textarea
                className="form-control"
                rows={8}
                placeholder="Article détaillé (optionnel)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Date de publication (optionnelle)
              </label>
              <input
                type="datetime-local"
                min={new Date(Date.now() + 5 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
                className="form-control"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => setShowModal(true)}
              disabled={loading || !title || !content}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Chargement...
                </span>
              ) : (
                <span>Ajouter l'article</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer l'ajout"
        body={<p>Voulez-vous vraiment ajouter cet article ?</p>}
        btnColor="primary"
      />
    </Layout>
  );
};

export default AddArticle;
