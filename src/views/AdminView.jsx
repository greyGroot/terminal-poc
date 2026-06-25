import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from '../i18n';

const socket = io('/');

export default function HomeView() {
  const [config, setConfig] = useState({ prizes: [] });
  const [networkClients, setNetworkClients] = useState(0);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data));

    socket.on('NETWORK_STATUS', (data) => {
      setNetworkClients(data.clients);
    });

    return () => {
      socket.off('NETWORK_STATUS');
    };
  }, []);

  const handleSave = async () => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    alert(t('admin_save') + ' OK!');
  };

  const handleReset = () => {
    socket.emit('RESET_STATE');
  };

  const updatePrize = (index, field, value) => {
    const newPrizes = [...config.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setConfig({ ...config, prizes: newPrizes });
  };

  return (
    <div className="admin-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title" style={{ fontSize: '2rem', marginBottom: 0 }}>{t('admin_title')}</h1>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ background: '#333', color: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #555' }}
        >
          <option value="uk">UKR</option>
          <option value="en">ENG</option>
        </select>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', marginTop: '1rem' }}>
        {t('admin_network')}: <strong style={{ color: 'var(--mc-orange)', fontSize: '1.2rem' }}>{networkClients}</strong>
      </p>

      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <div className="input-group">
          <label>{t('admin_cooldown')}</label>
          <input 
            type="number" 
            min="0" max="180"
            value={config.cooldownMinutes ?? 5} 
            onChange={(e) => setConfig({ ...config, cooldownMinutes: parseInt(e.target.value) || 0 })} 
            style={{ maxWidth: '150px' }}
          />
        </div>
      </div>

      <div className="admin-card">
        {config.prizes.map((prize, idx) => (
          <div key={prize.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '100px', marginBottom: 0 }}>
              <label>ID</label>
              <input type="text" value={prize.id} readOnly style={{ opacity: 0.5 }} />
            </div>
            <div className="input-group" style={{ flex: 2, minWidth: '200px', marginBottom: 0 }}>
              <label>Name ({lang.toUpperCase()})</label>
              <input 
                type="text" 
                value={lang === 'uk' ? prize.name_uk : prize.name_en} 
                onChange={(e) => updatePrize(idx, `name_${lang}`, e.target.value)} 
              />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '100px', marginBottom: 0 }}>
              <label>Quantity</label>
              <input 
                type="number" 
                value={prize.quantity} 
                onChange={(e) => updatePrize(idx, 'quantity', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
        ))}
        <button className="btn" onClick={handleSave} style={{ marginTop: '1.5rem', width: '100%' }}>
          {t('admin_save')}
        </button>
      </div>

      <div className="admin-card" style={{ borderColor: 'rgba(235, 0, 27, 0.3)' }}>
        <h3 style={{ color: 'var(--mc-red)', marginBottom: '1rem', textAlign: 'center' }}>DANGER ZONE</h3>
        <button className="btn btn-danger" onClick={handleReset} style={{ width: '100%' }}>
          {t('admin_reset')}
        </button>
      </div>
    </div>
  );
}
