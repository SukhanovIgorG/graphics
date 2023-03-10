export default function () {
    const getSearchResult = (val) => {
        let cards = document.querySelectorAll('.object_card')
        if (val !== null) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.dataset.name !== val) {
                    card.style.display = 'none'
                }
            }
        } else if (val == null) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.style.display = 'block'
            }
        }
    }

    const elem = document.querySelector('.autocomplete')
    document.addEventListener('DOMContentLoaded', function () {
        fetch('./../../navobjects/list/all', {
            method: 'get'
        }).then(res => res.json())
            .then(response => {
                const options = {
                    data: response,
                    onAutocomplete: getSearchResult
                }
                M.Autocomplete.init(elem, options);
            })
            .catch((error) => {
                console.log(error)
            })
    })

    const clearBtn = document.querySelector('.clear_objects')
    clearBtn.addEventListener('click', () => {
        elem.value = ''
        M.updateTextFields()
        getSearchResult(null)
    })
}
