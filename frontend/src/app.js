import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data from backend API
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      });
  }, []);

  // Submit new item to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setIsSubmitting(true);
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems([...items, data]);
        setNewItem('');
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error('Error adding item:', err);
        setIsSubmitting(false);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Segment */}
        <div style={styles.header}>
          <div style={styles.badge}>GKE Autopilot</div>
          <h1 style={styles.title}>3-Tier Architecture Cloud Lab</h1>
          <p style={styles.subtitle}>
            React Frontend decoupled from Node.js Backend, orchestrating state down to a persistent PostgreSQL instance.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Form Segment */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter a payload name (e.g., Cache-01)..."
              style={styles.input}
              disabled={isSubmitting}
            />
          </div>
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isSubmitting || !newItem.trim() ? 0.7 : 1,
              cursor: isSubmitting || !newItem.trim() ? 'not-allowed' : 'pointer'
            }}
            disabled={isSubmitting || !newItem.trim()}
          >
            {isSubmitting ? 'Writing...' : 'Commit to DB'}
          </button>
        </form>

        {/* Data List Segment */}
        <div style={styles.listSection}>
          <h3 style={styles.sectionTitle}>Database Ledger ({items.length} records)</h3>
          
          {isLoading ? (
            <div style={styles.loadingState}>Polling cluster internal network...</div>
          ) : items.length === 0 ? (
            <div style={styles.emptyState}>
              No records found. The <code>sample_items</code> table is currently blank. Commit a payload above to verify the data lifecycle.
            </div>
          ) : (
            <ul style={styles.list}>
              {items.map((item, index) => (
                <li key={item.id || index} style={styles.listItem}>
                  <span style={styles.itemId}>#{item.id || index + 1}</span>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.timestamp}>✓ Persistent</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Clean, modern style configurations
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '560px',
    padding: '32px',
    border: '1px solid #e2e8f0',
  },
  header: {
    marginBottom: '24px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '9999px',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '0',
  },
  divider: {
    border: '0',
    borderTop: '1px solid #f1f5f9',
    margin: '24px 0',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  inputWrapper: {
    flex: '1',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  listSection: {
    marginTop: '16px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 12px 0',
  },
  loadingState: {
    textAlign: 'center',
    padding: '24px',
    color: '#64748b',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
  },
  itemId: {
    fontWeight: '600',
    color: '#94a3b8',
    marginRight: '12px',
    fontFamily: 'monospace',
  },
  itemName: {
    color: '#334155',
    fontWeight: '500',
    flex: '1',
  },
  timestamp: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '500',
  },
};

export default App;