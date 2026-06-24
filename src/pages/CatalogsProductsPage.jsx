import { useState, useRef } from 'react'
import TopNavigation from '../components/TopNavigation'
import './CatalogsProductsPage.css'

const PLANT_OPTIONS = [
  '3rd Party', '3rd Party-SeAh', 'Opole, Poland', 'P009',
  'Monterrey', 'Houston', 'Fort Madison', 'Hanover', 'Other'
]

const INITIAL_PRODUCTS = [
  { id: 4,  description: 'WELD 71T-9 052X15KG 945KG BULK PACK',      partNumber: '15T914249V', productCode: '208', plant: '3rd Party-SeAh',  upc: '',              supplier: '' },
  { id: 5,  description: 'ESAB Cutmaster 40',                          partNumber: '0559140006', productCode: '328', plant: 'Opole, Poland',    upc: '',              supplier: '' },
  { id: 6,  description: 'ER1100 3/64(1.2mm) x 1#(0.45kg) SPOOL',    partNumber: '110001047',  productCode: '224', plant: 'P009',             upc: '0662922100031', supplier: 'SUPPLIER' },
  { id: 7,  description: 'ER1100 1/16(1.6mm) x 1#(0.45kg) SPOOL',    partNumber: '110001062',  productCode: '224', plant: 'P009',             upc: '0662922100048', supplier: '' },
  { id: 8,  description: 'ER1100 1/16(1.6mm) x 5#(2.27kg) SPOOL',    partNumber: '110005062',  productCode: '224', plant: 'P009',             upc: '0662922100086', supplier: '' },
  { id: 9,  description: 'ER1100 .035(0.9mm) x 16#(7.26kg) SPOOL',   partNumber: '110015035',  productCode: '224', plant: 'P009',             upc: '0662922000102', supplier: '' },
  { id: 10, description: 'ER1100 3/64(1.2mm) x 16#(7.26kg) SPOOL',   partNumber: '110015047',  productCode: '224', plant: 'P009',             upc: '0662922000126', supplier: '' },
]

const EMPTY_FORM = { description: '', partNumber: '', productCode: '', plant: '3rd Party', upc: '', supplier: '' }

