document.addEventListener('DOMContentLoaded', function () {
    // Lade den Inhalt der ausgelagerten HTML-Datei
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Füge den ausgelagerten HTML-Code in den Container ein
            document.getElementById('outsourcedContainer').innerHTML = xhr.responseText;
        }
    };
    xhr.open('GET', '../styles/outsourced.html', true);
    xhr.send();
});
