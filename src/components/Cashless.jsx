import { useState } from 'react';
import { Copy, Check, MoreHorizontal } from 'lucide-react';
import './Cashless.css';

export default function Cashless({ accounts }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, idx) => {
    const updateCopiedState = () => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2500);
    };

    const fallbackCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {
        console.warn('Copy fallback warning:', err);
      }
      updateCopiedState();
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          updateCopiedState();
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  return (
    <section className="cashless-section" id="cashless">
      <div className="brown-card cashless-card-block">
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '2px' }}>
          WEDDING GIFT
        </p>
        <h2 className="cashless-title">Amplop Digital</h2>
        <p className="cashless-desc">
          Doa dan restu Anda adalah hadiah terindah. Namun jika ingin memberikan hadiah, berikut rekening kami.
        </p>

        <div className="cashless-accounts">
          {accounts.map((acc, idx) => (
            <div key={idx} className="account-card" id={`account-card-${idx}`}>
              <div className="account-card__top">
                <div className="account-bank-logo">
                  {acc.logo ? (
                    <img
                      src={acc.logo}
                      alt={`Logo ${acc.bank}`}
                      className="account-bank-img"
                    />
                  ) : (
                    <span className="account-bank-fallback">{acc.bank}</span>
                  )}
                </div>
                <div className="account-dots" aria-hidden="true" title="Detail Rekening">
                  <MoreHorizontal size={20} />
                </div>
              </div>

              <div className="account-card__body">
                <div className="account-card__info">
                  <p className="account-name">{acc.name}</p>
                  <p className="account-number">{acc.account}</p>
                </div>
                <button
                  type="button"
                  className={`btn-copy ${copied === idx ? 'btn-copy--copied' : ''}`}
                  onClick={() => handleCopy(acc.account, idx)}
                  id={`copy-btn-${idx}`}
                  aria-label={`Salin nomor rekening ${acc.bank}`}
                >
                  {copied === idx ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} strokeWidth={2} />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
