const form = document.getElementById('empForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const empTable = document.getElementById('empTable');
let currentEditId = null;

function fetchEmployees() {
  fetch('/api/employees')
    .then(res => res.json())
    .then(data => {
      empTable.innerHTML = '';
      data.forEach(emp => {
        empTable.innerHTML += `
          <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>
              <button onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.email}')">Edit</button>
              <button onclick="deleteEmployee(${emp.id})">Delete</button>
            </td>
          </tr>`;
      });
    });
}

form.onsubmit = (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value,
    email: emailInput.value
  };

  if (currentEditId) {
    fetch(`/api/employees/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      currentEditId = null;
      form.reset();
      fetchEmployees();
    });
  } else {
    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      form.reset();
      fetchEmployees();
    });
  }
};

function editEmployee(id, name, email) {
  nameInput.value = name;
  emailInput.value = email;
  currentEditId = id;
}

function deleteEmployee(id) {
  fetch(`/api/employees/${id}`, { method: 'DELETE' })
    .then(() => fetchEmployees());
}

fetchEmployees();
