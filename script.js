function generateCodes() {
    const inputCode = document.getElementById('codeInput').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (inputCode.length !== 6) {
        resultsDiv.innerHTML = '<span class="error">Code must be exactly 6 characters long.</span>';
        return;
    }

    const usedDigits = new Set();
    const missingIndices = [];
    for (let i = 0; i < inputCode.length; i++) {
        const char = inputCode[i];
        if (char === '-') {
            missingIndices.push(i);
        } else if ('123456789'.includes(char)) {
            if (usedDigits.has(char)) {
                resultsDiv.innerHTML = `<span class="error">Duplicate digit found: ${char}</span>`;
                return;
            }
            usedDigits.add(char);
        } else {
            resultsDiv.innerHTML = `<span class="error">Invalid character: ${char}</span>`;
            return;
        }
    }

    const remainingDigits = Array.from('123456789').filter(d => !usedDigits.has(d));

    // Generate all permutations manually
    function generatePermutations(array, path, results) {
        if (path.length === missingIndices.length) {
            results.push([...path]);
            return;
        }
        for (let i = 0; i < array.length; i++) {
            generatePermutations(array.slice(0, i).concat(array.slice(i + 1)), path.concat(array[i]), results);
        }
    }

    const permutations = [];
    generatePermutations(remainingDigits, [], permutations);

    const codes = [];
    for (const perm of permutations) {
        const codeChars = inputCode.split('');
        for (let j = 0; j < missingIndices.length; j++) {
            codeChars[missingIndices[j]] = perm[j];
        }
        codes.push(codeChars.join(''));
    }

    resultsDiv.innerHTML = `<p>Total combinations: <b>${codes.length}</b></p>`;
    if (codes.length > 0) {
        resultsDiv.innerHTML += '<ol>' + codes.map(code => `<li>${code}</li>`).join('') + '</ol>';
    }
}

// Display CSV table
function displayCSVTable() {
    fetch('bunkers_code.csv')
        .then(response => {
            if (!response.ok) throw new Error('CSV file not found');
            return response.text();
        })
        .then(csvData => {
            const lines = csvData.trim().split('\n');
            const headers = lines[0].split(',');
            let html = '<table class="bunker-table"><thead><tr>';
            headers.forEach(h => html += `<th>${h.trim()}</th>`);
            html += '</tr></thead><tbody>';
            for (let i = 1; i < lines.length; i++) {
                const cells = lines[i].split(',');
                html += '<tr>';
                cells.forEach(c => html += `<td>${c.trim()}</td>`);
                html += '</tr>';
            }
            html += '</tbody></table>';
            document.getElementById('csvTable').innerHTML = html;
        })
        .catch(err => {
            document.getElementById('csvTable').innerHTML = '<span class="error">Could not load bunker codes table.</span>';
        });
}

displayCSVTable();
