const colorsURL = 'http://localhost:3000/colors'

const $form = document.querySelector('form')
const $cardContainer = document.querySelector('#card-container')

fetch(colorsURL)
    .then(response => response.json())
    .then(colors => {
        colors.forEach(color => {
            createCard(color)     
        })
    })

function createCard(color) {
    const $cardDiv = document.createElement('div')
    $cardDiv.className = 'color-card'
    $cardDiv.style = `background-color: ${color.hex}`
    
    const $cardH2 = document.createElement('h2')
    const $cardP = document.createElement('p')
    const $voteButton = document.createElement('button')
    const $deleteButton = document.createElement('button')
    $cardH2.textContent = color.name
    $cardP.textContent = color.votes
    $voteButton.textContent = '+1 Vote!'
    $deleteButton.textContent = 'X'
    $deleteButton.className = 'delete-button'

    $voteButton.addEventListener('click', () => {
        color.votes += 1
        $cardP.textContent = color.votes
        fetch(`${colorsURL}/${color.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(color)
        }).then(response => response.json())
    })

    $deleteButton.addEventListener('click', () => {
        fetch(`${colorsURL}/${color.id}`, {
            method: 'DELETE'
        }).then(response => response.json())
        location.reload()
    })
    
    $cardDiv.append($cardH2, $cardP, $voteButton, $deleteButton)
    $cardContainer.append($cardDiv) 
}


$form.addEventListener('submit', (event) => {
    event.preventDefault()

    const $colorFormData = new FormData(event.target)
    const $colorName = $colorFormData.get('name')
    const $colorHex = $colorFormData.get('hex')

    const $newColor = {
        name: $colorName,
        hex: $colorHex, 
        votes: 0
    }

    createCard($newColor)

    fetch(colorsURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify($newColor)
    }).then(response => response.json())
})