export default function CatalogsProductsPage({ user, onLogout, onNavigate, currentPage }) {
  const [products, setProducts]     = useState(INITIAL_PRODUCTS)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [editingId, setEditingId]   = useState(null)
  const [search, setSearch]         = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importMsg, setImportMsg]   = useState('')
  const fileRef = useRef()

  /* ── Form helpers ── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = () => {
    if (!form.description || !form.partNumber) {
      alert('Description and Part Number are required.')
      return
    }
    if (editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? { ...form, id: editingId } : p))
      setEditingId(null)
    } else {
      const nextId = Math.max(...products.map(p => p.id), 0) + 1
      setProducts([...products, { ...form, id: nextId }])
    }
    setForm(EMPTY_FORM)
  }

  const handleDelete = () => {
    if (editingId === null) { alert('Select a record first (double-click a row).'); return }
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== editingId))
      setEditingId(null)
      setForm(EMPTY_FORM)
    }
  }

  const handleClean = () => { setForm(EMPTY_FORM); setEditingId(null) }

  const handleRowDoubleClick = (p) => {
    setEditingId(p.id)
    setForm({ description: p.description, partNumber: p.partNumber, productCode: p.productCode, plant: p.plant, upc: p.upc, supplier: p.supplier })
  }

  const handleSearch = () => {
    setSearchActive(true)
  }

  const clearSearch = () => { setSearch(''); setSearchActive(false) }

  /* ── Filtered list ── */
  const displayed = searchActive && search
    ? products.filter(p => p.partNumber.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    : products

  /* ── Excel import ── */
  const downloadTemplate = () => {
    const csv = [
      'Description,Part Number,Product Code,Plant,UPC,Supplier',
      'ESAB Cutmaster 40,0559140006,328,3rd Party,0662922000001,ESAB',
      'ER1100 3/64 SPOOL,110001047,224,P009,0662922100031,SUPPLIER',
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'products_template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportMsg('Processing file...')
    try {
      const text = await file.text()
      const rows = text.trim().split('\n').slice(1) // skip header
      const imported = rows
        .filter(r => r.trim())
        .map((row, i) => {
          const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
          return {
            id: Math.max(...products.map(p => p.id), 0) + i + 1,
            description: cols[0] || '',
            partNumber:  cols[1] || '',
            productCode: cols[2] || '',
            plant:       cols[3] || '3rd Party',
            upc:         cols[4] || '',
            supplier:    cols[5] || '',
          }
        })
        .filter(p => p.description && p.partNumber)
      setProducts(prev => {
        const existingPNs = new Set(prev.map(p => p.partNumber))
        const newOnes = imported.filter(p => !existingPNs.has(p.partNumber))
        return [...prev, ...newOnes]
      })
      setImportMsg(`✅ ${imported.length} records imported successfully.`)
      fileRef.current.value = ''
    } catch {
      setImportMsg('❌ Error reading file. Please use the CSV template format.')
    }
  }

  return (
    <div className="cat-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="cat-container">
        {/* Title */}
        <div className="cat-title-bar">
          <div>
            <h1>Products</h1>
            <p>Products Registration</p>
          </div>
          <button className="import-btn" onClick={() => { setShowImport(true); setImportMsg('') }}>
            ⬆ Import from Excel / CSV
          </button>
        </div>

        {/* Form */}
        <div className="cat-form-card">
          <div className="cat-form-grid">
            <div className="cat-field">
              <label>#:</label>
              <input value={editingId ?? 'Auto'} readOnly className="cat-input readonly" />
            </div>
            <div className="cat-field">
              <label>Description:</label>
              <input name="description" value={form.description} onChange={handleChange} className="cat-input" placeholder="Product description" />
            </div>
            <div className="cat-field">
              <label>Part Number:</label>
              <div className="cat-input-row">
                <input name="partNumber" value={form.partNumber} onChange={handleChange} className="cat-input" placeholder="Part number" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="cat-input search-box" placeholder="Search part #..." />
                <button className="cat-search-btn" onClick={handleSearch}>Search</button>
                {searchActive && <button className="cat-clear-btn" onClick={clearSearch}>✕</button>}
              </div>
            </div>
            <div className="cat-field">
              <label>Product Code:</label>
              <input name="productCode" value={form.productCode} onChange={handleChange} className="cat-input" placeholder="Product code" />
            </div>
            <div className="cat-field">
              <label>Plant:</label>
              <select name="plant" value={form.plant} onChange={handleChange} className="cat-input">
                {PLANT_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="cat-field">
              <label>UPC:</label>
              <input name="upc" value={form.upc} onChange={handleChange} className="cat-input" placeholder="UPC code" />
            </div>
            <div className="cat-field">
              <label>Supplier:</label>
              <input name="supplier" value={form.supplier} onChange={handleChange} className="cat-input" placeholder="Supplier name" />
            </div>
          </div>

          <div className="cat-form-actions">
            <button className="btn-save"   onClick={handleSave}>Save</button>
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
            <button className="btn-clean"  onClick={handleClean}>Clean</button>
          </div>
        </div>

        {/* Table */}
        <div className="cat-table-section">
          <div className="cat-table-header-row">
            <span className="cat-table-title">Products</span>
            <span className="cat-table-hint">💡 Double-click a row to edit</span>
          </div>
          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Part Number</th>
                  <th>Product Code</th>
                  <th>Plant</th>
                  <th>UPC</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 && (
                  <tr><td colSpan={7} className="no-records">No records found.</td></tr>
                )}
                {displayed.map(p => (
                  <tr
                    key={p.id}
                    className={editingId === p.id ? 'row-selected' : ''}
                    onDoubleClick={() => handleRowDoubleClick(p)}
                  >
                    <td>{p.id}</td>
                    <td>{p.description}</td>
                    <td className="part-link">{p.partNumber}</td>
                    <td>{p.productCode}</td>
                    <td>{p.plant}</td>
                    <td>{p.upc}</td>
                    <td>{p.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cat-table-footer">Total: {displayed.length} products</div>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="modal-overlay" onClick={() => setShowImport(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Import Products from Excel / CSV</h2>
              <button className="modal-close" onClick={() => setShowImport(false)}>✕</button>
            </div>

            <div className="modal-section">
              <h3>📋 Required File Format</h3>
              <p>Your file must have these columns in this exact order:</p>
              <div className="format-table-wrap">
                <table className="format-table">
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>Field</th>
                      <th>Required</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>A</td><td>Description</td><td className="req">Yes</td><td>ESAB Cutmaster 40</td></tr>
                    <tr><td>B</td><td>Part Number</td><td className="req">Yes</td><td>0559140006</td></tr>
                    <tr><td>C</td><td>Product Code</td><td>No</td><td>328</td></tr>
                    <tr><td>D</td><td>Plant</td><td>No</td><td>3rd Party</td></tr>
                    <tr><td>E</td><td>UPC</td><td>No</td><td>0662922100031</td></tr>
                    <tr><td>F</td><td>Supplier</td><td>No</td><td>ESAB Corp</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="format-notes">
                <p>⚠️ <strong>Row 1</strong> must be the header row (column names). Data starts on Row 2.</p>
                <p>⚠️ Duplicate Part Numbers will be skipped automatically.</p>
                <p>⚠️ Save your Excel file as <strong>.csv (Comma delimited)</strong> before uploading.</p>
              </div>
            </div>

            <div className="modal-section">
              <h3>⬇ Download Template</h3>
              <p>Download a pre-formatted CSV template with sample data:</p>
              <button className="btn-template" onClick={downloadTemplate}>
                ⬇ Download products_template.csv
              </button>
            </div>

            <div className="modal-section">
              <h3>⬆ Upload File</h3>
              <p>Select your completed CSV file to import:</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="file-input"
              />
              {importMsg && (
                <div className={`import-msg ${importMsg.startsWith('✅') ? 'success' : importMsg.startsWith('❌') ? 'error' : 'info'}`}>
                  {importMsg}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setShowImport(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
