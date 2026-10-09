import { useState } from 'react';
import './Wishes.css';

const STORAGE_KEY = 'wedding_submitted_wishes_v1';

// Warna avatar berdasarkan huruf pertama nama.
function avatarColor(name = '') {
  const colors = [
    '#8B6347', '#7B8EC8', '#6BAF92', '#C87B7B', '#B8A06B',
    '#7BB8C8', '#C8907B', '#8A7BB8', '#6BB8A0', '#B87B9A',
  ];

  const idx = (name.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}

export default function Wishes({ initialWishes = [] }) {
  // Hanya membaca ucapan yang benar-benar dikirim pengguna.
  const [submittedWishes, setSubmittedWishes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Ucapan contoh selalu berasal langsung dari weddingData.js.
  const wishes = [...submittedWishes, ...initialWishes];

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    attendance: 'Hadir',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
  };

  const handleAttendance = (value) => {
    setFormData((prev) => ({
      ...prev,
      attendance: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Mohon isi nama Anda.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMsg('Mohon tulis ucapan & doa Anda.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newWish = {
        id: Date.now(),
        name: formData.name.trim(),
        whatsapp: formData.whatsapp.trim(),
        attendance: formData.attendance,
        message: formData.message.trim(),
        date: new Date().toISOString(),
      };

      const updated = [newWish, ...submittedWishes];

      setSubmittedWishes(updated);

      // Simpan hanya ucapan kiriman pengguna,
      // bukan initialWishes dari weddingData.js.
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // Ucapan tetap tampil selama sesi berjalan,
        // meskipun browser gagal menyimpannya.
      }

      setFormData({
        name: '',
        whatsapp: '',
        attendance: 'Hadir',
        message: '',
      });

      setIsSubmitting(false);
      setSuccessMsg('Ucapan Anda telah terkirim. Terima kasih! 🎉');

      setTimeout(() => setSuccessMsg(''), 4000);
    }, 600);
  };

  const formatDate = (iso) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  return (
    <section className="wishes-section">
      <div className="wishes-form-area">
        <div className="wishes-floral" aria-hidden="true">
          ✿
        </div>

        <h2 className="section-title wishes-section__title">
          Ucapan &amp; Doa
        </h2>

        <form
          onSubmit={handleSubmit}
          className="wishes-form"
          noValidate
        >
          {errorMsg && (
            <p className="form-error" role="alert">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="form-success" role="status">
              {successMsg}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="wish-name" className="form-label">
              Nama
            </label>
            <input
              id="wish-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Isikan Nama Anda"
              className="form-input"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wish-whatsapp" className="form-label">
              No. Whatsapp
            </label>
            <input
              id="wish-whatsapp"
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Isikan no. whatsapp Anda"
              className="form-input"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <span className="form-label">Kehadiran</span>

            <div
              className="attendance-pills"
              role="group"
              aria-label="Kehadiran"
            >
              {['Hadir', 'Tidak Hadir'].map((opt) => (
                <label
                  key={opt}
                  className={`pill ${formData.attendance === opt
                      ? 'pill--active'
                      : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={opt}
                    checked={formData.attendance === opt}
                    onChange={() => handleAttendance(opt)}
                    className="pill__radio"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="wish-message" className="form-label">
              Ucapan &amp; Do'a
            </label>
            <textarea
              id="wish-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Ucapan & Do'a Anda"
              className="form-input form-textarea"
            />
          </div>

          <button
            id="submit-wish-btn"
            type="submit"
            className="btn-wish-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>

      <div className="brown-card wishes-list-block">
        <h3 className="wishes-list-title">
          Ucapan &amp; Do'a
        </h3>

        <div
          className="wishes-list-divider"
          aria-hidden="true"
        />

        <div className="wishes-list">
          {wishes.map((w) => (
            <div key={w.id} className="wish-card">
              <div
                className="wish-avatar"
                style={{
                  backgroundColor: avatarColor(w.name),
                }}
                aria-hidden="true"
              >
                {(w.name?.[0] || '?').toUpperCase()}
              </div>

              <div className="wish-body">
                <p className="wish-name">{w.name}</p>

                {w.attendance && (
                  <span
                    className={`wish-badge ${w.attendance === 'Hadir'
                        ? 'wish-badge--hadir'
                        : 'wish-badge--tidak'
                      }`}
                  >
                    {w.attendance}
                  </span>
                )}

                <p className="wish-message">{w.message}</p>

                {w.date && (
                  <p className="wish-date">
                    {formatDate(w.date)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {wishes.length === 0 && (
            <p className="wishes-empty">
              Jadilah yang pertama memberikan ucapan!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}