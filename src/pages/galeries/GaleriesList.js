import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { Link } from "react-router-dom";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";

const GaleriesList = () => {
  const [galeries, setGaleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGalerie, setSelectedGalerie] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedGaleries, setSortedGaleries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGaleries = async () => {
      setLoading(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galeries`
        );
        if (!res.ok)
          throw new Error("Erreur lors de la récupération des galeries");
        const data = await res.json();
        setGaleries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGaleries();
  }, []);

  const handleOpenModal = (galerie) => {
    setSelectedGalerie(galerie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedGalerie(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedGalerie) return;

    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galeries/${selectedGalerie.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.message) {
        alert("Galerie supprimée !");
        setGaleries(galeries.filter((g) => g.id !== selectedGalerie.id));
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la galerie");
    } finally {
      handleCloseModal();
    }
  };

  const filteredGaleries = sortedGaleries.filter((g) =>
    g.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher une galerie..."
              onSearch={setSearchQuery}
              delay={300}
            />

            <HeaderWithFilter
              allowedRoles={["dev", "super_admin"]}
              title="Galeries"
              link="/admin-gest/galeries/add"
              linkText="Ajouter"
              main={galeries.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={galeries}
              setSortedList={setSortedGaleries}
              alphaField="titre"
              dateField="created_at"
            />

            <div
              className="d-flex flex-wrap gap-4 justify-content-center"
              style={{ rowGap: "1.5rem" }}
            >
              {filteredGaleries.length ? (
                filteredGaleries.map((g) => (
                  <div
                    key={g.id}
                    className="card shadow-sm border p-2"
                    style={{
                      width: "260px",
                      borderRadius: "0.75rem",
                      flex: "0 1 auto",
                    }}
                  >
                    {g.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${g.image}`}
                        alt={g.titre}
                        className="card-img-top"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                        }}
                      />
                    ) : (
                      <div
                        className="w-100 d-flex align-items-center justify-content-center bg-light text-secondary"
                        style={{
                          height: "180px",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <i className="fa fa-image fa-3x"></i>
                      </div>
                    )}

                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="card-title mb-1 text-truncate">
                          {g.titre}
                        </h6>
                        <p className="text-muted small mb-3">{g.categorie}</p>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/admin-gest/update/galerie/${g.id}`}
                          className="btn btn-outline-warning btn-sm"
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Supprimer"
                          onClick={() => handleOpenModal(g)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5 w-100">
                  <i className="fa fa-images fa-3x mb-3"></i>
                  <p>Aucune image trouvée.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer la galerie{" "}
            <strong>{selectedGalerie?.titre || "Inconnue"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default GaleriesList;
