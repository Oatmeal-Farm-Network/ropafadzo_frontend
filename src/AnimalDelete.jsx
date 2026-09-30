import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import AccountLayout from "./AccountLayout";

const apiBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AnimalDelete() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const businessID = searchParams.get("BusinessID");
  const animalID   = searchParams.get("AnimalID");
  const navigate   = useNavigate();

  const [animal,     setAnimal]     = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [Business,   setBusiness]   = useState(null);
  const [confirmed,  setConfirmed]  = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(true);

  const token    = localStorage.getItem("access_token");
  const peopleID = localStorage.getItem("people_id");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (!animalID || !businessID) { navigate("/animals"); return; }

    Promise.all([
      fetch(`${apiBase}/api/animals/${animalID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
      fetch(`${apiBase}/api/animals/${animalID}/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).catch(() => ({})),
      fetch(`${apiBase}/api/businesses/profile/${businessID}`).then(r => r.json()),
    ])
      .then(([a, photos, b]) => {
        setAnimal(a);
        setCoverPhoto(photos.list_page_image || null);
        setBusiness(b);
        setLoading(false);
      })
      .catch(() => { setError(t('animal_delete.err_load')); setLoading(false); });
  }, [animalID, businessID]);

  const handleDelete = async () => {
    if (!confirmed) {
      setError(t('animal_delete.err_confirm_required'));
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        navigate(`/animals?BusinessID=${businessID}`, {
          state: { deleted: animal?.FullName || t('animal_delete.animal_fallback') },
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || t('animal_delete.err_generic'));
      }
    } catch {
      setError(t('animal_delete.err_generic'));
    }
    setDeleting(false);
  };

  const breadcrumbs = [
    { label: t('animal_delete.breadcrumb_dashboard'), to: '/dashboard' },
    { label: t('animal_delete.breadcrumb_livestock') },
    { label: t('animal_delete.breadcrumb_animals'), to: `/animals?BusinessID=${businessID}` },
    { label: t('animal_delete.breadcrumb_delete') },
  ];

  if (loading) {
    return (
      <AccountLayout Business={Business} BusinessID={businessID} PeopleID={peopleID}
        pageTitle={t('animal_delete.page_title')} breadcrumbs={breadcrumbs}>
        <div style={{ padding: 40, textAlign: "center", color: "#8b7355" }}>{t('animal_delete.loading')}</div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout Business={Business} BusinessID={businessID} PeopleID={peopleID}
      pageTitle={t('animal_delete.page_title')} breadcrumbs={breadcrumbs}>
      <div style={{ maxWidth: 620, margin: "40px auto", padding: "0 16px 60px" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2c1a0e", marginBottom: 20 }}>
          {t('animal_delete.heading')}
        </h1>

        {animal && (
          <div style={{
            background: "#fff8f6", border: "1px solid #f5c6c6", borderRadius: 10,
            padding: "24px", marginBottom: 24,
            display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            {coverPhoto && (
              <img
                src={coverPhoto}
                alt={animal.FullName}
                style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: "1px solid #f5c6c6" }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#2c1a0e", marginBottom: 4 }}>
                {animal.FullName || t('animal_delete.unnamed')}
              </div>
              {animal.SpeciesName && (
                <div style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 10 }}>{animal.SpeciesName}</div>
              )}
              {animal.Description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: animal.Description }}
                  style={{ fontSize: 13, color: "#5a3e2b", lineHeight: 1.6, maxHeight: 120, overflow: "hidden",
                    maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
                />
              ) : (
                <div style={{ fontSize: 13, color: "#a08060", fontStyle: "italic" }}>{t('animal_delete.no_description')}</div>
              )}
            </div>
          </div>
        )}

        <p style={{ fontSize: 14, color: "#5a3e2b", marginBottom: 24, lineHeight: 1.6 }}>
          {t('animal_delete.warning_body')} <strong>{t('animal_delete.cannot_undo')}</strong>
        </p>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => { setConfirmed(e.target.checked); setError(null); }}
            style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: "#2c1a0e", fontWeight: 600 }}>
            {t('animal_delete.confirm_label')}
          </span>
        </label>

        {error && (
          <div style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: deleting ? "#e08080" : "#dc2626",
              color: "#fff", border: "none", borderRadius: 6,
              padding: "10px 28px", fontWeight: 700, fontSize: 15,
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? t('animal_delete.btn_deleting') : t('animal_delete.btn_delete')}
          </button>
          <button
            onClick={() => navigate(`/animals?BusinessID=${businessID}`)}
            disabled={deleting}
            style={{
              background: "#f2ebe3", color: "#5a3e2b", border: "1px solid #d5c9bc",
              borderRadius: 6, padding: "10px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}
          >
            {t('animal_delete.btn_cancel')}
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}
