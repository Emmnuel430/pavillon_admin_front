// Importation des dépendances React et des composants nécessaires de React Router
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected";
// Importation des pages et composants utilisés dans les routes
import AccessDenied from "./components/AccessDenied";
import Login from "./pages/Login";
import Home from "./pages/Home";
// ----
import Register from "./pages/users/Register";
import UserList from "./pages/users/UserList";
import UserUpdate from "./pages/users/UserUpdate";

// ----
import Pages from "./pages/makePage/Pages";
import AddPage from "./pages/makePage/AddPage";
import EditPage from "./pages/makePage/EditPage";

import AddGalerie from "./pages/galeries/AddGalerie";
import UpdateGalerie from "./pages/galeries/UpdateGalerie";
import GaleriesList from "./pages/galeries/GaleriesList";
// ----
import ArticleList from "./pages/blog/ArticleList";
import AddArticle from "./pages/blog/AddArticle";
import UpdateArticle from "./pages/blog/UpdateArticle";
// ----
import Settings from "./pages/settings/SettingsList";
import ScrollToTop from "./components/ScrollToTop";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth */}
        <Route path="/admin-gest" element={<Login />} />

        {/* ------------------------ */}
        <Route path="/admin-gest/home" element={<Protected Cmp={Home} />} />

        {/* Utilisateurs (Super Admin uniquement) */}
        <Route
          path="/admin-gest/register"
          element={<Protected Cmp={Register} adminOnly />}
        />
        <Route
          path="/admin-gest/utilisateurs"
          element={<Protected Cmp={UserList} adminOnly />}
        />
        <Route
          path="/admin-gest/update/user/:id"
          element={<Protected Cmp={UserUpdate} adminOnly />}
        />

        {/* ------------------------ */}
        <Route
          path="/admin-tdi/blog/add"
          element={<Protected Cmp={AddArticle} adminOnly />}
        />
        <Route
          path="/admin-tdi/update/blog/:id"
          element={<Protected Cmp={UpdateArticle} adminOnly />}
        />
        <Route
          path="/admin-tdi/blog"
          element={<Protected Cmp={ArticleList} adminOnly />}
        />
        {/* ------------------------ */}
        <Route
          path="/admin-gest/galeries"
          element={<Protected Cmp={GaleriesList} />}
        />
        {/* Ajout d'une nouvelle galerie */}
        <Route
          path="/admin-gest/galeries/add"
          element={<Protected Cmp={AddGalerie} adminOnly />}
        />

        {/* Modification d'une galerie existante */}
        <Route
          path="/admin-gest/update/galerie/:id"
          element={<Protected Cmp={UpdateGalerie} />}
        />
        {/* ------------------------ */}

        {/* Liste des pages */}
        <Route path="/admin-gest/pages" element={<Protected Cmp={Pages} />} />

        {/* Ajout d'une nouvelle page */}
        <Route
          path="/admin-gest/pages/add"
          element={<Protected Cmp={AddPage} devOnly />}
        />

        {/* Modification d'une page existante */}
        <Route
          path="/admin-gest/pages/edit/:id"
          element={<Protected Cmp={EditPage} />}
        />

        {/* ------------------------ */}
        {/* Setings */}
        <Route
          path="/admin-gest/settings"
          element={<Protected Cmp={Settings} adminOnly />}
        />

        {/* Si l'URL n'est pas définie, renvoyer l'utilisateur vers la page de connexion */}
        <Route path="*" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
};

// Exportation du composant AppRoutes pour l'utiliser dans d'autres parties de l'application
export default AppRoutes;
