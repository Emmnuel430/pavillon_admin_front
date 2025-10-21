import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { formatDateRelative } from "../../utils/formatDateRelative";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedArticles, setSortedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu basé sur le temps

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/blogs`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des articles.");
        const data = await response.json();
        setArticles(data);
        setSortedArticles(data);
      } catch (err) {
        setError("Impossible de charger les données : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, []);

  const handleShowDetails = (blog) => {
    setSelectedArticle(blog);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedArticle(null);
  };

  const handleOpenModal = (blog) => {
    setSelectedArticle(blog);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/blogs/${selectedArticle.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.status === "deleted") {
        alert("Article supprimé !");
        setArticles(articles.filter((c) => c.id !== selectedArticle.id));
        setSortedArticles(
          sortedArticles.filter((c) => c.id !== selectedArticle.id)
        );
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  const filteredArticles = sortedArticles.filter((blog) =>
    `${blog.title}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher un article..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title="Articles"
              link="/admin-tdi/blog/add"
              linkText="Ajouter"
              main={articles.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={articles}
              setSortedList={setSortedArticles}
              dateField="created_at"
            />
            <Table
              hover
              responsive
              className="align-middle text-center table-striped shadow-sm"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titre</th>
                  <th>Date de Pub.</th>
                  <th>Création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <tr key={article.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        {article.title.split(" ").slice(0, 5).join(" ")}
                        {article.title.split(" ").length > 3 && " ..."}
                      </td>

                      <td>
                        {article.publish_at
                          ? formatDateRelative(article.publish_at)
                          : "---"}
                      </td>
                      <td>
                        {article.created_at
                          ? formatDateRelative(article.created_at)
                          : "---"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => handleShowDetails(article)}
                            className="btn btn-info btn-sm me-2"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <Link
                            to={`/admin-tdi/update/blog/${article.id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(article)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucun blog trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <Modal show={showDetails} onHide={handleCloseDetails} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArticle && (
            <div className="container">
              <div className="row mb-2">
                <div className="col-6 fw-bold">Titre</div>
                <div className="col-6">{selectedArticle.title}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Article</div>
                <div className="text-justify">{selectedArticle.content}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le blog{" "}
            <strong>{selectedArticle?.title}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default ArticleList;
