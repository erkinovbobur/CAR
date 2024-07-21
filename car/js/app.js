


const apiUrl = "https://669a77e99ba098ed61ffc202.mockapi.io/products/cars";

const $products = document.querySelector("#products");
const $createForm = document.querySelector("#createForm");
const $updateForm = document.querySelector("#updateForm");
const $inputs = $createForm.querySelectorAll(".inputElement");
const $updateInputs = $updateForm.querySelectorAll(".inputElement");

function loadData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error fetching data:', error));
}

function renderProducts(products) {
    $products.innerHTML = "";
    products.forEach(cars => {
        const $div = document.createElement("div");
        $div.className = "card";
        $div.innerHTML = `
            <img width="300" src="${cars.avatar}"/>
            <h3>${cars.name}</h3>
            <strong>$${cars.model}</strong>
            <p>${cars.description}</p>
            <button data-cars-id="${cars.id}" class="update">Update</button>
            <button data-cars-id="${cars.id}" class="delete">Delete</button>
        `;
        $products.appendChild($div);

        
        $div.querySelector('.delete').addEventListener('click', () => {
            deleteCar(cars.id);
        });
    });
}

function handleCreateNewCars(e) {
    e.preventDefault();
    const values = Array.from($inputs).map(input => input.value);
    let cars = {
        title: values[0],
        img: values[1],
        price: values[2],
        description: values[3]
    }

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(cars)
    })
    .then(response => response.json())
    .then(data => {
        loadData();
        $createForm.reset();
    })
    .catch(error => console.error('Error creating car:', error));
}

function handleUpdateCars(e) {
    e.preventDefault();
    const id = $updateForm.getAttribute("data-current-update-cars-id");
    const values = Array.from($updateInputs).map(input => input.value);
    let cars = {
        title: values[0],
        img: values[1],
        price: values[2],
        description: values[3]
    }

    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(cars)
    })
    .then(response => response.json())
    .then(data => {
        loadData();
        $updateForm.removeAttribute("data-current-update-cars-id");
    })
    .catch(error => console.error('Error updating car:', error));
}

function handleFillUpdateForm(e) {
    if (e.target.classList.contains("update")) {
        const id = e.target.dataset.carsId;
        fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(data => {
            $updateInputs[0].value = data.title;
            $updateInputs[1].value = data.img;
            $updateInputs[2].value = data.price;
            $updateInputs[3].value = data.description;
            $updateForm.setAttribute("data-current-update-cars-id", id);
        })
        .catch(error => console.error('Error fetching car for update:', error));
    }
}

async function deleteCar(id) {
    if (confirm('Are you sure you want to delete this car?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadData(); 
            } else {
                throw new Error('Failed to delete car');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    }
}

$createForm.addEventListener("submit", handleCreateNewCars);
$updateForm.addEventListener("submit", handleUpdateCars);
$products.addEventListener("click", handleFillUpdateForm);

loadData(); 
