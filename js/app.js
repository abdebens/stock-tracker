const supabaseUrl = "https://pjllsxludmrhocbgowsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbGxzeGx1ZG1yaG9jYmdvd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNDk4ODYsImV4cCI6MjA0NzYyNTg4Nn0.q7vbt58JpH5-9uUhUrKPHBPvR8tOuxdHOr_tj1t3pdA";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const stockData = [];
const categories = []; // To store categories dynamically

let editingIndex = null;

// Add or Update stock entry
document.getElementById("addStockBtn").addEventListener("click", () => {
  const productName = document.getElementById("productName").value.trim();
  const category = document.getElementById("category").value.trim();
  const stockUnit = parseInt(document.getElementById("stockUnit").value);
  const unit = document.getElementById("unit").value;
  const stockEntry = parseInt(document.getElementById("stockEntry").value);
  const stockOutput = parseInt(document.getElementById("stockOutput").value);
  const entryDate = document.getElementById("entryDate").value;

  if (
    !productName ||
    !category ||
    isNaN(stockUnit) ||
    isNaN(stockEntry) ||
    isNaN(stockOutput) ||
    !entryDate
  ) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const finalStock = stockUnit + stockEntry - stockOutput;

  const stock = {
    productName,
    category,
    stockUnit,
    unit,
    stockEntry,
    stockOutput,
    finalStock,
    entryDate,
  };

  if (editingIndex !== null) {
    stockData[editingIndex] = stock;
    editingIndex = null;
  } else {
    stockData.push(stock);
  }

  document.getElementById("stockForm").reset();
  updateTable(stockData);
});

// Add Category Dynamically
document.getElementById("addCategoryBtn").addEventListener("click", () => {
  const newCategory = document.getElementById("newCategory").value.trim();

  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory); // Add the new category to the list
    updateCategorySelect();
    document.getElementById("newCategory").value = ""; // Clear the input field
  } else {
    alert("Please enter a valid, non-empty category.");
  }
});

// Update the category select options dynamically
function updateCategorySelect() {
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = "<option value=''>Select Category</option>"; // Reset the options

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Filter stock entries
document.getElementById("filterBtn").addEventListener("click", () => {
  const filterMonth = document.getElementById("filterMonth").value;
  const filterCategory = document.getElementById("filterCategory").value.trim();

  const filteredData = stockData.filter((item) => {
    const matchesMonth = !filterMonth || item.entryDate.startsWith(filterMonth);
    const matchesCategory =
      !filterCategory ||
      item.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesMonth && matchesCategory;
  });

  updateTable(filteredData);
});

// Export to Excel
document.getElementById("exportBtn").addEventListener("click", () => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      "Product Name,Category,Stock Unit,Unit,Stock Entry,Stock Output,Final Stock,Entry Date",
    ]
      .concat(
        stockData.map((item) =>
          [
            item.productName,
            item.category,
            item.stockUnit,
            item.unit,
            item.stockEntry,
            item.stockOutput,
            item.finalStock,
            item.entryDate,
          ].join(",")
        )
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "stock_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Update the table
function updateTable(data) {
  const tableBody = document.getElementById("stockTableBody");
  tableBody.innerHTML = "";

  data.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${item.stockUnit}</td>
        <td>${item.unit}</td>
        <td>${item.stockEntry}</td>
        <td>${item.stockOutput}</td>
        <td>${item.finalStock}</td>
        <td>${item.entryDate}</td>
        <td>
          <button onclick="editStock(${index})">Edit</button>
          <button onclick="deleteStock(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Edit stock entry
function editStock(index) {
  const stock = stockData[index];
  document.getElementById("productName").value = stock.productName;
  document.getElementById("category").value = stock.category;
  document.getElementById("stockUnit").value = stock.stockUnit;
  document.getElementById("unit").value = stock.unit;
  document.getElementById("stockEntry").value = stock.stockEntry;
  document.getElementById("stockOutput").value = stock.stockOutput;
  document.getElementById("entryDate").value = stock.entryDate;

  editingIndex = index;
}

// Delete stock entry
function deleteStock(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    stockData.splice(index, 1);
    updateTable(stockData);
  }
}
