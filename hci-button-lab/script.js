let count = 0;

const actionBtn = document.getElementById('actionBtn');
const resetBtn   = document.getElementById('resetBtn');
const status     = document.getElementById('status');

function updateStatus() {
    if (count === 0) {
        status.textContent = "Status will appear here";
        status.style.borderColor = "#28a745"; // back to green
    } else {
        status.textContent = `✅ Processed ${count} time${count !== 1 ? 's' : ''}`;
    }
}

function performAction() {
    count++;

    // FEEDBACK: visual click effect
    actionBtn.classList.add('click-feedback');
    setTimeout(() => {
        actionBtn.classList.remove('click-feedback');
    }, 400);

    updateStatus();

    // CONSTRAINT + SIGNIFIER: limit reached
    if (count >= 3) {
        actionBtn.disabled = true;
        actionBtn.classList.add('constrained', 'disabled-signifier');
        status.textContent = '⛔ Limit reached (3 clicks max)';
        status.style.borderColor = '#dc3545'; // red for error
    }
}

function resetCounter() {
    count = 0;
    actionBtn.disabled = false;
    actionBtn.classList.remove('constrained', 'disabled-signifier');
    updateStatus();
}

// Connect buttons to functions
actionBtn.addEventListener('click', performAction);
resetBtn.addEventListener('click', resetCounter);

// Optional: make reset button also give a little feedback
resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('click-feedback');
    setTimeout(() => resetBtn.classList.remove('click-feedback'), 400);
});