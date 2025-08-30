
// This is a simple Alpine.js plugin that adds a `fetch` magic property to Alpine.js components.
// Load this script just before Alpine.js to use it.
// Use: x-data="{ catData: $fetch('https://catfact.ninja/fact') }"

document.addEventListener('alpine:init', () => {
    Alpine.magic('fetch', () => (url, options = {}) => {
        let data = Alpine.reactive({});
        
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                Object.assign(data, json);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        
        return data;
    });
});
