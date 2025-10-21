import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const UpdateArticle = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [publishAt, setPublishAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/blogs/${id}`
        );
        const result = await response.json();
        if (response.ok && result.data) {
          setTitle(result.data.title || "");
          setContent(result.data.content || "");
          setPublishAt(
            result.data.publish_at
              ? new Date(result.data.publish_at).toISOString().slice(0, 16)
              : ""
          );
          // If the article has an image, keep its URL/object to allow delete or replace
          if (result.data.image) setImage(result.data.image);
        } else {
          setError(result.message || "Erreur lors du chargement.");
        }
      } catch (err) {
        setError("Erreur lors du chargement de l'article.");
      }
    };
    fetchContent();
  }, [id]);

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
      // Mirror UpdateGalerie: use FormData to support image upload/delete
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

      // image state may be a File (new upload) or an existing URL/object
      if (image && image instanceof File) {
        formData.append("image", image);
      } else if (!image) {
        // If image was cleared by user, indicate deletion
        formData.append("delete_image", "1");
      }

      let response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/blogs/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || result.error || "Erreur lors de la mise à jour."
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Article mis à jour !");
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
            <h1>Modifier le l'article</h1>
            <br />

            {error && (
              <ToastMessage
                message={error}
                duration={5000}
                onClose={() => setError("")}
              />
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
                  type="button"
                  className="mb-2 px-3 py-1 btn btn-danger text-white rounded"
                  onClick={() => setImage(null)}
                >
                  Supprimer l'image
                </button>
                <br />
                Une image est déjà associée . Cliquez ci-dessus pour en choisir
                une nouvelle.
              </div>
            )}
            <br />

            <div className="mb-3">
              <label className="form-label">Article (texte)</label>
              <textarea
                className="form-control"
                rows={8}
                placeholder="Article détaillé (optionnel)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date de publication</label>
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
              className="btn btn-success w-100"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Chargement...
                </span>
              ) : (
                <span>Mettre à jour l'article</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier cet article ?</p>}
        btnColor="success"
      />
    </Layout>
  );
};

export default UpdateArticle;
