const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');
let planetsData = [];
const animationSpeed = 1;

// Function to resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call resizeCanvas on window resize
window.addEventListener('resize', resizeCanvas);

// Call resizeCanvas initially
resizeCanvas();

// Fetch planet data from JSON
fetch('planets.json')
    .then(response => response.json())
    .then(data => {
        planetsData = data;
        startAnimation();
    });

// Function to draw the sun
function drawSun() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'orange';
    ctx.fill();
}

// Function to draw elliptical orbits
function drawOrbits() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    planetsData.forEach(planet => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, planet.distanceFromSun, planet.distanceFromSun * 0.7, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
    });
}

// Function to draw and animate planets with names
function drawPlanets() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    planetsData.forEach(planet => {
        const angle = (Date.now() / 1000) * (animationSpeed / planet.orbitalPeriod);
        const x = centerX + planet.distanceFromSun * Math.cos(angle);
        const y = centerY + planet.distanceFromSun * 0.7 * Math.sin(angle); // Elliptical path

        // Draw planet
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.fill();

        // Draw planet name with click event
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.size - 5);

        // Check if the user clicks on the name
        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            if (Math.abs(clickX - x) < 20 && Math.abs(clickY - (y - planet.size - 5)) < 10) {
                showPlanetDetails(planet);
            }
        });
    });
}

// Main animation loop
function startAnimation() {
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSun();
        drawOrbits();
        drawPlanets();
        requestAnimationFrame(animate);
    }
    animate();
}

// Function to show planet details in the modal
function showPlanetDetails(planet) {
    document.getElementById('planetName').innerText = planet.name;
    document.getElementById('planetImage').src = planet.image;
    document.getElementById('planetSurfaceDescription').innerText = planet.surfaceDescription;
    document.getElementById('planetFormationInfo').innerText = planet.formationInfo;
    document.getElementById('planetMoons').innerText = planet.moons;

    $('#planetDetailsDialog').modal('show');
}

// Hide modal on close button click
$('.close').on('click', function() {
    $('#planetDetailsDialog').modal('hide');
});
