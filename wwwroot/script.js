const API = '/api/products';
let editingId = null;

// ── DOM refs ─────────────────────────────────────────────────────────────────
const tbody      = document.getElementById('tbody');
const formCard   = document.getElementById('form-card');
const formTitle  = document.getElementById('form-title');
const inputNom   = document.getElementById('input-nom');
const inputPrix  = document.getElementById('input-prix');
const btnAdd     = document.getElementById('btn-add');
const btnSave    = document.getElementById('btn-save');
const btnCancel  = document.getElementById('btn-cancel');
const emptyState = document.getElementById('empty-state');
const toast      = document.getElementById('toast');

// ── API calls ────────────────────────────────────────────────────────────────
async function getAll() {
  const r = await fetch(API);
  return r.json();
}

async function create(data) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function update(id, data) {
  return fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function remove(id) {
  return fetch(`${API}/${id}`, { method: 'DELETE' });
}

// ── Render ───────────────────────────────────────────────────────────────────
async function loadProducts() {
  const products = await getAll();
  tbody.innerHTML = '';

  if (products.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="id-cell">#${p.id}</td>
      <td>${p.nom}</td>
      <td class="price-cell">${p.prix.toFixed(2)} €</td>
      <td>
        <button class="btn-icon btn-edit"  onclick="startEdit(${p.id}, '${p.nom}', ${p.prix})">Modifier</button>
        <button class="btn-icon btn-delete" onclick="deleteProduct(${p.id})">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ── Form ──────────────────────────────────────────────────────────────────────
function showForm(title) {
  formTitle.textContent = title;
  formCard.classList.remove('hidden');
  inputNom.focus();
}

function hideForm() {
  formCard.classList.add('hidden');
  inputNom.value = '';
  inputPrix.value = '';
  editingId = null;
}

function startEdit(id, nom, prix) {
  editingId = id;
  inputNom.value = nom;
  inputPrix.value = prix;
  showForm('Modifier le produit');
}

// ── Events ────────────────────────────────────────────────────────────────────
btnAdd.addEventListener('click', () => {
  editingId = null;
  showForm('Nouveau produit');
});

btnCancel.addEventListener('click', hideForm);

btnSave.addEventListener('click', async () => {
  const nom  = inputNom.value.trim();
  const prix = parseFloat(inputPrix.value);

  if (!nom || isNaN(prix) || prix < 0) {
    showToast('Remplissez tous les champs correctement.', 'error');
    return;
  }

  const payload = { nom, prix };

  if (editingId) {
    const r = await update(editingId, { id: editingId, ...payload });
    showToast(r.ok ? 'Produit modifié.' : 'Erreur lors de la modification.', r.ok ? 'success' : 'error');
  } else {
    const r = await create(payload);
    showToast(r.ok ? 'Produit créé.' : 'Erreur lors de la création.', r.ok ? 'success' : 'error');
  }

  hideForm();
  loadProducts();
});

async function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) return;
  const r = await remove(id);
  showToast(r.ok ? 'Produit supprimé.' : 'Erreur.', r.ok ? 'success' : 'error');
  loadProducts();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadProducts();